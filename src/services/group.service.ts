import { groupRepository } from '@/repositories';
import { LobbyResDTO, LobbyReqDTO, LobbyQuizResDTO, NotificationReqDTO } from '@/domains';
import { QuizReqDTO } from '@/domains/quiz.types';
import { PageResponse } from '@/core/types';

export class GroupService {
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

  async getGroupMembers(groupId: number, page: number = 0, size: number = 10): Promise<PageResponse<any>> {
    return await groupRepository.getMembers(groupId, page, size);
  }

  async removeMember(groupId: number, userId: number): Promise<void> {
    return await groupRepository.removeMember(groupId, userId);
  }

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

  async getOwnedGroups(page: number = 0, size: number = 10): Promise<PageResponse<any>> {
    return await groupRepository.getOwnedGroups(page, size);
  }

  async getJoinedGroups(page: number = 0, size: number = 10): Promise<PageResponse<any>> {
    return await groupRepository.getJoinedGroups(page, size);
  }

  async leaveGroup(groupId: number): Promise<void> {
    return await groupRepository.leaveGroup(groupId);
  }

}

export const groupService = new GroupService();
