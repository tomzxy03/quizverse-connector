// Quiz Instance types – aligned with BE api.json DTOs

// === Response DTOs (from BE) ===

// Matches BE QuizInstanceResDTO
export interface QuizInstanceResDTO {
    id: number;
    quizId: number;
    quizTitle: string;
    userId: number;
    userName: string;
    startedAt: string;
    timeLimitMinutes: number;
    shuffleEnabled: boolean;
    totalPoints: number;
    status: string;
    questions: QuizInstanceQuestionResDTO[];
    remainingTimeSeconds: number;
}

// Matches BE QuizInstanceQuestionResDTO
export interface QuizInstanceQuestionResDTO {
    id: number;
    displayOrder: number;
    points: number;
    questionText: string;
    questionType: string;
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
    userId: number;
    userName: string;
    status: string;
    scorePercentage: number;
    totalTimeSpentMinutes: number;
    totalPoints: number;
    earnedPoints: number;
    questionResults: QuestionResultResDTO[];
}

// Matches BE QuestionResultResDTO
export interface QuestionResultResDTO {
    questionInstanceId: number;
    displayOrder: number;
    questionText: string;
    questionType: string;
    points: number;
    earnedPoints: number;
    userAnswer?: string;
    correctAnswer?: string;
    status: string;
    allAnswers: AnswerResultResDTO[];
    correct: boolean;
    skipped: boolean;
}

// Matches BE AnswerResultResDTO
export interface AnswerResultResDTO {
    answerInstanceId: number;
    displayOrder: number;
    answerText: string;
    optionLabel: string;
    correct: boolean;
    userSelected: boolean;
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
    id: number;
    quizId: number;
    quizTitle: string;
    status: string; // IN_PROGRESS, SUBMITTED, TIMED_OUT
    questions: QuizInstanceQuestionResDTO[];
    userAnswers: Record<string, number[]>; // questionId -> answer indices
    remainingSeconds: number;
    totalTimeSeconds: number;
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
