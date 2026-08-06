/**
 * AuthContext — application-wide authentication state.
 *
 * Responsibilities:
 *  - Store authenticated user and JWT token
 *  - Persist token + user in localStorage
 *  - Expose login(), logout(), checkAuth()
 *  - Hydrate state on app load via checkAuth()
 */

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authService } from '@/services/authService';
import type { AuthState, User } from '@/types';

const TOKEN_KEY = 'fundwave_token';
const USER_KEY = 'fundwave_user';

// ─── Context shape ────────────────────────────────────────────────────────────

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Persist helpers ─────────────────────────────────────────────────────────

  const persist = (newToken: string, newUser: User) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const clear = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  // ── checkAuth — verify stored token is still valid ──────────────────────────

  const checkAuth = useCallback(async () => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await authService.getProfile();
      const freshUser = res.data.data.user;
      persist(storedToken, freshUser);
    } catch {
      // Token expired or invalid — clear everything
      clear();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Hydrate on mount ─────────────────────────────────────────────────────────

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  // ── login ────────────────────────────────────────────────────────────────────

  const login = useCallback(async (username: string, password: string) => {
    const res = await authService.login({ username, password });
    const { token: newToken, user: newUser } = res.data.data;
    persist(newToken, newUser);
  }, []);

  // ── logout ───────────────────────────────────────────────────────────────────

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Proceed with local clear even if server call fails
    } finally {
      clear();
    }
  }, []);

  // ── Context value ─────────────────────────────────────────────────────────────

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      logout,
      checkAuth,
    }),
    [user, token, isLoading, login, logout, checkAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
