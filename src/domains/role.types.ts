// Role related types – aligned with BE api.json DTOs

// === Response DTOs (from BE) ===

// Matches BE RoleResDTO
export interface RoleResDTO {
  name: string;
  is_active: boolean;
}

// === Request DTOs (to BE) ===

// Matches BE RoleReqDTO
export interface RoleReqDTO {
  name: string;
}

// === Aliases for backward compatibility ===
export type Role = RoleResDTO;
export type CreateRoleRequest = RoleReqDTO;
export type UpdateRoleRequest = RoleReqDTO;
