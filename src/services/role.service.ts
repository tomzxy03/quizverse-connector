import { roleRepository } from '@/repositories';
import { RoleResDTO, RoleReqDTO } from '@/domains/role.types';
import { PageResponse } from '@/core/types';

export class RoleService {
  async getAllRoles(page: number = 0, size: number = 10): Promise<PageResponse<RoleResDTO>> {
    return await roleRepository.getAll(page, size);
  }

  async getRoleById(id: number): Promise<RoleResDTO> {
    return await roleRepository.getById(id);
  }

  async createRole(data: RoleReqDTO): Promise<void> {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Role name is required');
    }
    if (data.name.length > 50) {
      throw new Error('Role name is too long (max 50 characters)');
    }
    return await roleRepository.create(data);
  }

  async updateRole(id: number, data: RoleReqDTO): Promise<RoleResDTO> {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Role name is required');
    }
    if (data.name.length > 50) {
      throw new Error('Role name is too long (max 50 characters)');
    }
    return await roleRepository.update(id, data);
  }

  async deleteRole(id: number): Promise<void> {
    return await roleRepository.delete(id);
  }
}

export const roleService = new RoleService();
