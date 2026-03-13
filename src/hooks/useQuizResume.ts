import { useState, useEffect, useCallback } from 'react';
import { quizInstanceService } from '@/services';
import type { QuizInstanceStateResDTO } from '@/domains';

interface UseQuizResumeOptions {
    instanceId: number;
}

interface UseQuizResumeReturn {
    /** Restored quiz state (answers, time, etc) */
    restoredState: QuizInstanceStateResDTO | null;
    /** Is loading state from server */
    isLoading: boolean;
    /** Error loading state */
    error: Error | null;
    /** Manually trigger state reload */
    reloadState: () => Promise<void>;
}

/**
 * Handles quiz resume functionality by loading saved state from server.
 * 
 * Features:
 * - Restores previously saved answers
 * - Recovers remaining time
 * - Detects quiz expiration (TIMED_OUT, SUBMITTED status)
 * - On mount: auto-loads current state if instance in progress
 */
export function useQuizResume({
    instanceId,
}: UseQuizResumeOptions): UseQuizResumeReturn {
    const [restoredState, setRestoredState] = useState<QuizInstanceStateResDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const reloadState = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const state = await quizInstanceService.getQuizState(instanceId);
            setRestoredState(state);
        } catch (err) {
            // If quiz not found or already submitted, that's OK (not an error)
            // Only set error for actual network/server errors
            if (err instanceof Error && err.message.includes('404')) {
                // Quiz not found or already submitted
                setRestoredState(null);
            } else {
                setError(err instanceof Error ? err : new Error('Failed to load quiz state'));
            }
        } finally {
            setIsLoading(false);
        }
    }, [instanceId]);

    // Load state on mount
    useEffect(() => {
        reloadState();
    }, [reloadState]);

    return {
        restoredState,
        isLoading,
        error,
        reloadState,
    };
}
