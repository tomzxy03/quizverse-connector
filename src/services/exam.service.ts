import { examRepository } from '@/repositories';
import type { PageResponse } from '@/core/types';
import { AttemptDetailResDTO, AttemptResDTO, QuizResultDetailResDTO, UserStatisticsResDTO } from '@/domains';

export class ExamService {
  async getAttemptResult(quizInstanceId: number): Promise<QuizResultDetailResDTO> {
    return await examRepository.getAttemptResult(quizInstanceId);
  }

  async getMyAttempts(page = 0, size = 10): Promise<PageResponse<AttemptResDTO>> {
    return await examRepository.getMyAttempts(page, size);
  }

  async getMyAttemptDetail(quizInstanceId: number): Promise<AttemptDetailResDTO> {
    return await examRepository.getMyAttemptDetail(quizInstanceId);
  }

  async getQuizAttempts(
    groupId: number,
    quizId: number,
    page = 0,
    size = 10
  ): Promise<PageResponse<AttemptResDTO>> {
    return await examRepository.getQuizAttempts(groupId, quizId, page, size);
  }

  async getSubmissionDetail(
    groupId: number,
    quizId: number,
    quizInstanceId: number
  ): Promise<AttemptDetailResDTO> {
    return await examRepository.getSubmissionDetail(groupId, quizId, quizInstanceId);
  }

  async getUserStatistics(): Promise<UserStatisticsResDTO> {
    return await examRepository.getUserStatistics();
  }
}

export const examService = new ExamService();
