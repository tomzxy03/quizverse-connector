import { useState, useEffect, useRef, useCallback } from 'react';

interface UseQuizTimerOptions {
    /** Remaining seconds from server response */
    serverRemainingSeconds: number;
    /** Called when timer reaches 0 */
    onExpire: () => void;
    /** Whether timer is active */
    enabled?: boolean;
}

interface UseQuizTimerReturn {
    /** Current remaining seconds */
    remainingSeconds: number;
    /** Formatted mm:ss string */
    formattedTime: string;
    /** Whether timer has expired */
    isExpired: boolean;
    /** Percentage of time remaining (0-100) — requires totalSeconds */
    progressPercent: number;
}

/**
 * Server-synced countdown timer.
 * 
 * Derives remaining time from the server's `remainingTimeSeconds` + local monotonic clock.
 * On resume, the server provides a fresh `remainingTimeSeconds`.
 */
export function useQuizTimer({
    serverRemainingSeconds,
    onExpire,
    enabled = true,
}: UseQuizTimerOptions): UseQuizTimerReturn {
    const loadedAtRef = useRef<number>(Date.now());
    const hasExpiredRef = useRef(false);
    const [remaining, setRemaining] = useState(serverRemainingSeconds);

    // Reset when server provides new remaining time (e.g. on resume)
    useEffect(() => {
        loadedAtRef.current = Date.now();
        hasExpiredRef.current = false;
        setRemaining(serverRemainingSeconds);
    }, [serverRemainingSeconds]);

    useEffect(() => {
        if (!enabled || serverRemainingSeconds <= 0) return;

        const interval = setInterval(() => {
            const elapsed = (Date.now() - loadedAtRef.current) / 1000;
            const newRemaining = Math.max(0, serverRemainingSeconds - elapsed);
            setRemaining(Math.ceil(newRemaining));

            if (newRemaining <= 0 && !hasExpiredRef.current) {
                hasExpiredRef.current = true;
                clearInterval(interval);
                onExpire();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [serverRemainingSeconds, enabled, onExpire]);

    const formatTime = useCallback((seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hrs > 0) {
            return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }, []);

    const progressPercent =
        serverRemainingSeconds > 0
            ? Math.round((remaining / serverRemainingSeconds) * 100)
            : 0;

    return {
        remainingSeconds: remaining,
        formattedTime: formatTime(remaining),
        isExpired: remaining <= 0,
        progressPercent,
    };
}
