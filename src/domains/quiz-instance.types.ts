// Quiz Instance types – aligned with BE api.json DTOs

import type { QuestionLayout } from './quiz.types';

// === Response DTOs (from BE) ===

// Matches BE QuizInstanceResDTO
export interface QuizInstanceResDTO {
    id: number;
    quizId: number;
    quizTitle: string;
    userId?: number;
    userName?: string;
    startedAt: string;
    timeLimitMinutes: number;
    shuffleEnabled?: boolean;
    totalPoints?: number;
    status?: string;
    questions: QuizInstanceQuestionResDTO[];
    remainingTimeSeconds?: number;
    remainingSeconds?: number;
    totalTimeSeconds?: number;
    questionLayout?: QuestionLayout;
}

// Matches BE QuizInstanceQuestionResDTO
export interface QuizInstanceQuestionResDTO {
    id?: number | null;
    snapshotKey: string;
    displayOrder: number;
    points: number;
    questionText: string;
    type: string;
    answerType: string;
    answers: QuizInstanceAnswerResDTO[];
}

// Matches BE QuizInstanceAnswerResDTO
export interface QuizInstanceAnswerResDTO {
    id: number;
    displayOrder: number;
    answerText: string;
    optionLabel: string;
}

// Matches BE QuizResultDetailResDTO
export interface QuizResultDetailResDTO {
    quizInstanceId: number;
    quizId: number;
    quizTitle: string;
    userId?: number;
    userName?: string;
    status: string;
    scorePercentage: number;
    totalTimeSpentMinutes?: number;
    totalPoints: number;
    earnedPoints: number;
    questionResults: QuestionResultResDTO[];
}

// Matches BE QuestionResultResDTO
export interface QuestionResultResDTO {
    questionInstanceId: number | null;
    displayOrder: number;
    questionText: string;
    type?: string;
    answerType?: string;
    points: number;
    earnedPoints: number;
    userAnswer?: string;
    correctAnswer?: string;
    isCorrect: boolean;
    status: string;
    allAnswers: AnswerResultResDTO[];
    skipped?: boolean;
    isSkipped?: boolean;
}

// Matches BE AnswerResultResDTO
export interface AnswerResultResDTO {
    answerInstanceId: number;
    displayOrder: number;
    answerText: string;
    optionLabel: string;
    isCorrect: boolean;
    isUserSelected: boolean;
}

// Matches BE QuizUserResponseResDTO
export interface QuizUserResponseResDTO {
    id: number;
    quizInstanceId: number;
    selectedAnswerId?: number;
    selectedAnswerText?: string;
    isCorrect: boolean;
    pointsEarned: number;
    responseTimeSeconds: number;
    answeredAt?: string;
    isSkipped: boolean;
    status: string;
    questionSnapshots: QuestionSnapshotResDTO[];
    isAnswered: boolean;
    isNotAnswered: boolean;
    isAnsweredCorrectly: boolean;
    isAnsweredIncorrectly: boolean;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
}

// Matches BE QuestionSnapshotResDTO
export interface QuestionSnapshotResDTO {
    id: number;
    questionText: string;
    questionType: string;
    questionPoints: number;
    answerSnapshots: AnswersSnapshotResDTO[];
    createdAt: string;
    updatedAt: string;
}

// Matches BE AnswersSnapshotResDTO
export interface AnswersSnapshotResDTO {
    id: number;
    correctAnswerText: string;
    allAnswerOptions: string;
    questionSnapshotId: number;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
}

// === Request DTOs (to BE) ===

// Matches BE QuizInstanceReqDTO
export interface QuizInstanceReqDTO {
    quizId: number;
}

// ===== NEW: Index-based answer submission =====
// Single choice: answer: [0]
// Multiple choice: answer: [0, 2, 3]
// (Type definition is in quiz.types.ts to avoid duplication)
export type { QuizAnswerReqDTO } from './quiz.types';

// Response when resuming/reloading quiz
export interface QuizInstanceStateResDTO {
    instanceId: number;
    status: string; // IN_PROGRESS, SUBMITTED, TIMED_OUT
    remainingSeconds: number;
    questions: QuizInstanceStateQuestionResDTO[];
}

export interface QuizInstanceStateQuestionResDTO {
    questionId: string; // snapshot key
    content: string;
    type: string;
    answerType: string;
    orderIndex: number;
    points: number;
    answers: QuizInstanceStateAnswerResDTO[];
    userAnswer?: number[];
}

export interface QuizInstanceStateAnswerResDTO {
    index: number;
    content: string;
}

// Response after submitting quiz
export interface QuizSubmitResponseDTO {
    score?: number;
    totalQuestions?: number;
    status?: string; // submitted or TIMED_OUT
    quizInstanceId?: number;
}

// Matches BE QuizSubmissionReqDTO (deprecated, kept for backward compatibility)
export interface QuizSubmissionReqDTO {
    quizInstanceId?: number;
    userId?: number;
    answers?: Record<string, string>;
    answerIds?: Record<string, number>;
    totalTimeSpentSeconds?: number;
    submittedAt?: string;
}

// Matches BE QuizUserResponseReqDTO
export interface QuizUserResponseReqDTO {
    quizInstanceId: number;
    selectedAnswerId?: number;
    selectedAnswerText?: string;
    isCorrect?: boolean;
    pointsEarned?: number;
    responseTimeSeconds?: number;
    answeredAt?: string;
    isSkipped?: boolean;
    questionSnapshotId?: number;
}
