// Quiz related types and interfaces

import { Difficulty, QuestionType } from './common';
import { User } from './user.types';

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  subject: string;
  questionCount: number;
  estimatedTime: number;
  difficulty: Difficulty;
  isPublic: boolean;
  attemptCount?: number;
  creatorId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  tags?: string[];
}

export interface QuizDetail extends Quiz {
  questions: Question[];
  settings: QuizSettings;
  creator?: User;
}

export interface QuizSettings {
  pointsPerQuestion?: number;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  showCorrectAnswers: boolean;
  maxAttempts?: number;
  passingScore?: number;
  timeLimit?: number;
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  type: QuestionType;
  points: number;
  orderIndex: number;
  explanation?: string;
  options: QuestionOption[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface QuestionOption {
  id: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
  orderIndex: number;
}

export interface CreateQuizRequest {
  title: string;
  description?: string;
  subject: string;
  estimatedTime: number;
  difficulty: Difficulty;
  isPublic: boolean;
  questions: CreateQuestionRequest[];
  settings: QuizSettings;
}

export interface UpdateQuizRequest extends Partial<CreateQuizRequest> {
  id: string;
}

export interface CreateQuestionRequest {
  text: string;
  type: QuestionType;
  points: number;
  explanation?: string;
  options: CreateQuestionOptionRequest[];
}

export interface CreateQuestionOptionRequest {
  text: string;
  isCorrect: boolean;
}

export interface QuizFilter {
  subject?: string;
  difficulty?: Difficulty;
  minQuestions?: number;
  maxQuestions?: number;
  minDuration?: number;
  maxDuration?: number;
  isPublic?: boolean;
  search?: string;
  tags?: string[];
}

export interface QuizStatistics {
  quizId: string;
  totalAttempts: number;
  averageScore: number;
  averageTime: number;
  completionRate: number;
  difficultyRating: number;
}
