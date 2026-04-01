import { apiClient, API_ENDPOINTS } from '@/core/api';
import {
    QuizInstanceReqDTO,
    QuizInstanceResDTO,
    QuizSubmissionReqDTO,
    QuizResultDetailResDTO,
    QuizAnswerReqDTO,
    QuizInstanceStateResDTO
} from '@/domains';

export const quizInstanceRepository = {
    start(data: QuizInstanceReqDTO): Promise<QuizInstanceResDTO> {
        return apiClient.post<QuizInstanceResDTO>(API_ENDPOINTS.QUIZ_INSTANCES.START, data);
    },

    getById(instanceId: number, userId?: number): Promise<QuizInstanceResDTO> {
        return apiClient.get<QuizInstanceResDTO>(API_ENDPOINTS.QUIZ_INSTANCES.BY_ID(instanceId), { userId });
    },

    delete(instanceId: number, userId: number): Promise<void> {
        return apiClient.delete<void>(API_ENDPOINTS.QUIZ_INSTANCES.BY_ID(instanceId));
    },

    submit(instanceId: number, data?: QuizSubmissionReqDTO): Promise<QuizResultDetailResDTO> {
        return apiClient.post<QuizResultDetailResDTO>(API_ENDPOINTS.QUIZ_INSTANCES.SUBMIT(instanceId), data);
    },

    getResult(instanceId: number, userId?: number): Promise<QuizResultDetailResDTO> {
        return apiClient.get<QuizResultDetailResDTO>(API_ENDPOINTS.QUIZ_INSTANCES.RESULT(instanceId), { userId });
    },

    checkEligibility(quizId: number, userId: number): Promise<boolean> {
        return apiClient.get<boolean>(API_ENDPOINTS.QUIZ_INSTANCES.CHECK_ELIGIBILITY, { quizId, userId });
    },

    /** Save a single answer to Redis */
    saveAnswer(instanceId: number, data: QuizAnswerReqDTO): Promise<void> {
        return apiClient.post<void>(API_ENDPOINTS.QUIZ_INSTANCES.SAVE_ANSWER(instanceId), data);
    },

    /** Get current quiz state (for resume functionality) */
    getState(instanceId: number): Promise<QuizInstanceStateResDTO> {
        return apiClient.get<QuizInstanceStateResDTO>(API_ENDPOINTS.QUIZ_INSTANCES.GET_STATE(instanceId));
    },
};
