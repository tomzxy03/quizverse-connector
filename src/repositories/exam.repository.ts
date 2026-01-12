// Exam Attempt Repository - Mock implementation

import { ExamAttempt, CreateExamAttemptRequest, ExamAttemptDetail } from '@/types';

export class ExamRepository {
  private mockExamHistory: ExamAttempt[] = [
    {
      id: '1',
      quizId: '1',
      userId: 'user1',
      title: '2024 Practice Set TOEIC Test 5',
      date: '03/11/2025',
      score: '130/200',
      totalQuestions: 200,
      correctAnswers: 130,
      points: 655,
      duration: '1:55:19',
      completedAt: new Date('2025-11-03'),
      badges: ['Full test'],
      badgeColors: ['bg-green-600']
    },
    {
      id: '2',
      quizId: '1',
      userId: 'user1',
      title: '2024 Practice Set TOEIC Test 9',
      date: '01/11/2025',
      score: '123/200',
      totalQuestions: 200,
      correctAnswers: 123,
      points: 620,
      duration: '2:00:00',
      completedAt: new Date('2025-11-01'),
      badges: ['Full test'],
      badgeColors: ['bg-green-600']
    },
    {
      id: '3',
      quizId: '2',
      userId: 'user1',
      title: 'Practice Set TOEIC 2020 Test 1',
      date: '25/09/2025',
      score: '21/45',
      totalQuestions: 45,
      correctAnswers: 21,
      points: undefined,
      duration: '0:09:34',
      completedAt: new Date('2025-09-25'),
      badges: ['Luyện tập', 'Part 1', 'Part 3'],
      badgeColors: ['bg-orange-500', 'bg-orange-500', 'bg-orange-500']
    },
    {
      id: '4',
      quizId: '2',
      userId: 'user1',
      title: 'Practice Set TOEIC 2020 Test 1',
      date: '04/08/2025',
      score: '2/39',
      totalQuestions: 39,
      correctAnswers: 2,
      points: undefined,
      duration: '0:00:10',
      completedAt: new Date('2025-08-04'),
      badges: ['Luyện tập', 'Part 3'],
      badgeColors: ['bg-orange-500', 'bg-orange-500']
    }
  ];

  async getByUserId(userId: string): Promise<ExamAttempt[]> {
    const result = this.mockExamHistory.filter(e => e.userId === userId);
    return Promise.resolve(result);
  }

  async getById(id: string): Promise<ExamAttemptDetail | null> {
    const attempt = this.mockExamHistory.find(e => e.id === id);
    if (!attempt) return null;

    return Promise.resolve({
      ...attempt,
      answers: []
    });
  }

  async getByQuizId(quizId: string, userId: string): Promise<ExamAttempt[]> {
    const result = this.mockExamHistory.filter(
      e => e.quizId === quizId && e.userId === userId
    );
    return Promise.resolve(result);
  }

  async create(data: CreateExamAttemptRequest, userId: string): Promise<ExamAttempt> {
    const duration = this.calculateDuration(data.startedAt, data.completedAt);
    const correctAnswers = data.answers.filter(a => a.selectedOptionIds.length > 0).length;

    const newAttempt: ExamAttempt = {
      id: String(this.mockExamHistory.length + 1),
      quizId: data.quizId,
      userId,
      score: `${correctAnswers}/${data.answers.length}`,
      totalQuestions: data.answers.length,
      correctAnswers,
      duration,
      completedAt: data.completedAt,
      badges: ['Full test'],
      badgeColors: ['bg-green-600']
    };

    this.mockExamHistory.push(newAttempt);
    return Promise.resolve(newAttempt);
  }

  private calculateDuration(start: Date, end: Date): string {
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.mockExamHistory.findIndex(e => e.id === id);
    if (index === -1) return false;

    this.mockExamHistory.splice(index, 1);
    return Promise.resolve(true);
  }
}

export const examRepository = new ExamRepository();
