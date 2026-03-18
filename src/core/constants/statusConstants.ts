import { QuizStatus, AttemptState } from '../types/enum';

/**
 * Status Labels - Maps enum values to user-friendly Vietnamese labels
 * Change these to update how statuses appear throughout the app
 */
export const QUIZ_STATUS_LABELS: Record<QuizStatus, string> = {
  'draft': 'Bản nháp',
  'opened': 'Đang mở',
  'closed': 'Đã đóng',
  'archived': 'Đã lưu trữ',
};

export const ATTEMPT_STATE_LABELS: Record<AttemptState, string> = {
  'NONE': 'Chưa tham gia',
  'NOT_STARTED': 'Chưa bắt đầu',
  'IN_PROGRESS': 'Đang làm',
  'SUBMITTED': 'Đã nộp',
  'EXPIRED': 'Đã hết hạn',
};

/**
 * Status Colors - For UI styling (tailwind/shadcn colors)
 * Change these to update the visual appearance of statuses
 */
export const QUIZ_STATUS_COLORS: Record<QuizStatus, string> = {
  'draft': 'bg-gray-100 text-gray-800 border-gray-300',
  'opened': 'bg-emerald-100 text-emerald-800 border-emerald-300',
  'closed': 'bg-slate-100 text-slate-800 border-slate-300',
  'archived': 'bg-stone-100 text-stone-800 border-stone-300',
};

export const ATTEMPT_STATE_COLORS: Record<AttemptState, string> = {
  'NONE': 'bg-gray-100 text-gray-800',
  'NOT_STARTED': 'bg-gray-100 text-gray-800',
  'IN_PROGRESS': 'bg-blue-100 text-blue-800',
  'SUBMITTED': 'bg-green-100 text-green-800',
  'EXPIRED': 'bg-red-100 text-red-800',
};

/**
 * Badge Variants - For shadcn Badge component
 * Maps status to badge variant (default, outline, secondary, etc.)
 */
export const QUIZ_STATUS_BADGE_VARIANTS: Record<
  QuizStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  'draft': 'outline',
  'opened': 'default',
  'closed': 'secondary',
  'archived': 'outline',
};

export const ATTEMPT_STATE_BADGE_VARIANTS: Record<
  AttemptState,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  'NONE': 'outline',
  'NOT_STARTED': 'outline',
  'IN_PROGRESS': 'default',
  'SUBMITTED': 'secondary',
  'EXPIRED': 'destructive',
};

/**
 * Helper Functions - Reusable logic for checking statuses
 * Use these instead of hardcoding status checks throughout your components
 */

export const isQuizAvailable = (status: QuizStatus): boolean => {
  return status === 'opened';
};

export const isQuizClosed = (status: QuizStatus): boolean => {
  return status === 'closed';
};

export const isQuizArchived = (status: QuizStatus): boolean => {
  return status === 'archived';
};

export const isDraft = (status: QuizStatus): boolean => {
  return status === 'draft';
};

export const getQuizStatusLabel = (status: QuizStatus): string => {
  return QUIZ_STATUS_LABELS[status] || 'Unknown';
};

export const getAttemptStateLabel = (state: AttemptState): string => {
  return ATTEMPT_STATE_LABELS[state] || 'Unknown';
};

export const getQuizStatusColor = (status: QuizStatus): string => {
  return QUIZ_STATUS_COLORS[status];
};

export const getAttemptStateColor = (state: AttemptState): string => {
  return ATTEMPT_STATE_COLORS[state];
};

export const getQuizStatusBadgeVariant = (
  status: QuizStatus
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  return QUIZ_STATUS_BADGE_VARIANTS[status];
};

export const getAttemptStateBadgeVariant = (
  state: AttemptState
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  return ATTEMPT_STATE_BADGE_VARIANTS[state];
};

/**
 * Status Transition Rules
 * Define which statuses can transition to which other statuses
 */
export const QUIZ_STATUS_TRANSITIONS: Record<QuizStatus, QuizStatus[]> = {
  'draft': ['opened', 'archived'],
  'opened': ['closed', 'archived'],
  'closed': ['archived'],
  'archived': [],
};

/**
 * Check if a status transition is allowed
 */
export const canTransitionStatus = (
  from: QuizStatus,
  to: QuizStatus
): boolean => {
  return QUIZ_STATUS_TRANSITIONS[from].includes(to);
};

/**
 * Attempt State Transitions
 */
export const ATTEMPT_STATE_TRANSITIONS: Record<AttemptState, AttemptState[]> = {
  'NONE': ['NOT_STARTED'],
  'NOT_STARTED': ['IN_PROGRESS'],
  'IN_PROGRESS': ['SUBMITTED', 'EXPIRED'],
  'SUBMITTED': [],
  'EXPIRED': [],
};

/**
 * Check if an attempt state transition is allowed
 */
export const canTransitionAttemptState = (
  from: AttemptState,
  to: AttemptState
): boolean => {
  return ATTEMPT_STATE_TRANSITIONS[from].includes(to);
};
