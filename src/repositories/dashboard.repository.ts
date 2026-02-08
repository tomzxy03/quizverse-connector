// Dashboard repository – mock aggregated data (replace with API call to DASHBOARD.SUMMARY when backend ready)

import type {
  DashboardSummary,
  InProgressQuizInstance,
  QuizRecentItem,
  DashboardGroupSummary,
  DraftQuizItem,
} from '@/domains/dashboard.types';
import { User } from '@/domains';

export async function getDashboardSummary(userId: string): Promise<DashboardSummary> {
  // Simulate network
  await new Promise((r) => setTimeout(r, 300));

  const user: User = {
    id: userId,
    email: 'user@example.com',
    username: 'thichcakhia20',
    fullName: 'Nguyen Van A',
    avatar: 'https://i.pravatar.cc/150?img=1',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date(),
  };

  const inProgressInstances: InProgressQuizInstance[] = [
    {
      id: 'inst-1',
      quizId: '1',
      quizTitle: '2024 Practice Set TOEIC – Test 5',
      answeredCount: 45,
      totalQuestions: 200,
      timeRemainingSeconds: 3600,
      resumedAt: new Date().toISOString(),
    },
    {
      id: 'inst-2',
      quizId: '2',
      quizTitle: 'Đại số cơ bản',
      answeredCount: 8,
      totalQuestions: 15,
      resumedAt: new Date().toISOString(),
    },
  ];

  const recentAndUpcoming: QuizRecentItem[] = [
    {
      id: 'r1',
      quizId: '3',
      quizTitle: 'Định luật Newton',
      status: 'DONE',
      submittedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'r2',
      quizId: '4',
      quizTitle: 'Sinh học tế bào',
      status: 'UPCOMING',
      startDate: new Date(Date.now() + 2 * 86400000).toISOString(),
      endDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    },
    {
      id: 'r3',
      quizId: '5',
      quizTitle: 'Thế chiến thứ II',
      status: 'MISSED',
      endDate: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  const groups: DashboardGroupSummary[] = [
    { id: '1', name: 'Lớp Toán Cao Cấp', role: 'OWNER', openQuizzesCount: 2 },
    { id: '2', name: 'TOEIC Study Group', role: 'ADMIN', openQuizzesCount: 1 },
    { id: '3', name: 'Java Programming', role: 'MEMBER', openQuizzesCount: 3 },
  ];

  const draftQuizzes: DraftQuizItem[] = [
    {
      id: 'd1',
      title: 'Quiz Hóa học – Bảng tuần hoàn',
      subject: 'Hóa học',
      questionCount: 12,
      updatedAt: new Date().toISOString(),
    },
  ];

  return {
    user,
    userStats: {
      totalQuizzesTaken: 24,
      inProgressCount: inProgressInstances.length,
      completedCount: 22,
    },
    inProgressInstances,
    recentAndUpcoming,
    groups,
    draftQuizzes,
  };
}
