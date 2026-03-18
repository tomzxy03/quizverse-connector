/**
 * Hook for managing quiz countdown timer
 * Server time is source of truth, client syncs periodically
 */

import { useEffect, useCallback, useRef } from 'react';
import { useQuizAttempt } from '@/contexts/QuizAttemptContext';

interface UseCountdownOptions {
  onTimeUp?: () => void;
  onSync?: (remainingSeconds: number) => Promise<number>;
  syncIntervalMs?: number;
}

export const useCountdown = ({
  onTimeUp,
  onSync,
  syncIntervalMs = 30000, // 30 seconds
}: UseCountdownOptions) => {
  const { remainingSeconds, setRemainingSeconds } = useQuizAttempt();
  const intervalRef = useRef<NodeJS.Timeout>();
  const syncIntervalRef = useRef<NodeJS.Timeout>();
  const lastSyncRef = useRef(0);

  /**
   * Sync with server to get accurate remaining time
   */
  const syncWithServer = useCallback(async () => {
    if (!onSync) return;

    try {
      const serverTime = await onSync(remainingSeconds);
      setRemainingSeconds(serverTime);
      lastSyncRef.current = Date.now();
    } catch (error) {
      console.error('Failed to sync timer with server:', error);
    }
  }, [remainingSeconds, setRemainingSeconds, onSync]);

  /**
   * Start countdown
   */
  const startCountdown = useCallback(() => {
    // Clear existing intervals
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);

    // Sync with server first
    syncWithServer();

    // Countdown every second
    intervalRef.current = setInterval(() => {
      setRemainingSeconds(remainingSeconds - 1 >= 0 ? remainingSeconds - 1 : 0);
      
      if (remainingSeconds - 1 <= 0 && onTimeUp) {
        onTimeUp();
      }
    }, 1000);

    // Sync with server every syncIntervalMs
    syncIntervalRef.current = setInterval(() => {
      syncWithServer();
    }, syncIntervalMs);
  }, [setRemainingSeconds, onTimeUp, syncWithServer, syncIntervalMs]);

  /**
   * Pause countdown
   */
  const pauseCountdown = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = undefined;
    }
  }, []);

  /**
   * Resume countdown
   */
  const resumeCountdown = useCallback(() => {
    pauseCountdown();
    startCountdown();
  }, [pauseCountdown, startCountdown]);

  /**
   * Stop and cleanup
   */
  const stopCountdown = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
  }, []);

  /**
   * Format remaining time (HH:MM:SS)
   */
  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, []);

  /**
   * Get time warning level
   */
  const getTimeWarningLevel = useCallback(
    (seconds: number): 'normal' | 'warning' | 'critical' => {
      if (seconds <= 60) return 'critical'; // 1 minute or less
      if (seconds <= 300) return 'warning'; // 5 minutes or less
      return 'normal';
    },
    []
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
    };
  }, []);

  return {
    remainingSeconds,
    setRemainingSeconds,
    startCountdown,
    pauseCountdown,
    resumeCountdown,
    stopCountdown,
    formatTime,
    getTimeWarningLevel,
    syncWithServer,
  };
};
