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

const USER_STORAGE_KEY = 'quizverse_user';

function loadStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.id && parsed?.username) {
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
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => loadStoredUser());

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    saveUser(u);
  }, []);

  const login = useCallback(
    (u: User, token: string) => {
      apiClient.setToken(token);
      setUserState(u);
      saveUser(u);
    },
    []
  );

  const logout = useCallback(() => {
    apiClient.clearToken();
    setUserState(null);
    saveUser(null);
  }, []);

  useEffect(() => {
    if (!user && localStorage.getItem('auth_token')) {
      const stored = loadStoredUser();
      if (stored) setUserState(stored);
    }
  }, [user]);

  const value: AuthContextValue = {
    user,
    isLoggedIn: !!user,
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
