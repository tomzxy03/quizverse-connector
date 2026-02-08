// Exam attempt and user answer types

import { Quiz, Question } from './quiz.types';

export interface ExamAttempt {
  id: string;
  quizId: string;
  userId: string;
  quiz?: Quiz;
  title?: string;
  date?: string;
  score: string;
  totalQuestions: number;
  correctAnswers: number;
  points?: number;
  duration: string;
  completedAt: Date;
  badges: string[];
  badgeColors: string[];
}

export interface ExamAttemptDetail extends ExamAttempt {
  answers: UserAnswer[];
}

export interface UserAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  question?: Question;
  selectedOptionIds: string[];
  answerText?: string;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface CreateExamAttemptRequest {
  quizId: string;
  answers: SubmitAnswerRequest[];
  startedAt: Date;
  completedAt: Date;
}

export interface SubmitAnswerRequest {
  questionId: string;
  selectedOptionIds: string[];
  answerText?: string;
}

export interface UserStatistics {
  userId: string;
  totalQuizzesTaken: number;
  totalPoints: number;
  averageScore: number;
  totalTimeSpent: number;
  quizzesBySubject: { [subject: string]: number };
  quizzesByDifficulty: { [difficulty: string]: number };
  recentActivity: ExamAttempt[];
}
