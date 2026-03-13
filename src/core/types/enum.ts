export type Difficulty = 'easy' | 'medium' | 'hard';

export type GroupRole = 'HOST' | 'OWNER' | 'ADMIN' | 'MEMBER';

// Matches BE QuestionReqDTO.questionType
export type QuestionType = 'text' | 'image';

// Matches BE AnswerReqDTO.answerType
export type AnswerType = 'text' | 'image';

// Matches BE QuizResDTO.quizVisibility
export type QuizVisibility = 'public' | 'private' | 'class_only';

// Matches BE QuizResDTO.status
export type QuizStatus = 'draft' | 'opened' | 'closed' | 'archived';

// Matches BE QuestionReqDTO.level
export type QuestionLevel = 'easy' | 'medium' | 'hard';

// Matches BE NotificationReqDTO.type
export type NotificationType = 'system' | 'group' | 'personal';

export type ContentTab = 'announcements' | 'quizzes' | 'members' | 'shared' | 'questionBank';
