import { DataResDTO } from '@/core/types';

export interface ApiError {
  code: number | string;
  message: string;
}

export class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(
    baseURL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
  ) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    });

    const data: DataResDTO<T> = await response.json();

    if (!response.ok) {
      throw {
        code: data.code ?? response.status,
        message: data.message ?? 'Request failed',
      } as ApiError;
    }

    if (data.code !== 0) {
      throw {
        code: data.code,
        message: data.message,
      } as ApiError;
    }

    return data.items;
  }

  get<T>(endpoint: string, params?: Record<string, any>) {
    let url = endpoint;

    if (params) {
      const query = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined)
      ).toString();
      if (query) url += `?${query}`;
    }

    return this.request<T>(url, { method: 'GET' });
  }

  post<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
