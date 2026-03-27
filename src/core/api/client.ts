import { DataResDTO } from '@/core/types';
import Cookies from 'js-cookie';

export interface ApiError {
  code: number | string;
  message: string;
}

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const GUEST_TOKEN_KEY = 'guest_token';

export class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  private guestToken: string | null = null;

  /** Callback được gọi khi refresh token thất bại — được set bởi AuthProvider */
  onAuthFailure: (() => void) | null = null;

  /** Ngăn chặn việc gọi refresh token nhiều lần cùng lúc */
  private refreshPromise: Promise<string | null> | null = null;

  constructor(
    baseURL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
  ) {
    this.baseURL = baseURL;
    // Lấy token từ localStorage ngay khi khởi tạo
    this.token = localStorage.getItem(TOKEN_KEY);
    this.guestToken = localStorage.getItem(GUEST_TOKEN_KEY);
    if (!this.guestToken) {
      this.setGuestToken(this.generateGuestToken());
    }
  }

  // ── Token management ──────────────────────────────────────────

  setToken(token: string) {
    this.token = token;
    this.authFailed = false; // Reset flag khi có token mới
    localStorage.setItem(TOKEN_KEY, token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return this.token;
  }

  setGuestToken(token: string) {
    this.guestToken = token;
    localStorage.setItem(GUEST_TOKEN_KEY, token);
  }

  getGuestToken(): string | null {
    return this.guestToken || localStorage.getItem(GUEST_TOKEN_KEY);
  }

  clearGuestToken() {
    this.guestToken = null;
    localStorage.removeItem(GUEST_TOKEN_KEY);
  }

  private ensureGuestToken() {
    if (!this.guestToken && !localStorage.getItem(GUEST_TOKEN_KEY)) {
      this.setGuestToken(this.generateGuestToken());
    }
  }

  private generateGuestToken(): string {
    const rand = Math.floor(Math.random() * 1_000_000)
      .toString()
      .padStart(6, '0');
    return `GUEST-${Date.now()}-${rand}`;
  }

  setRefreshToken(refreshToken: string) {
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
      path: '/',
      expires: 7
    });
  }

  getRefreshToken(): string | null {
    return Cookies.get(REFRESH_TOKEN_KEY) || null;
  }

  clearRefreshToken() {
    Cookies.remove(REFRESH_TOKEN_KEY, { path: '/' });
  }

  clearAllTokens() {
    this.clearToken();
    this.clearRefreshToken();
  }

  // ── HTTP helpers ──────────────────────────────────────────────
  private authFailed = false;
  private async request<T>(
    endpoint: string,
    options: RequestInit,
    _isRetry = false
  ): Promise<T> {
    // Luôn lấy token mới nhất từ localStorage hoặc state nội bộ
    const token = this.token || localStorage.getItem(TOKEN_KEY);
    this.ensureGuestToken();
    const guestToken = this.guestToken || localStorage.getItem(GUEST_TOKEN_KEY);
    const isFormData = options.body instanceof FormData;
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(guestToken && { 'X-Guest-Token': guestToken }),
        ...options.headers,
      },
    });

    // ── 401 interceptor: Thử refresh token ───────────────────
    // Đã loại bỏ điều kiện endpoint !== '/auth/me' để cho phép tự động login lại khi reload
    if (
      (response.status === 401 || response.status === 403) &&
      !_isRetry &&
      endpoint !== '/auth/refresh' &&
      endpoint !== '/auth/login'
    ) {
      const refreshed = await this.tryRefreshToken();
      if (refreshed) {
        return this.request<T>(endpoint, options, true);
      }
      // Refresh thất bại — báo cho AuthContext để logout
      if (!this.authFailed) {
        this.authFailed = true;
        this.onAuthFailure?.();
      }
      throw { code: 401, message: 'Session expired' } as ApiError;
    }

    let data: any = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw {
        code: data?.code ?? response.status,
        message: data?.message ?? 'Request failed',
      } as ApiError;
    }

    /**
     * Xử lý dữ liệu trả về linh hoạt:
     * 1. Nếu data có bọc trong field 'items' (DataResDTO), trả về data.items
     * 2. Nếu không (ví dụ /auth/me trả về trực tiếp user), trả về chính data
     */
    const result = (data && typeof data === 'object' && 'items' in data) 
      ? data.items 
      : data;

    return result as T;
  }

  /**
   * Thử làm mới access token bằng refresh token.
   * Sử dụng Promise deduplication để tránh gọi nhiều lần.
   */
  private async tryRefreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = (async () => {
      try {
        const res = await fetch(`${this.baseURL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) {
          this.clearAllTokens();
          return null;
        }

        const data: DataResDTO<{
          token: string;
          refreshToken: string;
        }> = await res.json();

        const newToken = data.items.token;
        this.setToken(newToken);
        this.setRefreshToken(data.items.refreshToken);
        return newToken;
      } catch {
        this.clearAllTokens();
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  // ── Public HTTP methods ───────────────────────────────────────

  get<T>(endpoint: string, params?: Record<string, any>) {
    let url = endpoint;

    if (params) {
      const query = new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== null)
          .map(([k, v]) => [k, String(v)])
      ).toString();
      if (query) url += `?${query}`;
    }

    return this.request<T>(url, { method: 'GET' });
  }

  post<T>(endpoint: string, body?: any) {
    const isFormData = body instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  }

  put<T>(endpoint: string, body?: any) {
    const isFormData = body instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
