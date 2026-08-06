/**
 * dashboardService — thin wrapper around GET /api/dashboard.
 */

import { apiClient } from '@/api/axiosClient';
import type { ApiResponse, DashboardData } from '@/types';

export const dashboardService = {
  getDashboard: () =>
    apiClient.get<ApiResponse<DashboardData>>('/dashboard'),
};
