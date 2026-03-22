import { apiClient, API_ENDPOINTS } from '@/core/api';
import type {
  AdminDashboardResDTO,
  AdminGroupPageResDTO,
  AdminGroupUpdateReqDTO,
  AdminListReqDTO,
  AdminNotificationResDTO,
  AdminQuestionBankResDTO,
  AdminQuizPageResDTO,
  AdminQuizUpdateReqDTO,
  AdminRoleReqDTO,
  AdminRoleResDTO,
  AdminResultPageResDTO,
  AdminSubjectReqDTO,
  AdminSubjectResDTO,
  AdminUserPageResDTO,
  AdminUserUpdateReqDTO,
} from '@/domains';

export const adminRepository = {
  getDashboard(): Promise<AdminDashboardResDTO> {
    return apiClient.get<AdminDashboardResDTO>(API_ENDPOINTS.ADMIN.BASE);
  },
  getUsers(params?: AdminListReqDTO): Promise<AdminUserPageResDTO> {
    return apiClient.get<AdminUserPageResDTO>(API_ENDPOINTS.ADMIN.USERS, params);
  },
  updateUser(userId: number, payload: AdminUserUpdateReqDTO): Promise<void> {
    return apiClient.put<void>(API_ENDPOINTS.ADMIN.USER(userId), payload);
  },
  deleteUser(userId: number): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.ADMIN.USER(userId));
  },
  getGroups(params?: AdminListReqDTO): Promise<AdminGroupPageResDTO> {
    return apiClient.get<AdminGroupPageResDTO>(API_ENDPOINTS.ADMIN.GROUPS, params);
  },
  updateGroup(groupId: number, payload: AdminGroupUpdateReqDTO): Promise<void> {
    return apiClient.put<void>(API_ENDPOINTS.ADMIN.GROUP(groupId), payload);
  },
  deleteGroup(groupId: number): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.ADMIN.GROUP(groupId));
  },
  getQuizzes(params?: AdminListReqDTO): Promise<AdminQuizPageResDTO> {
    return apiClient.get<AdminQuizPageResDTO>(API_ENDPOINTS.ADMIN.QUIZZES, params);
  },
  updateQuiz(quizId: number, payload: AdminQuizUpdateReqDTO): Promise<void> {
    return apiClient.put<void>(API_ENDPOINTS.ADMIN.QUIZ(quizId), payload);
  },
  deleteQuiz(quizId: number): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.ADMIN.QUIZ(quizId));
  },
  getResults(params?: AdminListReqDTO): Promise<AdminResultPageResDTO> {
    return apiClient.get<AdminResultPageResDTO>(API_ENDPOINTS.ADMIN.RESULTS, params);
  },
  deleteResult(resultId: number): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.ADMIN.RESULT(resultId));
  },
  getSubjects(): Promise<AdminSubjectResDTO[]> {
    return apiClient.get<AdminSubjectResDTO[]>(API_ENDPOINTS.ADMIN.SUBJECTS);
  },
  createSubject(payload: AdminSubjectReqDTO): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.ADMIN.SUBJECTS, payload);
  },
  updateSubject(subjectId: number, payload: AdminSubjectReqDTO): Promise<AdminSubjectResDTO> {
    return apiClient.put<AdminSubjectResDTO>(API_ENDPOINTS.ADMIN.SUBJECT(subjectId), payload);
  },
  deleteSubject(subjectId: number): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.ADMIN.SUBJECT(subjectId));
  },
  getRoles(): Promise<AdminRoleResDTO[]> {
    return apiClient.get<AdminRoleResDTO[]>(API_ENDPOINTS.ADMIN.ROLES);
  },
  createRole(payload: AdminRoleReqDTO): Promise<AdminRoleResDTO> {
    return apiClient.post<AdminRoleResDTO>(API_ENDPOINTS.ADMIN.ROLES, payload);
  },
  updateRole(roleId: number, payload: AdminRoleReqDTO): Promise<AdminRoleResDTO> {
    return apiClient.put<AdminRoleResDTO>(API_ENDPOINTS.ADMIN.ROLE(roleId), payload);
  },
  deleteRole(roleId: number): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.ADMIN.ROLE(roleId));
  },
  getQuestionBanks(params?: AdminListReqDTO): Promise<AdminQuestionBankResDTO[]> {
    return apiClient.get<AdminQuestionBankResDTO[]>(API_ENDPOINTS.ADMIN.QUESTION_BANKS, params);
  },
  getNotifications(params?: AdminListReqDTO): Promise<AdminNotificationResDTO[]> {
    return apiClient.get<AdminNotificationResDTO[]>(API_ENDPOINTS.ADMIN.NOTIFICATIONS, params);
  },
  deleteNotification(notificationId: number): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.ADMIN.NOTIFICATION(notificationId));
  },
};
