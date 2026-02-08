// GroupContent/types.ts
export type GroupRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export interface Group {
  id: string;
  name: string;
  memberCount: number;
  role: GroupRole;
}

export type ContentTab =
  | 'announcements'
  | 'quizzes'
  | 'members'
  | 'shared'
  | 'questionBank';
