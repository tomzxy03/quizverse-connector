// Dashboard aggregate types – lightweight, no questions/answers/snapshots

import { User } from './user.types';
import { GroupRole } from '@/core/types';

/** Quiz instance status for resume / recent / upcoming */
export type QuizInstanceStatus = 'IN_PROGRESS' | 'DONE' | 'UPCOMING' | 'MISSED';

/** In-progress quiz instance (resume) */
export interface InProgressQuizInstance {
  id: string;
  quizId: string;
  quizTitle: string;
  answeredCount: number;
  totalQuestions: number;
  timeRemainingSeconds?: number;
  resumedAt: string; // ISO
}

/** Recent or upcoming quiz item */
export interface QuizRecentItem {
  id: string;
  quizId: string;
  quizTitle: string;
  status: QuizInstanceStatus; // DONE | UPCOMING | MISSED
  submittedAt?: string; // ISO, for DONE
  startDate?: string; // ISO, for UPCOMING
  endDate?: string;
}

/** Group summary for dashboard */
export interface DashboardGroupSummary {
  id: string;
  name: string;
  role: GroupRole;
  openQuizzesCount: number;
}

/** Draft quiz (Host/Admin) */
export interface DraftQuizItem {
  id: string;
  title: string;
  subject: string;
  questionCount: number;
  updatedAt: string; // ISO
}

/** User stats for dashboard header */
export interface DashboardUserStats {
  totalQuizzesTaken: number;
  inProgressCount: number;
  completedCount: number;
}

/** Full dashboard payload (1 aggregated API) */
export interface DashboardSummary {
  user: User;
  userStats: DashboardUserStats;
  inProgressInstances: InProgressQuizInstance[];
  recentAndUpcoming: QuizRecentItem[];
  groups: DashboardGroupSummary[];
  draftQuizzes: DraftQuizItem[];
}
