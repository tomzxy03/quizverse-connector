// Group Service - Business logic layer

import { groupRepository, userRepository } from '@/repositories';
import {
  Group,
  GroupDetail,
  GroupMember,
  CreateGroupRequest,
  UpdateGroupRequest,
  Announcement,
  CreateAnnouncementRequest,
  SharedResource,
  GroupRole
} from '@/types';

export class GroupService {
  async getAllGroups(userId: string): Promise<Group[]> {
    return await groupRepository.getAll(userId);
  }

  async getGroupById(id: string): Promise<GroupDetail | null> {
    return await groupRepository.getById(id);
  }

  async createGroup(data: CreateGroupRequest, userId: string): Promise<Group> {
    // Validate data
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Group name is required');
    }

    if (data.name.length > 100) {
      throw new Error('Group name is too long (max 100 characters)');
    }

    return await groupRepository.create(data, userId);
  }

  async updateGroup(id: string, data: UpdateGroupRequest): Promise<Group | null> {
    const existing = await groupRepository.getById(id);
    if (!existing) {
      throw new Error('Group not found');
    }

    return await groupRepository.update(id, data);
  }

  async deleteGroup(id: string): Promise<boolean> {
    return await groupRepository.delete(id);
  }

  async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    return await groupRepository.getMembers(groupId);
  }

  async addMember(groupId: string, userId: string, role: GroupRole = 'MEMBER'): Promise<GroupMember> {
    // Validate group exists
    const group = await groupRepository.getById(groupId);
    if (!group) {
      throw new Error('Group not found');
    }

    // Validate user exists
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user is already a member
    const members = await groupRepository.getMembers(groupId);
    const existingMember = members.find(m => m.userId === userId);
    if (existingMember) {
      throw new Error('User is already a member of this group');
    }

    return await groupRepository.addMember(groupId, userId, role);
  }

  async removeMember(groupId: string, userId: string): Promise<boolean> {
    // Check if user is the owner
    const members = await groupRepository.getMembers(groupId);
    const member = members.find(m => m.userId === userId);

    if (member && member.role === 'OWNER') {
      throw new Error('Cannot remove the group owner');
    }

    return await groupRepository.removeMember(groupId, userId);
  }

  async updateMemberRole(groupId: string, userId: string, role: GroupRole): Promise<GroupMember | null> {
    const members = await groupRepository.getMembers(groupId);
    const member = members.find(m => m.userId === userId);

    if (!member) {
      throw new Error('Member not found in this group');
    }

    if (member.role === 'OWNER') {
      throw new Error('Cannot change the role of the group owner');
    }

    // This would update the role in the repository
    // For now, we'll need to add this method to the repository
    return null;
  }

  async getAnnouncements(groupId: string): Promise<Announcement[]> {
    return await groupRepository.getAnnouncements(groupId);
  }

  async createAnnouncement(data: CreateAnnouncementRequest, userId: string): Promise<Announcement> {
    // Validate data
    if (!data.title || data.title.trim().length === 0) {
      throw new Error('Announcement title is required');
    }

    if (!data.content || data.content.trim().length === 0) {
      throw new Error('Announcement content is required');
    }

    // Validate user is a member with appropriate permissions
    const members = await groupRepository.getMembers(data.groupId);
    const member = members.find(m => m.userId === userId);

    if (!member) {
      throw new Error('You must be a member of this group to create announcements');
    }

    if (member.role === 'MEMBER') {
      throw new Error('Only admins and owners can create announcements');
    }

    return await groupRepository.createAnnouncement(data, userId);
  }

  async getSharedResources(groupId: string): Promise<SharedResource[]> {
    return await groupRepository.getSharedResources(groupId);
  }

  async checkMemberPermission(groupId: string, userId: string): Promise<GroupRole | null> {
    const members = await groupRepository.getMembers(groupId);
    const member = members.find(m => m.userId === userId);
    return member ? member.role : null;
  }

  async canManageGroup(groupId: string, userId: string): Promise<boolean> {
    const role = await this.checkMemberPermission(groupId, userId);
    return role === 'OWNER' || role === 'ADMIN';
  }
}

export const groupService = new GroupService();
