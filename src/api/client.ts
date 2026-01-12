

import { ApiResponse, ApiError } from '@/types';

export class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api') {
    this.baseURL = baseURL;
    // Load token from localStorage if exists
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      this.token = storedToken;
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          code: String(response.status),
          message: data.message || 'An error occurred',
          details: data.details,
        };
        throw error;
      }

      // Handle Spring Boot response format
      // Spring Boot might return data directly or wrapped in ApiResponse
      if (data.success !== undefined) {
        const apiResponse = data as ApiResponse<T>;
        if (!apiResponse.success) {
          throw apiResponse.error || { code: 'UNKNOWN', message: 'An error occurred' };
        }
        return apiResponse.data as T;
      }

      return data as T;
    } catch (error) {
      if (error instanceof TypeError) {
        // Network error
        throw {
          code: 'NETWORK_ERROR',
          message: 'Network error. Please check your connection.',
        } as ApiError;
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint;
    if (params) {
      const queryString = new URLSearchParams(
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== null)
          .map(([k, v]) => [k, String(v)])
      ).toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return this.request<T>(url, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {};

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          code: String(response.status),
          message: data.message || 'Upload failed',
          details: data.details,
        };
        throw error;
      }

      return data as T;
    } catch (error) {
      if (error instanceof TypeError) {
        throw {
          code: 'NETWORK_ERROR',
          message: 'Network error. Please check your connection.',
        } as ApiError;
      }
      throw error;
    }
  }
}

// Singleton instance
export const apiClient = new ApiClient();
