// Exam attempt types – aligned with BE api.json DTOs

import { QuizResDTO } from './quiz.types';
import { AnswerResDTO } from './question.types';
import { AnswerType, ContentType } from '@/core/types';

// === Response DTOs (from BE) ===

// Matches BE AttemptResDTO
export interface AttemptResDTO {
  id: number;
  quizId: number;
  quizInstanceId?: number;
  userId: number;
  quiz?: QuizResDTO;
  title?: string;
  date?: string;
  score: number | string;
  totalQuestions: number;
  correctAnswers: number;
  points?: number;
  duration: number | string;
  completedAt: string;
  badges?: string[];
  badgeColors?: string[];
}

// Matches BE AttemptDetailResDTO
export interface AttemptDetailResDTO {
  attemptInfo: AttemptResDTO;
  answers: UserAnswerResDTO[];
}

// Matches BE UserAnswerResDTO
export interface UserAnswerResDTO {
  id: number;
  questionId: number;
  questionName: string;
  type: ContentType;
  answerType: AnswerType;
  options: AnswerResDTO[];
  selectedOptionIds: number[];
  answerText?: string;
  isCorrect: boolean;
  pointsEarned: number;
}

// Matches BE UserStatisticsResDTO
export interface UserStatisticsResDTO {
  userId: number;
  totalQuizzesTaken: number;
  totalPoints: number;
  averageScore: number;
  totalTimeSpent: number;
  quizzesBySubject: Record<string, number>;
  quizzesByDifficulty: Record<string, number>;
  recentActivity: AttemptResDTO[];
}

// === Request DTOs (to BE) ===

// Matches BE CreateAttemptReqDTO
export interface CreateAttemptReqDTO {
  quizId: number;
  answers: AnswerSubmissionDTO[];
  startedAt?: string;
  completedAt?: string;
}

// Matches BE AnswerSubmissionDTO
export interface AnswerSubmissionDTO {
  questionId: number;
  selectedOptionIds: number[];
  answerText?: string;
}

// === Aliases for backward compatibility ===
export type ExamAttempt = AttemptResDTO;
export type ExamAttemptDetail = AttemptDetailResDTO;
export type UserAnswer = UserAnswerResDTO;
export type UserStatistics = UserStatisticsResDTO;
export type CreateExamAttemptRequest = CreateAttemptReqDTO;
export type SubmitAnswerRequest = AnswerSubmissionDTO;
