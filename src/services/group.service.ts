import { groupRepository } from '@/repositories';
import { LobbyResDTO, LobbyReqDTO, LobbyQuizResDTO, NotificationReqDTO, LobbyInviteCodeResDTO } from '@/domains';
import { QuizReqDTO } from '@/domains/quiz.types';
import { PageResponse } from '@/core/types';

/**
 * Group Service
 * Business logic layer for group operations
 * 
 * Architecture: Service → Repository → API Client → API Endpoints
 * 
 * Responsibilities:
 * - Validate input data
 * - Transform data between DTOs
 * - Handle business logic and rules
 * - Error handling and logging
 * - Call appropriate repository methods
 */
export class GroupService {
  // ===== Group Management =====
  
  async getAllGroups(page: number = 0, size: number = 10, search?: string): Promise<PageResponse<LobbyResDTO>> {
    return await groupRepository.getAll(page, size, search);
  }

  async getGroupById(id: number): Promise<LobbyResDTO> {
    return await groupRepository.getById(id);
  }

  async createGroup(data: LobbyReqDTO): Promise<LobbyResDTO> {
    if (!data.lobbyName || data.lobbyName.trim().length === 0) {
      throw new Error('Group name is required');
    }
    if (data.lobbyName.length > 100) {
      throw new Error('Group name is too long (max 100 characters)');
    }
    return await groupRepository.create(data);
  }

  async updateGroup(id: number, data: LobbyReqDTO): Promise<LobbyResDTO> {
    return await groupRepository.update(id, data);
  }

  async deleteGroup(id: number): Promise<void> {
    return await groupRepository.delete(id);
  }

  async getOwnedGroups(page: number = 0, size: number = 10): Promise<PageResponse<LobbyResDTO>> {
    return await groupRepository.getOwnedGroups(page, size);
  }

  async getJoinedGroups(page: number = 0, size: number = 10): Promise<PageResponse<LobbyResDTO>> {
    return await groupRepository.getJoinedGroups(page, size);
  }

  async leaveGroup(groupId: number): Promise<void> {
    return await groupRepository.leaveGroup(groupId);
  }

  async getCodeInvite(groupId: number): Promise<LobbyInviteCodeResDTO> {
    return await groupRepository.getCodeInvite(groupId);
  }

  async reloadCodeInvite(groupId: number, lobbyId?: number): Promise<LobbyInviteCodeResDTO> {
    return await groupRepository.reloadCodeInvite(groupId, lobbyId ?? groupId);
  }

  async findLobbyByCode(codeInvite: string): Promise<LobbyResDTO> {
    if (!codeInvite || codeInvite.trim().length === 0) {
      throw new Error('Invite code is required');
    }
    return await groupRepository.findLobbyByCode(codeInvite.trim());
  }

  async joinLobby(lobbyId: number): Promise<LobbyResDTO> {
    if (!lobbyId || Number.isNaN(lobbyId)) {
      throw new Error('Lobby ID is required');
    }
    return await groupRepository.joinLobby(lobbyId);
  }

  // ===== Members Management =====

  /**
   * Get members of a specific group with pagination
   * @param groupId - The group identifier
   * @param page - Page number (0-based)
   * @param size - Items per page
   * @returns Paginated list of group members
   */
  async getGroupMembers(groupId: number, page: number = 0, size: number = 10): Promise<PageResponse<any>> {
    return await groupRepository.getMembers(groupId, page, size);
  }

  async deleteMember(groupId: number, userId: number): Promise<void> {
    return await groupRepository.deleteMember(groupId, userId);
  }

  async removeMember(groupId: number, userId: number): Promise<void> {
    return await groupRepository.deleteMember(groupId, userId);
  }

  // ===== Quizzes Management =====

  /**
   * Get quizzes associated with a specific group with pagination
   * @param groupId - The group identifier
   * @param page - Page number (0-based)
   * @param size - Items per page
   * @returns Paginated list of group quizzes
   */
  async getGroupQuizzes(groupId: number, page: number = 0, size: number = 10): Promise<PageResponse<any>> {
    return await groupRepository.getQuizzes(groupId, page, size);
  }

  async addQuiz(groupId: number, quizReqDTO: QuizReqDTO): Promise<LobbyQuizResDTO> {
    return await groupRepository.addQuiz(groupId, quizReqDTO);
  }

  async updateQuiz(groupId: number, quizId: number, quizReqDTO: QuizReqDTO): Promise<LobbyQuizResDTO> {
    return await groupRepository.updateQuiz(groupId, quizId, quizReqDTO);
  }

  async removeQuiz(groupId: number, quizId: number): Promise<void> {
    return await groupRepository.removeQuiz(groupId, quizId);
  }

  // ===== Announcements Management =====

  /**
   * Get announcements for a specific group with pagination
   * @param groupId - The group identifier
   * @param page - Page number (0-based)
   * @param size - Items per page
   * @returns Paginated list of announcements
   */
  async getAnnouncements(groupId: number, page: number = 0, size: number = 10): Promise<PageResponse<any>> {
    return await groupRepository.getAnnouncements(groupId, page, size);
  }

  async addAnnouncement(groupId: number, data: NotificationReqDTO): Promise<any> {
    if (!data.content || data.content.trim().length === 0) {
      throw new Error('Announcement content is required');
    }
    return await groupRepository.addAnnouncement(groupId, data);
  }

  async updateAnnouncement(groupId: number, announcementId: number, data: NotificationReqDTO): Promise<any> {
    if (!data.content || data.content.trim().length === 0) {
      throw new Error('Announcement content is required');
    }
    return await groupRepository.updateAnnouncement(groupId, announcementId, data);
  }

  async deleteAnnouncement(groupId: number, announcementId: number): Promise<void> {
    return await groupRepository.deleteAnnouncement(groupId, announcementId);
  }
}

export const groupService = new GroupService();
