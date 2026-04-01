import { apiClient, API_ENDPOINTS } from '@/core/api';
import type { PageResponse } from '@/core/types';
import { AttemptDetailResDTO, AttemptResDTO, QuizResultDetailResDTO, UserStatisticsResDTO } from '@/domains';

export const examRepository = {
  getAttemptResult(quizInstanceId: number): Promise<QuizResultDetailResDTO> {
    return apiClient.get<QuizResultDetailResDTO>(API_ENDPOINTS.ATTEMPTS.BY_ID(quizInstanceId));
  },

  getMyAttempts(page = 0, size = 10): Promise<PageResponse<AttemptResDTO>> {
    return apiClient.get<PageResponse<AttemptResDTO>>(API_ENDPOINTS.ATTEMPTS.ME(), { page, size });
  },

  getMyAttemptDetail(quizInstanceId: number): Promise<AttemptDetailResDTO> {
    return apiClient.get<AttemptDetailResDTO>(API_ENDPOINTS.ATTEMPTS.ME_DETAIL(quizInstanceId));
  },

  getQuizAttempts(
    groupId: number,
    quizId: number,
    page = 0,
    size = 10
  ): Promise<PageResponse<AttemptResDTO>> {
    return apiClient.get<PageResponse<AttemptResDTO>>(
      API_ENDPOINTS.ATTEMPTS.SUBMISSIONS(groupId, quizId),
      { page, size }
    );
  },

  getSubmissionDetail(
    groupId: number,
    quizId: number,
    quizInstanceId: number
  ): Promise<AttemptDetailResDTO> {
    return apiClient.get<AttemptDetailResDTO>(
      API_ENDPOINTS.ATTEMPTS.SUBMISSION_DETAIL(groupId, quizId, quizInstanceId)
    );
  },

  getUserStatistics(): Promise<UserStatisticsResDTO> {
    return apiClient.get<UserStatisticsResDTO>(API_ENDPOINTS.ATTEMPTS.STATISTICS());
  }
};
