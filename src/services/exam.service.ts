import { examRepository } from '@/repositories';
import { AttemptResDTO, AttemptDetailResDTO, CreateAttemptReqDTO, UserStatisticsResDTO } from '@/domains';

export class ExamService {
  async getAllAttempts(userId?: number, quizId?: number): Promise<AttemptResDTO[]> {
    return await examRepository.getAll(userId, quizId);
  }

  async getAttemptById(id: number): Promise<AttemptDetailResDTO> {
    return await examRepository.getById(id);
  }

  async getAttemptsByUserId(userId: number): Promise<AttemptResDTO[]> {
    return await examRepository.getByUserId(userId);
  }

  async getAttemptsByQuizAndUser(quizId: number, userId: number): Promise<AttemptResDTO[]> {
    return await examRepository.getByQuizAndUser(quizId, userId);
  }

  async createAttempt(data: CreateAttemptReqDTO): Promise<AttemptDetailResDTO> {
    if (!data.quizId) {
      throw new Error('Quiz ID is required');
    }
    if (!data.answers || data.answers.length === 0) {
      throw new Error('No answers provided');
    }
    return await examRepository.create(data);
  }

  async deleteAttempt(id: number): Promise<void> {
    return await examRepository.delete(id);
  }

  async getUserStatistics(userId: number): Promise<UserStatisticsResDTO> {
    return await examRepository.getUserStatistics(userId);
  }
}

export const examService = new ExamService();
