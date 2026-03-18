/**
 * Quiz Attempt Store using React Context
 * Manages quiz taking state, answer synchronization, and local persistence
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { QuizAnswerReqDTO } from '@/domains';
import { quizInstanceRepository } from '@/repositories';

export type SyncStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface AnswerState {
  [questionId: number]: number[]; // questionId -> array of option indices
}

export interface SyncStatusState {
  [questionId: number]: SyncStatus;
}

export interface QuizAttemptContextType {
  instanceId: number | null;
  answers: AnswerState;
  syncStatus: SyncStatusState;
  remainingSeconds: number;
  isOnline: boolean;
  activeQuestionIndex: number;

  // Actions
  initialize: (instanceId: number, initialAnswers?: AnswerState, remaining?: number) => void;
  setAnswer: (questionId: number, answerIndices: number[]) => void;
  setRemainingSeconds: (seconds: number) => void;
  setActiveQuestionIndex: (index: number) => void;
  flushPending: () => Promise<void>;
  resetStore: () => void;
}

const QuizAttemptContext = createContext<QuizAttemptContextType | undefined>(undefined);

const DEBOUNCE_MS = 500;
const MAX_RETRIES = 3;
const RETRY_BASE_MS = 1000;

function getCacheKey(instanceId: number): string {
  return `quiz_answers_v2_${instanceId}`;
}

export const QuizAttemptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [instanceId, setInstanceId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [syncStatus, setSyncStatus] = useState<SyncStatusState>({});
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const pendingRef = useRef<Map<number, QuizAnswerReqDTO>>(new Map());
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveToServer = useCallback(
    async (qId: number, data: QuizAnswerReqDTO, retryCount = 0) => {
      if (!instanceId) return;

      setSyncStatus((prev) => ({ ...prev, [qId]: 'saving' }));

      try {
        await quizInstanceRepository.saveAnswer(instanceId, data);
        setSyncStatus((prev) => ({ ...prev, [qId]: 'saved' }));
        pendingRef.current.delete(qId);
      } catch (err) {
        if (retryCount < MAX_RETRIES) {
          const delay = RETRY_BASE_MS * Math.pow(2, retryCount);
          setTimeout(() => saveToServer(qId, data, retryCount + 1), delay);
        } else {
          setSyncStatus((prev) => ({ ...prev, [qId]: 'error' }));
        }
      }
    },
    [instanceId]
  );

  const initialize = useCallback((id: number, initialAnswers?: AnswerState, remaining?: number) => {
    setInstanceId(id);
    setActiveQuestionIndex(0);

    // Load from cache first
    try {
      const cached = localStorage.getItem(getCacheKey(id));
      if (cached) {
        const parsed = JSON.parse(cached);
        setAnswers(parsed);
      } else if (initialAnswers) {
        setAnswers(initialAnswers);
      } else {
        setAnswers({});
      }
    } catch {
      setAnswers(initialAnswers || {});
    }

    if (remaining !== undefined) {
      setRemainingSeconds(remaining);
    }
  }, []);

  const setAnswer = useCallback((questionId: number, answerIndices: number[]) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: answerIndices };
      if (instanceId) {
        localStorage.setItem(getCacheKey(instanceId), JSON.stringify(next));
      }
      return next;
    });

    const apiPayload: QuizAnswerReqDTO = {
      questionId,
      answer: answerIndices,
    };
    pendingRef.current.set(questionId, apiPayload);

    const existingTimer = timersRef.current.get(questionId);
    if (existingTimer) clearTimeout(existingTimer);

    const timer = setTimeout(() => {
      saveToServer(questionId, apiPayload);
      timersRef.current.delete(questionId);
    }, DEBOUNCE_MS);
    timersRef.current.set(questionId, timer);
  }, [instanceId, saveToServer]);

  const flushPending = useCallback(async () => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();

    const pending = Array.from(pendingRef.current.entries());
    if (pending.length === 0) return;

    await Promise.allSettled(
      pending.map(([qId, data]) => saveToServer(qId, data))
    );
  }, [saveToServer]);

  const resetStore = useCallback(() => {
    if (instanceId) {
      localStorage.removeItem(getCacheKey(instanceId));
    }
    setInstanceId(null);
    setAnswers({});
    setSyncStatus({});
    setRemainingSeconds(0);
    setActiveQuestionIndex(0);
    pendingRef.current.clear();
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
  }, [instanceId]);

  const value: QuizAttemptContextType = {
    instanceId,
    answers,
    syncStatus,
    remainingSeconds,
    isOnline,
    activeQuestionIndex,
    initialize,
    setAnswer,
    setRemainingSeconds,
    setActiveQuestionIndex,
    flushPending,
    resetStore,
  };

  return (
    <QuizAttemptContext.Provider value={value}>
      {children}
    </QuizAttemptContext.Provider>
  );
};

export const useQuizAttempt = () => {
  const context = useContext(QuizAttemptContext);
  if (context === undefined) {
    throw new Error('useQuizAttempt must be used within QuizAttemptProvider');
  }
  return context;
};
