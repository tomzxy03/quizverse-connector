/**
 * Hook for handling auto-save of quiz answers
 * Implements debounce for text answers and immediate save for multiple-choice
 */

import { useCallback, useRef, useEffect } from 'react';
import { useQuizAttempt } from '@/contexts/QuizAttemptContext';

interface SaveAnswerPayload {
  questionId: string;
  answers: (number | string)[];
  clientSeq?: number;
}

interface UseAutoSaveOptions {
  debounceMs?: number;
  onSave?: (payload: SaveAnswerPayload) => Promise<void>;
  instanceId: number | null;
}

export const useAutoSave = ({
  debounceMs = 800,
  onSave,
  instanceId,
}: UseAutoSaveOptions) => {
  const {
    setAnswer,
    setSyncStatus,
    addToRetryQueue,
    isOnline,
    getAnswerForQuestion,
  } = useQuizAttempt();

  const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const clientSeqRef = useRef(0);

  const saveAnswer = useCallback(
    async (questionId: string, answers: (number | string)[], isImmediate = false) => {
      if (!instanceId || !onSave) return;

      // Update local state immediately
      setAnswer(questionId, answers);

      // Mark as saving
      setSyncStatus(questionId, 'saving');

      try {
        const payload: SaveAnswerPayload = {
          questionId,
          answers,
          clientSeq: clientSeqRef.current++,
        };

        // Call the save function (usually API call)
        await onSave(payload);

        // Mark as saved
        setSyncStatus(questionId, 'saved');

        // Clear from retry queue if successful
      } catch (error) {
        console.error('Failed to save answer:', error);
        setSyncStatus(questionId, 'error');

        // Add to retry queue if offline or error
        addToRetryQueue(questionId, answers);

        if (!isOnline) {
          console.warn('Offline: answer queued for retry');
        }
      }
    },
    [instanceId, onSave, setAnswer, setSyncStatus, addToRetryQueue, isOnline]
  );

  /**
   * Handle immediate save (for radio/checkbox)
   */
  const saveImmediately = useCallback(
    (questionId: string, answers: (number | string)[]) => {
      // Clear any pending debounce for this question
      const timer = debounceTimers.current.get(questionId);
      if (timer) {
        clearTimeout(timer);
        debounceTimers.current.delete(questionId);
      }

      // Save immediately
      saveAnswer(questionId, answers, true);
    },
    [saveAnswer]
  );

  /**
   * Handle debounced save (for text input)
   */
  const saveDebouncedAnswer = useCallback(
    (questionId: string, answers: (number | string)[]) => {
      // Clear existing timer for this question
      const existingTimer = debounceTimers.current.get(questionId);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // Set new debounce timer
      const timer = setTimeout(() => {
        saveAnswer(questionId, answers, false);
        debounceTimers.current.delete(questionId);
      }, debounceMs);

      debounceTimers.current.set(questionId, timer);
    },
    [saveAnswer, debounceMs]
  );

  /**
   * Retry failed saves
   */
  const retryFailedSaves = useCallback(
    async (failedAnswers: Array<{ questionId: string; answers: (number | string)[] }>) => {
      for (const { questionId, answers } of failedAnswers) {
        try {
          await saveAnswer(questionId, answers, true);
        } catch (error) {
          console.error(`Retry failed for question ${questionId}:`, error);
        }
      }
    },
    [saveAnswer]
  );

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      debounceTimers.current.forEach((timer) => clearTimeout(timer));
      debounceTimers.current.clear();
    };
  }, []);

  return {
    saveImmediately,
    saveDebouncedAnswer,
    retryFailedSaves,
    saveAnswer,
  };
};
