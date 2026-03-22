import { adminRepository } from '@/repositories';
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

export class AdminService {
  getDashboard(): Promise<AdminDashboardResDTO> {
    return adminRepository.getDashboard();
  }
  getUsers(params?: AdminListReqDTO): Promise<AdminUserPageResDTO> {
    return adminRepository.getUsers(params);
  }
  updateUser(userId: number, payload: AdminUserUpdateReqDTO): Promise<void> {
    return adminRepository.updateUser(userId, payload);
  }
  deleteUser(userId: number): Promise<void> {
    return adminRepository.deleteUser(userId);
  }
  getGroups(params?: AdminListReqDTO): Promise<AdminGroupPageResDTO> {
    return adminRepository.getGroups(params);
  }
  updateGroup(groupId: number, payload: AdminGroupUpdateReqDTO): Promise<void> {
    return adminRepository.updateGroup(groupId, payload);
  }
  deleteGroup(groupId: number): Promise<void> {
    return adminRepository.deleteGroup(groupId);
  }
  getQuizzes(params?: AdminListReqDTO): Promise<AdminQuizPageResDTO> {
    return adminRepository.getQuizzes(params);
  }
  updateQuiz(quizId: number, payload: AdminQuizUpdateReqDTO): Promise<void> {
    return adminRepository.updateQuiz(quizId, payload);
  }
  deleteQuiz(quizId: number): Promise<void> {
    return adminRepository.deleteQuiz(quizId);
  }
  getResults(params?: AdminListReqDTO): Promise<AdminResultPageResDTO> {
    return adminRepository.getResults(params);
  }
  deleteResult(resultId: number): Promise<void> {
    return adminRepository.deleteResult(resultId);
  }
  getSubjects(): Promise<AdminSubjectResDTO[]> {
    return adminRepository.getSubjects();
  }
  createSubject(payload: AdminSubjectReqDTO): Promise<void> {
    return adminRepository.createSubject(payload);
  }
  updateSubject(subjectId: number, payload: AdminSubjectReqDTO): Promise<AdminSubjectResDTO> {
    return adminRepository.updateSubject(subjectId, payload);
  }
  deleteSubject(subjectId: number): Promise<void> {
    return adminRepository.deleteSubject(subjectId);
  }
  getRoles(): Promise<AdminRoleResDTO[]> {
    return adminRepository.getRoles();
  }
  createRole(payload: AdminRoleReqDTO): Promise<AdminRoleResDTO> {
    return adminRepository.createRole(payload);
  }
  updateRole(roleId: number, payload: AdminRoleReqDTO): Promise<AdminRoleResDTO> {
    return adminRepository.updateRole(roleId, payload);
  }
  deleteRole(roleId: number): Promise<void> {
    return adminRepository.deleteRole(roleId);
  }
  getQuestionBanks(params?: AdminListReqDTO): Promise<AdminQuestionBankResDTO[]> {
    return adminRepository.getQuestionBanks(params);
  }
  getNotifications(params?: AdminListReqDTO): Promise<AdminNotificationResDTO[]> {
    return adminRepository.getNotifications(params);
  }
  deleteNotification(notificationId: number): Promise<void> {
    return adminRepository.deleteNotification(notificationId);
  }
}

export const adminService = new AdminService();
