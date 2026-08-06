/**
 * useDashboard — fetches the dashboard payload once on mount.
 *
 * Returns { data, isLoading, error, refetch }
 */

import { useCallback, useEffect, useState } from 'react';
import { dashboardService } from '@/services/dashboardService';
import type { DashboardData } from '@/types';

interface UseDashboardReturn {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDashboard = (): UseDashboardReturn => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await dashboardService.getDashboard();
      // Backend wraps data in { success, data }
      const payload = (res.data as unknown as { success: boolean; data: DashboardData });
      setData(payload.data);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to load dashboard data';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
};
