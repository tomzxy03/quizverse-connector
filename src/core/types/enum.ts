// Difficulty levels
export type Difficulty = 'easy' | 'medium' | 'hard';

// Group roles
export type GroupRole = 'HOST' | 'OWNER' | 'ADMIN' | 'MEMBER';

// Question types - Matches BE QuestionReqDTO.questionType
export type QuestionType = 'text' | 'image';

// Answer types - Matches BE AnswerReqDTO.answerType
export type AnswerType = 'text' | 'image';

// Quiz visibility levels - Matches BE QuizResDTO.quizVisibility
export type QuizVisibility = 'public' | 'private' | 'class_only';

// Quiz status states - Matches BE QuizResDTO.status
export type QuizStatus = 'draft' | 'opened' | 'closed' | 'archived';

// Question difficulty levels - Matches BE QuestionReqDTO.level
export type QuestionLevel = 'easy' | 'medium' | 'hard';

// Notification types - Matches BE NotificationReqDTO.type
export type NotificationType = 'system' | 'group' | 'personal';

// Content tabs for group pages
export type ContentTab = 'announcements' | 'quizzes' | 'members' | 'shared' | 'questionBank';

// Attempt states for quiz taking
export type AttemptState = 'NONE' | 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'EXPIRED';

// Question numbering formats
export type QuestionNumberingFormat = 'A, B, C...' | '1, 2, 3...' | 'none';

// Result display modes
export type ResultDisplayMode = 'immediate' | 'after_submission' | 'after_deadline' | 'never';

// Utility type maps for UI display
export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Dễ',
  medium: 'Trung bình',
  hard: 'Khó',
};

export const QUIZ_STATUS_LABELS: Record<QuizStatus, string> = {
  draft: 'Bản nháp',
  opened: 'Đang mở',
  closed: 'Đã đóng',
  archived: 'Đã lưu trữ',
};

export const QUIZ_VISIBILITY_LABELS: Record<QuizVisibility, string> = {
  public: 'Công khai',
  private: 'Riêng tư',
  class_only: 'Chỉ nhóm',
};

export const ATTEMPT_STATE_LABELS: Record<AttemptState, string> = {
  NONE: 'Chưa tham gia',
  NOT_STARTED: 'Chưa tham gia',
  IN_PROGRESS: 'Đang làm dở',
  SUBMITTED: 'Đã nộp bài',
  EXPIRED: 'Đã hết hạn',
};
