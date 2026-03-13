// Dashboard aggregate types – lightweight, no questions/answers/snapshots

import { UserResDTO } from './user.types';
import { GroupRole } from '@/core/types';

/** Quiz instance status for resume / recent / upcoming */
export type QuizInstanceStatus = 'IN_PROGRESS' | 'DONE' | 'UPCOMING' | 'MISSED';

/** In-progress quiz instance (resume) */
export interface InProgressQuizInstance {
  id: number;
  quizId: number;
  quizTitle: string;
  answeredCount: number;
  totalQuestions: number;
  timeRemainingSeconds?: number;
  resumedAt: string; // ISO
}

/** Recent or upcoming quiz item */
export interface QuizRecentItem {
  id: number;
  quizId: number;
  quizTitle: string;
  status: QuizInstanceStatus; // DONE | UPCOMING | MISSED
  submittedAt?: string; // ISO, for DONE
  startDate?: string; // ISO, for UPCOMING
  endDate?: string;
}

/** Group summary for dashboard */
export interface DashboardGroupSummary {
  id: number;
  name: string;
  role: GroupRole;
  openQuizzesCount: number;
}

/** Draft quiz (Host/Admin) */
export interface DraftQuizItem {
  id: number;
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
  user: UserResDTO;
  userStats: DashboardUserStats;
  inProgressInstances: InProgressQuizInstance[];
  recentAndUpcoming: QuizRecentItem[];
  groups: DashboardGroupSummary[];
  draftQuizzes: DraftQuizItem[];
}
