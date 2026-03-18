import { apiClient, API_ENDPOINTS } from '@/core/api';
import { QuestionReqDTO, QuestionResDTO } from '@/domains';

export const questionRepository = {
    /** Fetch all questions belonging to a quiz */
    getByQuiz(quizId: number): Promise<QuestionResDTO[]> {
        return apiClient.get<QuestionResDTO[]>(API_ENDPOINTS.QUESTIONS.BY_QUIZ(quizId));
    },

    /** Add a list of questions to a quiz */
    addList(quizId: number, questions: QuestionReqDTO[]): Promise<QuestionResDTO[]> {
        return apiClient.post<QuestionResDTO[]>(API_ENDPOINTS.QUESTIONS.ADD_LIST(quizId), questions);
    },
};
