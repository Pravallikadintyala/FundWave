/**
 * authService — thin API layer for all authentication endpoints.
 *
 * Maps one-to-one to backend routes:
 *   POST /auth/signup  → register
 *   POST /auth/login   → login
 *   POST /auth/logout  → logout (protected, sends bearer token)
 *
 * No business logic. No state. Called by AuthContext or auth pages.
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

// ─── Response shapes (raw backend JSON) ────────────────────────────────────────

export interface LoginResponseData {
  message: string;
  token: string;
}

export interface RegisterResponseData {
  message: string;
  username: string;
}

export interface LogoutResponseData {
  message: string;
}

// ─── Service ───────────────────────────────────────────────────────────────────

export const authService = {
  /**
   * POST /auth/login
   * Returns { message, token }.
   */
  login: (payload: LoginPayload) =>
    apiClient.post<LoginResponseData>('/auth/login', payload),

  /**
   * POST /auth/signup
   * Returns { message, username }.
   */
  register: (payload: RegisterPayload) =>
    apiClient.post<RegisterResponseData>('/auth/signup', payload),

  /**
   * POST /auth/logout (protected)
   * Returns { message }.
   */
  logout: () =>
    apiClient.post<LogoutResponseData>('/auth/logout'),

  /**
   * GET /users/me (protected)
   * Returns the authenticated user profile.
   * Used by AuthContext to hydrate state on app load.
   */
  getProfile: () =>
    apiClient.get<{ user: { id: string; username: string; currency: string; timezone: string } }>('/users/me'),
};
