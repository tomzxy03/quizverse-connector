// Common types and enums used across the application

export type Difficulty = 'easy' | 'medium' | 'hard';

export type GroupRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';

export type ContentTab = 'announcements' | 'quizzes' | 'members' | 'shared' | 'questionBank';

// ============= PAGINATION =============

export interface PageRequest {
  page: number;
  size: number;
  sort?: string;
  direction?: 'ASC' | 'DESC';
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ============= API RESPONSE =============

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
  timestamp: Date;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}
