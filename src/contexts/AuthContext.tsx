import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { User } from '@/domains';
import { apiClient } from '@/core/api';
import { userRepository } from '@/repositories';

const USER_STORAGE_KEY = 'quizverse_user';


function loadStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.id && parsed?.username || parsed?.userName) {
      return {
        ...parsed,
        createdAt: parsed.createdAt ? new Date(parsed.createdAt) : new Date(),
        updatedAt: parsed.updatedAt ? new Date(parsed.updatedAt) : new Date(),
      };
    }
  } catch {
    // ignore
  }
  return null;
}

function saveUser(user: User | null) {
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}

type AuthContextValue = {
  user: User | null;
  isLoggedIn: boolean;
  /** true while we're validating the stored token on mount */
  isLoading: boolean;
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => loadStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(() => !!localStorage.getItem('auth_token'));

  const clearAuth = useCallback(() => {
    apiClient.clearAllTokens();
    setUserState(null);
    saveUser(null);
  }, []);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    saveUser(u);
  }, []);

  const login = useCallback(
    (u: User, token: string, refreshToken: string) => {
      apiClient.setToken(token);
      apiClient.setRefreshToken(refreshToken);
      setUserState(u);
      saveUser(u);
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await userRepository.logout();
    } catch {
      // Backend may already be unreachable — that's fine
    }
    clearAuth();
  }, [clearAuth]);

  // Wire up the ApiClient callback so a failed token refresh auto-logs out
  useEffect(() => {
    apiClient.onAuthFailure = () => clearAuth();
    return () => {
      apiClient.onAuthFailure = null;
    };
  }, [clearAuth]);

  // On mount: if we have a stored token, validate it by calling /auth/me
  useEffect(() => {
  const token = localStorage.getItem('auth_token');

  if (!token) {
    setIsLoading(false);
    return;
  }

  apiClient.setToken(token);

  (async () => {
    try {
      const u = await userRepository.getCurrentUser();
      if (u) {
        setUserState(u);
        saveUser(u);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  })();
}, []);

  const value: AuthContextValue = {
    user,
    isLoggedIn: !!user,
    isLoading,
    login,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
