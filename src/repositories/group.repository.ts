import { apiClient, API_ENDPOINTS } from '@/core/api';
import { LobbyResDTO, LobbyReqDTO, LobbyQuizResDTO } from '@/domains';
import { QuizReqDTO } from '@/domains/quiz.types';
import { NotificationReqDTO } from '@/domains/notification.types';
import { PageResponse } from '@/core/types';

export const groupRepository = {
  getAll(page: number = 0, size: number = 10, search?: string): Promise<PageResponse<LobbyResDTO>> {
    return apiClient.get<PageResponse<LobbyResDTO>>(API_ENDPOINTS.GROUPS.BASE, { page, size, search });
  },

  getById(id: number): Promise<LobbyResDTO> {
    return apiClient.get<LobbyResDTO>(API_ENDPOINTS.GROUPS.BY_ID(id));
  },

  create(data: LobbyReqDTO): Promise<LobbyResDTO> {
    return apiClient.post<LobbyResDTO>(API_ENDPOINTS.GROUPS.BASE, data);
  },

  update(id: number, data: LobbyReqDTO): Promise<LobbyResDTO> {
    return apiClient.put<LobbyResDTO>(API_ENDPOINTS.GROUPS.BY_ID(id), data);
  },

  delete(id: number): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.GROUPS.BY_ID(id));
  },

  getMembers(groupId: number, page: number = 0, size: number = 10): Promise<PageResponse<any>> {
    return apiClient.get(API_ENDPOINTS.GROUPS.MEMBERS(groupId), { page, size });
  },

  removeMember(groupId: number, userId: number): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.GROUPS.REMOVE_MEMBER(groupId, userId));
  },

  getQuizzes(groupId: number, page: number = 0, size: number = 10): Promise<PageResponse<any>> {
    return apiClient.get(API_ENDPOINTS.GROUPS.QUIZZES(groupId), { page, size });
  },

  addQuiz(groupId: number, data: QuizReqDTO): Promise<LobbyQuizResDTO> {
    return apiClient.post<LobbyQuizResDTO>(API_ENDPOINTS.GROUPS.QUIZZES(groupId), data);
  },

  updateQuiz(groupId: number, quizId: number, data: QuizReqDTO): Promise<LobbyQuizResDTO> {
    return apiClient.put<LobbyQuizResDTO>(API_ENDPOINTS.GROUPS.UPDATE_QUIZ(groupId, quizId), data);
  },

  removeQuiz(groupId: number, quizId: number): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.GROUPS.REMOVE_QUIZ(groupId, quizId));
  },

  getAnnouncements(groupId: number, page: number = 0, size: number = 10): Promise<PageResponse<any>> {
    return apiClient.get(API_ENDPOINTS.GROUPS.ANNOUNCEMENTS(groupId), { page, size });
  },

  addAnnouncement(groupId: number, data: NotificationReqDTO): Promise<any> {
    return apiClient.get(API_ENDPOINTS.GROUPS.ADD_ANNOUNCEMENT(groupId), { ...data });
  },

  updateAnnouncement(groupId: number, announcementId: number, data: NotificationReqDTO): Promise<any> {
    return apiClient.put(API_ENDPOINTS.GROUPS.UPDATE_ANNOUNCEMENT(groupId, announcementId), data);
  },

  deleteAnnouncement(groupId: number, announcementId: number): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.GROUPS.DELETE_ANNOUNCEMENT(groupId, announcementId));
  },

  getOwnedGroups(page: number = 0, size: number = 10): Promise<PageResponse<any>> {
    return apiClient.get(API_ENDPOINTS.GROUPS.OWNED, { page, size });
  },

  getJoinedGroups(page: number = 0, size: number = 10): Promise<PageResponse<any>> {
    return apiClient.get(API_ENDPOINTS.GROUPS.JOINED, { page, size });
  },

  leaveGroup(groupId: number): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.GROUPS.LEAVE(groupId));
  }
};
