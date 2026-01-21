// Quiz Service - Business logic layer

import { quizRepository } from '@/repositories';
import { Quiz, QuizDetail, QuizFilter, CreateQuizRequest, UpdateQuizRequest } from '@/domains';

export class QuizService {
  async getAllQuizzes(filter?: QuizFilter): Promise<Quiz[]> {
    return await quizRepository.getAll(filter);
  }

  async getQuizById(id: string): Promise<QuizDetail | null> {
    return await quizRepository.getById(id);
  }

  async getQuizzesBySubject(subject: string): Promise<Quiz[]> {
    if (subject === 'All') {
      return await quizRepository.getAll();
    }
    return await quizRepository.getBySubject(subject);
  }

  async getPopularQuizzes(limit: number = 10): Promise<Quiz[]> {
    return await quizRepository.getPopular(limit);
  }

  async getLatestQuizzes(limit: number = 10): Promise<Quiz[]> {
    return await quizRepository.getLatest(limit);
  }

  async createQuiz(data: CreateQuizRequest): Promise<Quiz> {
    // Validate data
    if (!data.title || data.title.trim().length === 0) {
      throw new Error('Quiz title is required');
    }

    if (data.questions.length === 0) {
      throw new Error('Quiz must have at least one question');
    }

    // Validate each question has correct answers
    for (const question of data.questions) {
      const hasCorrectAnswer = question.options.some(opt => opt.isCorrect);
      if (!hasCorrectAnswer) {
        throw new Error(`Question "${question.text}" must have at least one correct answer`);
      }
    }

    return await quizRepository.create(data);
  }

  async updateQuiz(id: string, data: UpdateQuizRequest): Promise<Quiz | null> {
    const existing = await quizRepository.getById(id);
    if (!existing) {
      throw new Error('Quiz not found');
    }

    return await quizRepository.update(id, data);
  }

  async deleteQuiz(id: string): Promise<boolean> {
    return await quizRepository.delete(id);
  }

  async getAllSubjects(): Promise<string[]> {
    const subjects = await quizRepository.getSubjects();
    return ['All', ...subjects.sort()];
  }

  async searchQuizzes(query: string): Promise<Quiz[]> {
    return await quizRepository.getAll({ search: query });
  }

  async filterQuizzes(filter: QuizFilter): Promise<Quiz[]> {
    return await quizRepository.getAll(filter);
  }
}

export const quizService = new QuizService();
