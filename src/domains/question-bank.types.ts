import { PageResponse } from '@/core/types/pagination.types';

export interface QuestionBankReqDTO {
    bankName?: string;
    description?: string;
}

export interface QuestionBankResDTO {
    id: number;
    ownerId?: number;
    bankName?: string;
    description?: string;
    totalFolders?: number;
    totalQuestions?: number;
    createdAt?: string;
    updatedAt?: string;
}

export type PageResDTOQuestionBankResDTO = PageResponse<QuestionBankResDTO>;
