import { apiClient, API_ENDPOINTS } from '@/core/api';
import {
  UserResDTO,
  UserProfileReqDTO,
  LoginReqDTO,
  SignupReqDTO,
  AuthResDTO,
  RefreshTokenReqDTO
} from '@/domains';

export const userRepository = {
  login(data: LoginReqDTO): Promise<AuthResDTO> {
    return apiClient.post<AuthResDTO>(API_ENDPOINTS.AUTH.LOGIN, data);
  },

  signUp(data: SignupReqDTO): Promise<AuthResDTO> {
    return apiClient.post<AuthResDTO>(API_ENDPOINTS.AUTH.SIGNUP, data);
  },

  logout(data: RefreshTokenReqDTO): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT, data);
  },

  refreshToken(data: RefreshTokenReqDTO): Promise<AuthResDTO> {
    return apiClient.post<AuthResDTO>(API_ENDPOINTS.AUTH.REFRESH, data);
  },

  getCurrentUser(): Promise<UserResDTO> {
    return apiClient.get<UserResDTO>(API_ENDPOINTS.AUTH.CURRENT_USER);
  },

  getById(id: number): Promise<UserResDTO> {
    return apiClient.get<UserResDTO>(API_ENDPOINTS.USERS.BY_ID(id));
  },

  updateProfile(id: number, data: UserProfileReqDTO): Promise<UserResDTO> {
    return apiClient.put<UserResDTO>(API_ENDPOINTS.USERS.PROFILE(id), data);
  },

  deleteMany(ids: number[]): Promise<void> {
    // Note: apiClient.delete doesn't pass a body yet, so modifying to a different approach if needed
    // Assuming backend takes comma separated IDs via query or similar, or apiClient needs update.
    // For now we'll send it as a POST or custom request if BE requires body in DELETE
    return apiClient.post<void>(API_ENDPOINTS.USERS.DELETE_MANY, ids);
  }
};
