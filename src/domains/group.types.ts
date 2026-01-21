// Group related types and interfaces

import { GroupRole } from './common/pagination.type';
import { User } from './user.types';
import { Quiz } from './quiz.types';

export interface Group {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  role?: GroupRole;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupDetail extends Group {
  members: GroupMember[];
  quizzes: Quiz[];
  announcements: Announcement[];
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  user?: User;
  name: string;
  role: GroupRole;
  avatar?: string;
  joinedAt: Date;
}

export interface Announcement {
  id: string;
  groupId: string;
  authorId: string;
  author?: User;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SharedResource {
  id: string;
  groupId: string;
  uploaderId: string;
  uploader?: User;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
}

export interface UpdateGroupRequest {
  id: string;
  name?: string;
  description?: string;
}

export interface InviteMemberRequest {
  groupId: string;
  email: string;
  role?: GroupRole;
}

export interface CreateAnnouncementRequest {
  groupId: string;
  title: string;
  content: string;
  isPinned?: boolean;
}

export interface CreateSharedResourceRequest {
  groupId: string;
  title: string;
  description?: string;
  file: File;
}

export interface GroupFilter {
  search?: string;
  role?: GroupRole;
}
