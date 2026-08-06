/**
 * Auth service — API calls for authentication endpoints.
 * No business logic. Called by AuthContext only.
 */

import apiClient from '@/api/axiosClient';
import { ApiResponse, User } from '@/types';

interface LoginPayload {
  username: string;
  password: string;
}

interface RegisterPayload {
  username: string;
  password: string;
}

interface AuthResponseData {
  token: string;
  user: User;
}

interface RegisterResponseData {
  user: User;
}

export const authService = {
  login: (payload: LoginPayload) =>
    apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    apiClient.post<ApiResponse<RegisterResponseData>>('/auth/signup', payload),

  logout: () =>
    apiClient.post<ApiResponse<null>>('/auth/logout'),

  getProfile: () =>
    apiClient.get<ApiResponse<{ user: User }>>('/users/me'),
};
