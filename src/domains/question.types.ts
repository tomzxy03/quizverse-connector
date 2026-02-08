import { Difficulty, QuestionType } from '@/core/types';

export interface Question {
  id: string;
  content: string;
  type: QuestionType;
  difficulty: Difficulty;

  bankId: string;
  folderId?: string;

  explanation?: string;
  tags?: string[];

  createdAt?: Date;
  updatedAt?: Date;
}

export interface AnswerDefinition {
  id: string;
  questionId: string;
  content: string;
  isCorrect: boolean;
  orderIndex: number;
}

