/**
 * useAIInsights — fetches AI insights lazily.
 *
 * Starts loading immediately on mount.
 * Returns { insights, isLoading, error }
 */

import { useEffect, useState } from 'react';
import { aiInsightsService } from '@/services/aiInsightsService';
import type { AIInsights } from '@/types';

interface UseAIInsightsReturn {
  insights: AIInsights | null;
  isLoading: boolean;
  error: string | null;
}

export const useAIInsights = (): UseAIInsightsReturn => {
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await aiInsightsService.getInsights();
        const payload = (res.data as unknown as { success: boolean; data: { insights: AIInsights } });
        if (!cancelled) setInsights(payload.data.insights);
      } catch {
        if (!cancelled) setError('Unable to load insights');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  return { insights, isLoading, error };
};
