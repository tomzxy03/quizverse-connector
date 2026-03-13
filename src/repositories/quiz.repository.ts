import { apiClient, API_ENDPOINTS } from '@/core/api';
import { QuizResDTO, QuizReqDTO, QuizFilter, QuizDetailResDTO } from '@/domains';
import { QuizInstanceResDTO } from '@/domains';
import { PageResponse } from '@/core/types';

export const quizRepository = {
  getAll(page: number, size: number): Promise<PageResponse<QuizResDTO>> {
    return apiClient.get<PageResponse<QuizResDTO>>(API_ENDPOINTS.QUIZZES.BASE, { page, size });
  },

  /** Returns quiz detail with attemptState and instanceId */
  getById(id: number): Promise<QuizDetailResDTO> {
    return apiClient.get<QuizDetailResDTO>(API_ENDPOINTS.QUIZZES.BY_ID(id));
  },

  getQuizBySubject(subject: string): Promise<QuizResDTO[]> {
    return apiClient.get<QuizResDTO[]>(API_ENDPOINTS.QUIZZES.BASE, { subject });
  },

  getAllQuizzesByFilter(filter: QuizFilter): Promise<PageResponse<QuizResDTO>> {
    return apiClient.get<PageResponse<QuizResDTO>>(API_ENDPOINTS.QUIZZES.GET_BY_FILTER(filter));
  },

  /** Start or resume a quiz attempt */
  startQuiz(quizId: number): Promise<QuizInstanceResDTO> {
    return apiClient.post<QuizInstanceResDTO>(API_ENDPOINTS.QUIZZES.START(quizId));
  },

  /** Get current active (in-progress) instance for a quiz */
  getActiveInstance(quizId: number): Promise<QuizInstanceResDTO | null> {
    return apiClient.get<QuizInstanceResDTO | null>(API_ENDPOINTS.QUIZZES.ACTIVE_INSTANCE(quizId));
  },

  create(data: QuizReqDTO): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.QUIZZES.BASE, data);
  },

  update(id: number, data: QuizReqDTO): Promise<QuizResDTO> {
    return apiClient.put<QuizResDTO>(API_ENDPOINTS.QUIZZES.BY_ID(id), data);
  },

  delete(id: number): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.QUIZZES.BY_ID(id));
  }
};
