// Exam Service - Business logic layer

import { examRepository, quizRepository } from '@/repositories';
import { ExamAttempt, ExamAttemptDetail, CreateExamAttemptRequest, UserStatistics } from '@/types';

export class ExamService {
  async getExamHistory(userId: string): Promise<ExamAttempt[]> {
    return await examRepository.getByUserId(userId);
  }

  async getExamAttemptById(id: string): Promise<ExamAttemptDetail | null> {
    return await examRepository.getById(id);
  }

  async getQuizAttempts(quizId: string, userId: string): Promise<ExamAttempt[]> {
    return await examRepository.getByQuizId(quizId, userId);
  }

  async submitExamAttempt(data: CreateExamAttemptRequest, userId: string): Promise<ExamAttempt> {
    // Validate quiz exists
    const quiz = await quizRepository.getById(data.quizId);
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    // Validate attempt duration
    const duration = data.completedAt.getTime() - data.startedAt.getTime();
    if (duration < 0) {
      throw new Error('Invalid attempt duration');
    }

    // Validate all questions are answered
    if (data.answers.length === 0) {
      throw new Error('No answers provided');
    }

    return await examRepository.create(data, userId);
  }

  async deleteExamAttempt(id: string): Promise<boolean> {
    return await examRepository.delete(id);
  }

  async getUserStatistics(userId: string): Promise<UserStatistics> {
    const attempts = await examRepository.getByUserId(userId);

    if (attempts.length === 0) {
      return {
        userId,
        totalQuizzesTaken: 0,
        totalPoints: 0,
        averageScore: 0,
        totalTimeSpent: 0,
        quizzesBySubject: {},
        quizzesByDifficulty: {},
        recentActivity: []
      };
    }

    // Calculate statistics
    const totalPoints = attempts.reduce((sum, a) => sum + (a.points || 0), 0);
    const totalTimeSpent = attempts.reduce((sum, a) => {
      const [hours, minutes, seconds] = a.duration.split(':').map(Number);
      return sum + hours * 3600 + minutes * 60 + seconds;
    }, 0);

    const scores = attempts.map(a => {
      const [correct, total] = a.score.split('/').map(Number);
      return (correct / total) * 100;
    });
    const averageScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;

    // Get quiz details for subjects
    const quizzesBySubject: { [subject: string]: number } = {};
    const quizzesByDifficulty: { [difficulty: string]: number } = {};

    for (const attempt of attempts) {
      const quiz = await quizRepository.getById(attempt.quizId);
      if (quiz) {
        quizzesBySubject[quiz.subject] = (quizzesBySubject[quiz.subject] || 0) + 1;
        quizzesByDifficulty[quiz.difficulty] = (quizzesByDifficulty[quiz.difficulty] || 0) + 1;
      }
    }

    return {
      userId,
      totalQuizzesTaken: attempts.length,
      totalPoints,
      averageScore: Math.round(averageScore * 100) / 100,
      totalTimeSpent,
      quizzesBySubject,
      quizzesByDifficulty,
      recentActivity: attempts.slice(0, 5)
    };
  }

  async getQuizStatistics(quizId: string): Promise<any> {
    // This would aggregate all attempts for a quiz
    // For now, return mock data
    return {
      quizId,
      totalAttempts: 0,
      averageScore: 0,
      averageTime: 0,
      completionRate: 0,
      difficultyRating: 0
    };
  }
}

export const examService = new ExamService();
