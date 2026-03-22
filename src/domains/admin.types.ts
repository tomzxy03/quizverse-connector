import type { PageResponse } from '@/core/types/pagination.types';

export type AdminUserStatus = 'ACTIVE' | 'PENDING' | 'BANNED';
export type AdminGroupStatus = 'ACTIVE' | 'ARCHIVED' | 'BLOCKED';
export type AdminQuizStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type AdminResultStatus = 'IN_PROGRESS' | 'DONE' | 'MISSED';
export type AdminQuizVisibility = 'PUBLIC' | 'PRIVATE' | 'GROUP';

export interface AdminDashboardCounts {
  totalUsers: number;
  totalGroups: number;
  totalQuizzes: number;
  totalResults: number;
  activeQuizzes: number;
  newUsers7d: number;
  newGroups7d: number;
  newQuizzes7d: number;
  newResults7d: number;
}

export interface AdminDashboardTrendPoint {
  date: string; // ISO date
  users: number;
  groups: number;
  quizzes: number;
  results: number;
}

export interface AdminDashboardRecentItem {
  id: number;
  type: 'USER' | 'GROUP' | 'QUIZ' | 'RESULT';
  title: string;
  subtitle?: string;
  createdAt: string; // ISO
  status?: string;
}

export interface AdminDashboardResDTO {
  counts: AdminDashboardCounts;
  trends: AdminDashboardTrendPoint[];
  recent: AdminDashboardRecentItem[];
}

export interface AdminUserResDTO {
  id: number;
  userName: string;
  email: string;
  roles: string[];
  status: AdminUserStatus;
  createdAt: string;
  lastLoginAt?: string;
  quizTakenCount: number;
  groupCount: number;
}

export interface AdminGroupResDTO {
  id: number;
  name: string;
  ownerName: string;
  memberCount: number;
  quizCount: number;
  status: AdminGroupStatus;
  createdAt: string;
}

export interface AdminQuizResDTO {
  id: number;
  title: string;
  subject: string;
  ownerName: string;
  groupName?: string;
  status: AdminQuizStatus;
  visibility: AdminQuizVisibility;
  questionCount: number;
  attemptsCount: number;
  createdAt: string;
}

export interface AdminResultResDTO {
  id: number;
  quizTitle: string;
  userName: string;
  groupName?: string;
  status: AdminResultStatus;
  score?: number;
  submittedAt?: string;
  durationSeconds?: number;
}

export interface AdminSubjectResDTO {
  id: number;
  name: string;
  description?: string;
  active: boolean;
  quizCount: number;
}

export interface AdminSubjectReqDTO {
  name: string;
  description?: string;
}

export interface AdminRoleResDTO {
  id: number;
  name: string;
  userCount: number;
  permissions: string[];
}

export interface AdminRoleReqDTO {
  name: string;
  permissions: string[];
}

export interface AdminNotificationResDTO {
  id: number;
  title: string;
  type: string;
  targetGroupName?: string;
  creatorName: string;
  createdAt: string;
}

export interface AdminQuestionBankResDTO {
  id: number;
  ownerName: string;
  folderCount: number;
  questionCount: number;
  createdAt: string;
}

export interface AdminListReqDTO {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
  search?: string;
  status?: string;
  visibility?: string;
  groupId?: number;
  quizId?: number;
  userId?: number;
}

export interface AdminUserUpdateReqDTO {
  status?: AdminUserStatus;
  roles?: string[];
}

export interface AdminGroupUpdateReqDTO {
  status?: AdminGroupStatus;
}

export interface AdminQuizUpdateReqDTO {
  status?: AdminQuizStatus;
  visibility?: AdminQuizVisibility;
}

export type AdminUserPageResDTO = PageResponse<AdminUserResDTO>;
export type AdminGroupPageResDTO = PageResponse<AdminGroupResDTO>;
export type AdminQuizPageResDTO = PageResponse<AdminQuizResDTO>;
export type AdminResultPageResDTO = PageResponse<AdminResultResDTO>;
