// User Service - Business logic layer

import { userRepository } from '@/repositories';
import { User, UserProfile, LoginRequest, SignUpRequest, AuthResponse } from '@/domains';

export class UserService {
  async login(data: LoginRequest): Promise<AuthResponse> {
    // Validate email
    if (!data.email || !this.isValidEmail(data.email)) {
      throw new Error('Invalid email address');
    }

    // Validate password
    if (!data.password || data.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    return await userRepository.login(data);
  }

  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    // Validate email
    if (!data.email || !this.isValidEmail(data.email)) {
      throw new Error('Invalid email address');
    }

    // Validate password
    if (!data.password || data.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Validate username
    if (!data.username || data.username.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }

    if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
      throw new Error('Username can only contain letters, numbers, and underscores');
    }

    return await userRepository.signUp(data);
  }

  async logout(): Promise<void> {
    return await userRepository.logout();
  }

  async getCurrentUser(): Promise<User | null> {
    return await userRepository.getCurrentUser();
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return await userRepository.getUserProfile(userId);
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User | null> {
    // Validate email if provided
    if (data.email && !this.isValidEmail(data.email)) {
      throw new Error('Invalid email address');
    }

    // Validate username if provided
    if (data.username) {
      if (data.username.length < 3) {
        throw new Error('Username must be at least 3 characters');
      }
      if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
        throw new Error('Username can only contain letters, numbers, and underscores');
      }
    }

    return await userRepository.updateProfile(userId, data);
  }

  async getUserById(id: string): Promise<User | null> {
    return await userRepository.getById(id);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }
}

export const userService = new UserService();
