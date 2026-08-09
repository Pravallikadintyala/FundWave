/**
 * authService — thin API layer for all authentication endpoints.
 *
 * Maps one-to-one to backend routes:
 *   POST /auth/signup  → register
 *   POST /auth/login   → login
 *   POST /auth/logout  → logout (protected, sends bearer token)
 *
 * No business logic. No state. Called by AuthContext or auth pages.
 *
 * NOTE: All backend responses are wrapped in { success: true, data: T }.
 * These types reflect the full Axios response body (res.data), including
 * the envelope layer.
 */

import apiClient from '@/api/axiosClient';

// ─── Payload shapes ────────────────────────────────────────────────────────────

export interface LoginPayload {
  /** Backend field name is `username`. Forms may label it "Email / Username". */
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

// ─── Response shapes (raw backend JSON, including the { success, data } envelope) ─

/** Shape of res.data for POST /auth/login */
export interface LoginResponseEnvelope {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      username: string;
      fullName?: string;
      avatar?: string;
      currency: string;
      timezone: string;
    };
  };
}

/** Shape of res.data for POST /auth/signup */
export interface RegisterResponseEnvelope {
  success: boolean;
  data: {
    user: {
      id: string;
      username: string;
    };
  };
}

/** Shape of res.data for POST /auth/logout */
export interface LogoutResponseEnvelope {
  success: boolean;
  data: { message: string };
}

/** Shape of res.data for GET /users/me */
export interface ProfileResponseEnvelope {
  success: boolean;
  data: {
    user: {
      id: string;
      username: string;
      fullName?: string;
      avatar?: string;
      currency: string;
      timezone: string;
    };
  };
}

// ─── Service ───────────────────────────────────────────────────────────────────

export const authService = {
  /**
   * POST /auth/login
   * Backend returns: { success: true, data: { token, user } }
   */
  login: (payload: LoginPayload) =>
    apiClient.post<LoginResponseEnvelope>('/auth/login', payload),

  /**
   * POST /auth/signup
   * Backend returns: { success: true, data: { user } }
   */
  register: (payload: RegisterPayload) =>
    apiClient.post<RegisterResponseEnvelope>('/auth/signup', payload),

  /**
   * POST /auth/logout (protected)
   * Backend returns: { success: true, data: { message } }
   */
  logout: () =>
    apiClient.post<LogoutResponseEnvelope>('/auth/logout'),

  /**
   * GET /users/me (protected)
   * Backend returns: { success: true, data: { user: { ... } } }
   */
  getProfile: () =>
    apiClient.get<ProfileResponseEnvelope>('/users/me'),
};
