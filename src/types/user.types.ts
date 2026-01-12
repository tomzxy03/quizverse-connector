// User related types and interfaces

export interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  bio?: string;
  isPublicProfile: boolean;
  totalQuizzesTaken: number;
  totalPoints: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  username: string;
  fullName?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}
