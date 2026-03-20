import { apiClient, API_ENDPOINTS } from '@/core/api';
import { QuestionBankReqDTO, QuestionBankResDTO } from '@/domains';

export const questionBankRepository = {
    /** Get current user's question bank (auto-creates if doesn't exist) */
    getMyQuestionBank(): Promise<QuestionBankResDTO> {
        return apiClient.get<QuestionBankResDTO>(API_ENDPOINTS.QUESTION_BANKS.MY_BANK);
    },

    /** Create a new question bank */
    createQuestionBank(req: QuestionBankReqDTO): Promise<QuestionBankResDTO> {
        return apiClient.post<QuestionBankResDTO>(API_ENDPOINTS.QUESTION_BANKS.BASE, req);
    },

    /** Update question bank */
    updateQuestionBank(req: QuestionBankReqDTO): Promise<QuestionBankResDTO> {
        return apiClient.put<QuestionBankResDTO>(API_ENDPOINTS.QUESTION_BANKS.BASE, req);
    },

    /** Soft delete question bank */
    deleteQuestionBank(): Promise<void> {
        return apiClient.delete<void>(API_ENDPOINTS.QUESTION_BANKS.BASE);
    },
};
