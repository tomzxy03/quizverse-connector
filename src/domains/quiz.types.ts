// Quiz related types – aligned with BE api.json DTOs

import { QuizVisibility, QuizStatus } from '@/core/types';

// === Response DTOs (from BE) ===

// Matches BE QuizResDTO
export interface QuizResDTO {
  id: number;
  title: string;
  description?: string;
  totalQuestion: number;
  timeLimitMinutes?: number;
  maxAttempts?: number;
  quizVisibility: QuizVisibility;
  status: QuizStatus;
  hostName: string;
  lobbyName?: string;
}

// Matches BE QuizConfig – Quiz configuration settings
export interface QuizConfig {
  shuffleQuestions?: boolean;
  shuffleAnswers?: boolean;
  showScoreImmediately?: boolean;
  allowReview?: boolean;
  maxAttempts?: number;
  passingScore?: number;
}

// Matches BE QuizDetailResDTO – returned by GET /api/quizzes/{quizId}
export interface QuizDetailResDTO {
  quiz: QuizResDTO;
  quizConfig?: QuizConfig;
  attemptState: AttemptState;
  instanceId?: number;
  totalAttempt: number;
}

// Possible attempt states from backend
export type AttemptState = 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'EXPIRED';

// === Request DTOs (to BE) ===

// Matches BE QuizReqDTO
export interface QuizReqDTO {
  title: string;
  description?: string;
  visibility?: QuizVisibility;
  timeLimitMinutes?: number;
  maxAttempts?: number;
  startDate?: string;
  subjectId: number;
  questionIds: number[];
  public?: boolean;
}

export interface QuizFilter {
  subjectId?: number;
  search?: string;
  minQuestions?: number;
  maxQuestions?: number;
  minDuration?: number;
  maxDuration?: number;
  page?: number;
  size?: number;

}

// === Request DTOs (to BE) ===

// Matches BE QuizAnswerReqDTO – for POST /api/quiz-instances/{instanceId}/answer
// Updated to index-based answer format:
// Single choice: answer: [0]
// Multiple choice: answer: [0, 2, 3]
export interface QuizAnswerReqDTO {
  questionId: number;
  answer: number[]; // Array of option indices (0-indexed)
}

// Create/Update Quiz Request DTO
export interface CreateQuizRequest {
  title: string;
  description?: string;
  subject: string;
  estimatedTime: number;
  isPublic: boolean;
  questions: Array<{
    text: string;
    type: "multiple_choice";
    points: number;
    options: Array<{
      text: string;
      isCorrect: boolean;
    }>;
  }>;
  settings: {
    randomizeQuestions: boolean;
    randomizeOptions: boolean;
    showCorrectAnswers: boolean;
    maxAttempts: number;
    timeLimit: number;
  };
}

// === Aliases ===
export type Quiz = QuizResDTO;
