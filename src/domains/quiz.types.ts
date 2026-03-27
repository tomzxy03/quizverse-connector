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
  maxAttempt?: number;
  quizVisibility: QuizVisibility;
  status: QuizStatus;
  hostName: string;
  lobbyName?: string;
  subjectName?: string;
}


export interface QuizConfig {
  shuffleQuestions?: boolean;
  shuffleAnswers?: boolean;
  autoDistributePoints?: boolean;
  showScoreImmediately?: boolean;
  allowReview?: boolean;
  passingScore?: number;
}

export interface QuestionLayout {
  questionNumbering?: string;
  questionPerPage?: number;
  answerPerRow?: number;
}

// Matches BE QuizDetailResDTO – returned by GET /api/quizzes/{quizId}
export interface QuizDetailResDTO {
  quiz: QuizResDTO;
  quizConfig?: QuizConfig;
  questionLayout?: QuestionLayout;
  attemptState: AttemptState;
  instanceId?: number;
  totalAttempt: number;
}

// Possible attempt states from backend
export type AttemptState = 'NONE' | 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'EXPIRED';

// === Request DTOs (to BE) ===

// Matches BE QuizReqDTO
export interface QuizReqDTO {
  title: string;
  description?: string;
  visibility?: QuizVisibility;
  timeLimitMinutes?: number;
  maxAttempt?: number;
  startDate?: string;
  subjectId: number;
  public?: boolean;
  quizConfig?: QuizConfig;
  questionLayout?: QuestionLayout;
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
  visibility: QuizVisibility;
  questions: Array<{
    id: string;
    text: string;
    type: "text";
    points: number;
    options: Array<{
      id: string;
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
    autoDistributePoints: boolean;
    allowReview: boolean;
    passingScore: number;
    questionNumbering: string;
    questionPerPage: number;
    answerPerRow: number;
  };
}

// === Aliases ===
export type Quiz = QuizResDTO;
