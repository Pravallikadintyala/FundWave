/**
 * authService — thin API layer for all authentication endpoints.
 */

import apiClient from '@/api/axiosClient';

// ─── Payload shapes ────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

// Removed payload types since arguments will be passed directly

export interface UpdateProfilePayload {
  fullName?: string;
  avatar?: string;
  currency?: string;
  timezone?: string;
}

// ─── Response shapes ───────────────────────────────────────────────────────────

export interface LoginResponseEnvelope {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      fullName?: string;
      avatar?: string;
      currency: string;
      timezone: string;
    };
  };
}

export interface RegisterResponseEnvelope {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
    };
  };
}

export interface LogoutResponseEnvelope {
  success: boolean;
  data: { message: string };
}

export interface GenericResponseEnvelope {
  success: boolean;
  data: { message: string };
}

export interface ProfileResponseEnvelope {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      fullName?: string;
      avatar?: string;
      currency: string;
      timezone: string;
    };
  };
}

// ─── Service ───────────────────────────────────────────────────────────────────

export const authService = {
  login: (payload: LoginPayload) =>
    apiClient.post<LoginResponseEnvelope>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    apiClient.post<RegisterResponseEnvelope>('/auth/signup', payload),

  logout: () =>
    apiClient.post<LogoutResponseEnvelope>('/auth/logout'),

  forgotPassword: (email: string) =>
    apiClient.post<GenericResponseEnvelope>('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string, confirmPassword: string) =>
    apiClient.post<GenericResponseEnvelope>('/auth/reset-password', { token, newPassword: password, confirmPassword }),

  getProfile: () =>
    apiClient.get<ProfileResponseEnvelope>('/users/me'),

  updateProfile: (payload: UpdateProfilePayload) =>
    apiClient.put<ProfileResponseEnvelope>('/users/me', payload),
};
