// Question & Answer types – aligned with BE DTOs

import { ContentType, AnswerType, QuestionLevel } from '@/core/types';

// === Response DTOs (from BE) ===

// Matches BE QuestionResDTO
export interface QuestionResDTO {
  id: number;
  questionName: string;
  questionType: ContentType;
  answerType?: AnswerType;
  level: QuestionLevel;
  bankId: number;
  folderId?: number;
  folderName?: string;
  answers: AnswerResDTO[];
}

// Matches BE AnswerResDTO
export interface AnswerResDTO {
  id: number;
  answerText: string;
  answerType: ContentType;
  orderIndex: number;
  isCorrect?: boolean;
  answerCorrect?: boolean;
}

// === Request DTOs (to BE) ===

export interface QuizQuestionReqDTO {
  questionId?: number;
  questionReqDTO: QuestionReqDTO;
  points?: number;
}

// Matches BE QuestionReqDTO
export interface QuestionReqDTO {
  questionName: string;
  questionType: ContentType;
  answerType?: AnswerType;
  answers: AnswerReqDTO[];
}

// Matches BE AnswerReqDTO
export interface AnswerReqDTO {
  answerName: string;
  answerType: ContentType;
  answerCorrect: boolean;
}

export interface QBankAnswerReqDTO {
  text: string;
  isCorrect: boolean;
}

export interface QBankAnswerResDTO {
  id: number;
  text: string;
  isCorrect: boolean;
}

// Backend expects SINGLE question wrapped in folder context
export interface QuestionFolderReqDTO {
  folderId?: number | null;
  questions: QuestionReqDTO;
}

export interface QuestionFolderResDTO {
  id: number;
  questionName: string;
  type: string;
  level?: string;
  bankId: number;
  folderId?: number;
  folderName?: string;
  createdAt?: string;
  updatedAt?: string;
  answers: QBankAnswerResDTO[];
}

// === Aliases ===
export type Question = QuestionResDTO;
export type Answer = AnswerResDTO;
