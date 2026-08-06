/**
 * aiService — wrapper around GET /api/ai/insights.
 */

import { apiClient } from '@/api/axiosClient';
import type { ApiResponse, AIInsights } from '@/types';

export const aiService = {
  getInsights: () =>
    apiClient.get<ApiResponse<AIInsights>>('/ai/insights'),
};
