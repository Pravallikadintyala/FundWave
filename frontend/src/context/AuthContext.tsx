/**
 * AuthContext — application-wide authentication state.
 *
 * Responsibilities:
 *  - Store authenticated user and JWT token
 *  - Persist token + user in localStorage
 *  - Expose login(), register(), logout(), checkAuth()
 *  - Hydrate state on app load via checkAuth()
 *
 * NOTE: The backend login endpoint returns { token, message } directly
 * (not wrapped in a data envelope). The user object is derived from the
 * JWT token claims (id, username) and supplemented with defaults.
 */

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authService, type LoginPayload, type RegisterPayload } from '@/services/authService';
import type { AuthState, User } from '@/types';

const TOKEN_KEY = 'fundwave_token';
const USER_KEY  = 'fundwave_user';

// ─── Context shape ─────────────────────────────────────────────────────────────

interface AuthContextValue extends AuthState {
  login:          (payload: LoginPayload) => Promise<void>;
  register:       (payload: RegisterPayload) => Promise<void>;
  logout:         () => Promise<void>;
  checkAuth:      () => Promise<void>;
  loginWithToken: (token: string) => Promise<void>;
  updateUser:     (newUser: User) => void;
}

// ─── Context ───────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────────

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser]         = useState<User | null>(null);
  const [token, setToken]       = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Persist helpers ──────────────────────────────────────────────────────────

  const persist = (newToken: string, newUser: User) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY,  JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const clear = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  // ── checkAuth — hydrate from localStorage ────────────────────────────────────

  const checkAuth = useCallback(async () => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser  = localStorage.getItem(USER_KEY);

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    // If we have a cached user, hydrate immediately without an API round-trip.
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as User;
        persist(storedToken, parsed);
        setIsLoading(false);
        return;
      } catch {
        /* JSON parse failed — fall through to API verification */
      }
    }

    // Fallback: verify via /users/me
    // Backend returns: { success: true, data: { user: { id, username, ... } } }
    try {
      const res       = await authService.getProfile();
      // res.data is the full envelope: { success, data: { user } }
      const freshUser = res.data.data.user;
      persist(storedToken, {
        id:       freshUser.id,
        email:    freshUser.email,
        currency: freshUser.currency ?? 'USD',
        timezone: freshUser.timezone ?? 'UTC',
      });
    } catch {
      clear();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Hydrate on mount ─────────────────────────────────────────────────────────

  useEffect(() => {
    void checkAuth();
  }, []);

  // ── login ────────────────────────────────────────────────────────────────────

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await authService.login(payload);
    // Backend wraps response in { success: true, data: { token, user } }
    // res.data is the full envelope, so the token is at res.data.data.token
    const { token: newToken, user: loginUser } = res.data.data;

    // Build the User object from the login response (avoids a /users/me round-trip)
    const newUser: User = {
      id:       loginUser.id,
      email:    loginUser.email,
      fullName: loginUser.fullName,
      avatar:   loginUser.avatar,
      currency: loginUser.currency ?? 'USD',
      timezone: loginUser.timezone ?? 'UTC',
    };

    persist(newToken, newUser);
  }, []);

  // ── loginWithToken — for OAuth callbacks ─────────────────────────────────────

  /**
   * Accepts a raw JWT (e.g. from an OAuth redirect URL), fetches the user
   * profile from /users/me to validate it, then calls persist() to update
   * both localStorage and React state atomically.
   *
   * This is intentionally separate from checkAuth() to avoid the cached-user
   * early-return that would skip profile validation for a brand-new token.
   */
  const loginWithToken = useCallback(async (rawToken: string): Promise<void> => {
    // Temporarily write the token so axiosClient can read it for the /users/me call
    localStorage.setItem(TOKEN_KEY, rawToken);
    localStorage.removeItem(USER_KEY);

    try {
      const res       = await authService.getProfile();
      const freshUser = res.data.data.user;
      persist(rawToken, {
        id:       freshUser.id,
        email:    freshUser.email,
        fullName: freshUser.fullName,
        avatar:   freshUser.avatar,
        currency: freshUser.currency ?? 'USD',
        timezone: freshUser.timezone ?? 'UTC',
      });
    } catch {
      // Token was invalid — clean up and surface the error to the caller
      clear();
      throw new Error('Invalid token received from OAuth provider');
    }
  }, []);

  // ── register ─────────────────────────────────────────────────────────────────

  const register = useCallback(async (payload: RegisterPayload) => {
    // POST /auth/signup — returns { message, username }
    // Does NOT return a token; user must login after registering.
    await authService.register(payload);
  }, []);

  // ── logout ───────────────────────────────────────────────────────────────────

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      /* Server-side token blacklisting may fail; still clear locally */
    } finally {
      clear();
    }
  }, []);

  // ── updateUser ───────────────────────────────────────────────────────────────
  
  const updateUser = useCallback((newUser: User) => {
    if (token) {
      persist(token, newUser);
    }
  }, [token]);

  // ── Context value ─────────────────────────────────────────────────────────────

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      register,
      logout,
      checkAuth,
      loginWithToken,
      updateUser,
    }),
    [user, token, isLoading, login, register, logout, checkAuth, loginWithToken, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
