import { apiClient, API_ENDPOINTS } from '@/core/api';
import { RoleResDTO, RoleReqDTO } from '@/domains/role.types';
import { PageResponse } from '@/core/types';

export const roleRepository = {
  getAll(page: number = 0, size: number = 10): Promise<PageResponse<RoleResDTO>> {
    return apiClient.get<PageResponse<RoleResDTO>>(API_ENDPOINTS.ROLES.BASE, { page, size });
  },

  getById(id: number): Promise<RoleResDTO> {
    return apiClient.get<RoleResDTO>(API_ENDPOINTS.ROLES.BY_ID(id));
  },

  create(data: RoleReqDTO): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.ROLES.BASE, data);
  },

  update(id: number, data: RoleReqDTO): Promise<RoleResDTO> {
    return apiClient.put<RoleResDTO>(API_ENDPOINTS.ROLES.BY_ID(id), data);
  },

  delete(id: number): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.ROLES.BY_ID(id));
  }
};
