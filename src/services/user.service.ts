import { userRepository } from '@/repositories';
import { UserResDTO, UserProfileReqDTO, LoginReqDTO, SignupReqDTO, AuthResDTO, RefreshTokenReqDTO } from '@/domains';

export class UserService {
  async login(data: LoginReqDTO): Promise<AuthResDTO> {
    if (!data.email || !this.isValidEmail(data.email)) {
      throw new Error('Invalid email address');
    }
    if (!data.password || data.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    return await userRepository.login(data);
  }

  async signUp(data: SignupReqDTO): Promise<AuthResDTO> {
    if (!data.email || !this.isValidEmail(data.email)) {
      throw new Error('Invalid email address');
    }
    if (!data.password || data.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    if (!data.userName || data.userName.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(data.userName)) {
      throw new Error('Username can only contain letters, numbers, and underscores');
    }
    return await userRepository.signUp(data);
  }

  async logout(data: RefreshTokenReqDTO): Promise<void> {
    return await userRepository.logout(data);
  }

  async refreshToken(data: RefreshTokenReqDTO): Promise<AuthResDTO> {
    return await userRepository.refreshToken(data);
  }

  async getCurrentUser(): Promise<UserResDTO> {
    return await userRepository.getCurrentUser();
  }

  async getUserById(id: number): Promise<UserResDTO> {
    return await userRepository.getById(id);
  }

  async updateProfile(id: number, data: UserProfileReqDTO): Promise<UserResDTO> {
    if (data.email && !this.isValidEmail(data.email)) {
      throw new Error('Invalid email address');
    }
    if (data.userName) {
      if (data.userName.length < 3) {
        throw new Error('Username must be at least 3 characters');
      }
      if (!/^[a-zA-Z0-9_]+$/.test(data.userName)) {
        throw new Error('Username can only contain letters, numbers, and underscores');
      }
    }
    return await userRepository.updateProfile(id, data);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch {
      return false;
    }
  }
}

export const userService = new UserService();
