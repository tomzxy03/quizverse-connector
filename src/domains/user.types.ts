// User related types – aligned with BE api.json DTOs

// === Response DTOs (from BE) ===

// Matches BE UserResDTO
export interface UserResDTO {
  id: number;
  userName: string;
  email: string;
  roles: string[];
  profilePictureUrl?: string;
}

// Matches BE AuthResDTO
export interface AuthResDTO {
  token: string;
  refreshToken: string;
  user: UserResDTO;
  expiresIn: number;
}

// === Request DTOs (to BE) ===

// Matches BE LoginReqDTO
export interface LoginReqDTO {
  email: string;
  password: string;
}

// Matches BE SignupReqDTO
export interface SignupReqDTO {
  email: string;
  password: string;
  userName: string;
  fullName?: string;
}

// Matches BE UserReqDto
export interface UserReqDTO {
  userName: string;
  email: string;
  password: string;
  profilePictureUrl?: string;
  roles?: string[];
}

// Matches BE UserProfileReqDTO
export interface UserProfileReqDTO {
  userName: string;
  email: string;
  profilePictureUrl?: string;
}

// Matches BE RefreshTokenReqDTO
export interface RefreshTokenReqDTO {
  refreshToken: string;
}

// === Aliases for backward compatibility ===
export type User = UserResDTO;
export type AuthResponse = AuthResDTO;
export type LoginRequest = LoginReqDTO;
export type SignUpRequest = SignupReqDTO;
