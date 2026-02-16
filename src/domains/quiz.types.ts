// Quiz related types and interfaces

import { Difficulty, QuestionType } from '@/core/types';
import { User } from './user.types';
import { Question } from './question.types';


export interface Quiz {
  id: string;
  title: string;
  description?: string;
  subject: string;
  questionCount: number;
  estimatedTime: number;
  difficulty: Difficulty;
  isPublic: boolean;
  visibility?: 'PUBLIC' | 'GROUP' | 'DRAFT';
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

export interface QuizQuestionSnapshot {
  id: string;               // snapshot id
  questionId: string;       // reference
  content: string;
  type: QuestionType;
  points: number;
  orderIndex: number;

  options: QuizOptionSnapshot[];
}
export interface QuizOptionSnapshot {
  id: string;
  content: string;
  orderIndex: number;

  //chỉ BE dùng, FE submit không thấy
  isCorrect?: boolean;
}
export interface QuizAnswerSnapshot {
  id: string;
  content: string;
  orderIndex: number;

  // FE Player KHÔNG được thấy
  isCorrect?: boolean;
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
export type { Question };

