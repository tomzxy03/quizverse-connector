import { useState, useRef, useCallback, useEffect } from 'react';
import { quizInstanceRepository } from '@/repositories';
import type { QuizAnswerReqDTO } from '@/domains';

const DEBOUNCE_MS = 500;
const MAX_RETRIES = 3;
const RETRY_BASE_MS = 1000;

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// New format: answer indices (0-indexed)
interface AnswerEntry {
    answer: number[]; // Array of selected option indices
    savedAt: number;
}

interface UseAnswerManagerOptions {
    instanceId: number;
    onSaveError?: (questionSnapshotKey: string, error: unknown) => void;
}

interface UseAnswerManagerReturn {
    /** Current answers map: snapshotKey → answer indices */
    answers: Map<string, number[]>;
    /** Save status per question */
    saveStatuses: Map<string, SaveStatus>;
    /** Select answer indices for a question (single: [0], multiple: [0,2,3]) */
    selectAnswer: (questionSnapshotKey: string, answerIndices: number[]) => void;
    /** Skip a question (clear its answer) */
    skipQuestion: (questionSnapshotKey: string) => void;
    /** Flush all pending saves immediately (used before submit) */
    flushPending: () => Promise<void>;
    /** Whether there are unsaved changes */
    hasPendingChanges: boolean;
    /** Load answers from localStorage cache */
    loadCachedAnswers: () => Map<string, number[]>;
    /** Clear all cached answers (on submit) */
    clearCache: () => void;
}

function getCacheKey(instanceId: number): string {
    return `quiz_answers_${instanceId}`;
}

function readCache(instanceId: number): Map<string, number[]> {
    try {
        const raw = localStorage.getItem(getCacheKey(instanceId));
        if (!raw) return new Map();
        const parsed = JSON.parse(raw);
        return new Map(Object.entries(parsed).map(([k, v]) => [String(k), v as number[]]));
    } catch {
        return new Map();
    }
}

function writeCache(instanceId: number, answers: Map<string, number[]>) {
    try {
        const obj = Object.fromEntries(answers);
        localStorage.setItem(getCacheKey(instanceId), JSON.stringify(obj));
    } catch {
        // localStorage full or unavailable — silently ignore
    }
}

/**
 * Manages answer state with index-based format and debounced autosave to server + localStorage fallback.
 * 
 * NEW FORMAT (from update_require.md):
 * - Single choice: answer: [0]
 * - Multiple choice: answer: [0, 2, 3]
 * - Indices are 0-based from server's option ordering
 * 
 * On answer selection:
 * 1. Update local state immediately
 * 2. Write to localStorage immediately  
 * 3. Debounce API call by 500ms
 * 4. On API failure, retry up to 3x with exponential backoff
 */
export function useAnswerManager({
    instanceId,
    onSaveError,
}: UseAnswerManagerOptions): UseAnswerManagerReturn {
    const [answers, setAnswers] = useState<Map<string, number[]>>(() => readCache(instanceId));
    const [saveStatuses, setSaveStatuses] = useState<Map<string, SaveStatus>>(new Map());
    const pendingRef = useRef<Map<string, QuizAnswerReqDTO>>(new Map());
    const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    // Reload cache when instanceId changes
    useEffect(() => {
        const cached = readCache(instanceId);
        if (cached.size > 0) {
            setAnswers(cached);
        }
    }, [instanceId]);

    const saveToServer = useCallback(
        async (questionSnapshotKey: string, data: QuizAnswerReqDTO, retryCount = 0) => {
            setSaveStatuses((prev) => new Map(prev).set(questionSnapshotKey, 'saving'));

            try {
                await quizInstanceRepository.saveAnswer(instanceId, data);
                setSaveStatuses((prev) => new Map(prev).set(questionSnapshotKey, 'saved'));
                pendingRef.current.delete(questionSnapshotKey);
            } catch (err) {
                if (retryCount < MAX_RETRIES) {
                    const delay = RETRY_BASE_MS * Math.pow(2, retryCount);
                    setTimeout(() => saveToServer(questionSnapshotKey, data, retryCount + 1), delay);
                } else {
                    setSaveStatuses((prev) => new Map(prev).set(questionSnapshotKey, 'error'));
                    onSaveError?.(questionSnapshotKey, err);
                }
            }
        },
        [instanceId, onSaveError]
    );

    const selectAnswer = useCallback(
        (questionSnapshotKey: string, answerIndices: number[]) => {
            // 1. Update local state immediately
            setAnswers((prev) => {
                const next = new Map(prev);
                next.set(questionSnapshotKey, answerIndices);
                // 2. Write to localStorage immediately
                writeCache(instanceId, next);
                return next;
            });

            // 3. Debounce the API call with new format
            const apiPayload: QuizAnswerReqDTO = {
                questionSnapshotKey,
                answer: answerIndices, // New index-based format
            };
            pendingRef.current.set(questionSnapshotKey, apiPayload);

            // Clear existing timer for this question
            const existingTimer = timersRef.current.get(questionSnapshotKey);
            if (existingTimer) clearTimeout(existingTimer);

            const timer = setTimeout(() => {
                saveToServer(questionSnapshotKey, apiPayload);
                timersRef.current.delete(questionSnapshotKey);
            }, DEBOUNCE_MS);
            timersRef.current.set(questionSnapshotKey, timer);
        },
        [instanceId, saveToServer]
    );

    const skipQuestion = useCallback(
        (questionSnapshotKey: string) => {
            // Clear answer for skipped question
            setAnswers((prev) => {
                const next = new Map(prev);
                next.delete(questionSnapshotKey);
                writeCache(instanceId, next);
                return next;
            });

            // Clear pending save
            pendingRef.current.delete(questionSnapshotKey);
            const existingTimer = timersRef.current.get(questionSnapshotKey);
            if (existingTimer) clearTimeout(existingTimer);
            timersRef.current.delete(questionSnapshotKey);

            // Update UI status
            setSaveStatuses((prev) => {
                const next = new Map(prev);
                next.delete(questionSnapshotKey);
                return next;
            });
        },
        [instanceId]
    );

    const flushPending = useCallback(async () => {
        // Clear all debounce timers
        timersRef.current.forEach((timer) => clearTimeout(timer));
        timersRef.current.clear();

        // Save all pending answers immediately
        const pending = Array.from(pendingRef.current.entries());
        if (pending.length === 0) return;

        await Promise.allSettled(
            pending.map(([questionSnapshotKey, data]) => saveToServer(questionSnapshotKey, data))
        );
    }, [saveToServer]);

    const loadCachedAnswers = useCallback(() => {
        return readCache(instanceId);
    }, [instanceId]);

    const clearCache = useCallback(() => {
        try {
            localStorage.removeItem(getCacheKey(instanceId));
        } catch {
            // ignore
        }
        pendingRef.current.clear();
        timersRef.current.forEach((timer) => clearTimeout(timer));
        timersRef.current.clear();
    }, [instanceId]);

    const hasPendingChanges = pendingRef.current.size > 0;

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            timersRef.current.forEach((timer) => clearTimeout(timer));
        };
    }, []);

    return {
        answers,
        saveStatuses,
        selectAnswer,
        skipQuestion,
        flushPending,
        hasPendingChanges,
        loadCachedAnswers,
        clearCache,
    };
}
