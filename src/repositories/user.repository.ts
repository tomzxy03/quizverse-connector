// User Repository - Mock implementation

import { User, UserProfile, LoginRequest, SignUpRequest, AuthResponse } from '@/types';

export class UserRepository {
  private mockUsers: User[] = [
    {
      id: 'user1',
      email: 'user@example.com',
      username: 'thichcakhia20',
      fullName: 'Nguyen Van A',
      avatar: 'https://i.pravatar.cc/150?img=1',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01')
    }
  ];

  private currentUser: User | null = null;

  async login(data: LoginRequest): Promise<AuthResponse> {
    // Mock login - In real app, this will call Spring Boot API
    const user = this.mockUsers.find(u => u.email === data.email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    this.currentUser = user;

    return Promise.resolve({
      token: 'mock-jwt-token-' + Date.now(),
      user,
      expiresIn: 3600
    });
  }

  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = this.mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: `user${this.mockUsers.length + 1}`,
      email: data.email,
      username: data.username,
      fullName: data.fullName,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockUsers.push(newUser);
    this.currentUser = newUser;

    return Promise.resolve({
      token: 'mock-jwt-token-' + Date.now(),
      user: newUser,
      expiresIn: 3600
    });
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    return Promise.resolve();
  }

  async getCurrentUser(): Promise<User | null> {
    return Promise.resolve(this.currentUser);
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const user = this.mockUsers.find(u => u.id === userId);
    if (!user) return null;

    return Promise.resolve({
      ...user,
      bio: 'Học sinh đam mê học tập',
      isPublicProfile: true,
      totalQuizzesTaken: 156,
      totalPoints: 15420
    });
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User | null> {
    const index = this.mockUsers.findIndex(u => u.id === userId);
    if (index === -1) return null;

    this.mockUsers[index] = {
      ...this.mockUsers[index],
      ...data,
      updatedAt: new Date()
    };

    if (this.currentUser && this.currentUser.id === userId) {
      this.currentUser = this.mockUsers[index];
    }

    return Promise.resolve(this.mockUsers[index]);
  }

  async getById(id: string): Promise<User | null> {
    const user = this.mockUsers.find(u => u.id === id);
    return Promise.resolve(user || null);
  }
}

export const userRepository = new UserRepository();
