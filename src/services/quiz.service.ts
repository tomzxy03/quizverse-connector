import { quizRepository } from '@/repositories';
import { QuizResDTO, QuizReqDTO, QuizFilter, QuizDetailResDTO } from '@/domains';
import { QuizInstanceResDTO } from '@/domains';
import { PageResponse } from '@/core/types';

export class QuizService {
  async getAllQuizzes(page: number, size: number): Promise<PageResponse<QuizResDTO>> {
    return await quizRepository.getAll(page, size);
  }

  async getAllQuizzesByFilter(filter: QuizFilter): Promise<PageResponse<QuizResDTO>> {
    return await quizRepository.getAllQuizzesByFilter(filter);
  }

  /** Returns quiz detail with attemptState and instanceId */
  async getQuizById(id: number): Promise<QuizDetailResDTO> {
    return await quizRepository.getById(id);
  }

  async getQuizBySubject(subject: string): Promise<QuizResDTO[]> {
    return await quizRepository.getQuizBySubject(subject);
  }

  /** Start or resume a quiz attempt */
  async startQuiz(quizId: number): Promise<QuizInstanceResDTO> {
    return await quizRepository.startQuiz(quizId);
  }

  /** Get current active (in-progress) instance */
  async getActiveInstance(quizId: number): Promise<QuizInstanceResDTO | null> {
    return await quizRepository.getActiveInstance(quizId);
  }

  async createQuiz(data: QuizReqDTO): Promise<void> {
    if (!data.title || data.title.trim().length === 0) {
      throw new Error('Quiz title is required');
    }
    if (!data.questionIds || data.questionIds.length === 0) {
      throw new Error('Quiz must have at least one question');
    }
    return await quizRepository.create(data);
  }

  async updateQuiz(id: number, data: QuizReqDTO): Promise<QuizResDTO> {
    return await quizRepository.update(id, data);
  }

  async deleteQuiz(id: number): Promise<void> {
    return await quizRepository.delete(id);
  }
}

export const quizService = new QuizService();

