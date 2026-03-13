// Question & Answer types – aligned with BE api.json DTOs

import { QuestionType, AnswerType, QuestionLevel } from '@/core/types';

// === Response DTOs (from BE) ===

// Matches BE QuestionResDTO
export interface QuestionResDTO {
  id: number;
  questionName: string;
  questionType: QuestionType;
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
  answerType: AnswerType;
  orderIndex: number;
}

// === Request DTOs (to BE) ===

// Matches BE QuestionReqDTO
export interface QuestionReqDTO {
  questionName: string;
  questionType: QuestionType;
  level: QuestionLevel;
  answers: AnswerReqDTO[];
}

// Matches BE AnswerReqDTO
export interface AnswerReqDTO {
  answerName: string;
  answerType: AnswerType;
  answerCorrect?: boolean;
}

// === Aliases ===
export type Question = QuestionResDTO;
export type Answer = AnswerResDTO;
