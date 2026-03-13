import { apiClient, API_ENDPOINTS } from '@/core/api';
import { AttemptResDTO, AttemptDetailResDTO, CreateAttemptReqDTO, UserStatisticsResDTO } from '@/domains';

export const examRepository = {
  getAll(userId?: number, quizId?: number): Promise<AttemptResDTO[]> {
    return apiClient.get<AttemptResDTO[]>(API_ENDPOINTS.ATTEMPTS.BASE, { userId, quizId });
  },

  getById(id: number): Promise<AttemptDetailResDTO> {
    return apiClient.get<AttemptDetailResDTO>(API_ENDPOINTS.ATTEMPTS.BY_ID(id));
  },

  getByUserId(userId: number): Promise<AttemptResDTO[]> {
    return apiClient.get<AttemptResDTO[]>(API_ENDPOINTS.ATTEMPTS.BY_USER(userId));
  },

  getByQuizAndUser(quizId: number, userId: number): Promise<AttemptResDTO[]> {
    return apiClient.get<AttemptResDTO[]>(API_ENDPOINTS.ATTEMPTS.BY_QUIZ_AND_USER(quizId, userId));
  },

  getUserStatistics(userId: number): Promise<UserStatisticsResDTO> {
    return apiClient.get<UserStatisticsResDTO>(API_ENDPOINTS.ATTEMPTS.USER_STATISTICS(userId));
  },

  create(data: CreateAttemptReqDTO): Promise<AttemptDetailResDTO> {
    return apiClient.post<AttemptDetailResDTO>(API_ENDPOINTS.ATTEMPTS.BASE, data);
  },

  delete(id: number): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.ATTEMPTS.BY_ID(id));
  }
};
