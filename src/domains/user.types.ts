



export interface UserResDTO {
  id: number;
  userName: string;
  email: string;
  roles: string[];
  profilePictureUrl?: string;
}


export interface AuthResDTO {
  token: string;
  refreshToken: string;
  user: UserResDTO;
  expiresIn: number;
}

export interface LoginReqDTO {
  email: string;
  password: string;
}

export interface SignupReqDTO {
  email: string;
  password: string;
  userName: string;
  fullName?: string;
}

export interface UserReqDTO {
  userName: string;
  email: string;
  password: string;
  profilePictureUrl?: string;
  roles?: string[];
}

export interface UserProfileReqDTO {
  userName: string;
  email: string;
  profilePictureUrl?: string;
}

export interface RefreshTokenReqDTO {
  refreshToken: string;
}

export type User = UserResDTO;
export type AuthResponse = AuthResDTO;
export type LoginRequest = LoginReqDTO;
export type SignUpRequest = SignupReqDTO;
