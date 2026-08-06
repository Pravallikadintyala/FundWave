/**
 * useAIInsights — fetches AI insights lazily.
 *
 * Starts loading immediately on mount.
 * Returns { insights, isLoading, error }
 */

import { useEffect, useState } from 'react';
import { aiService } from '@/services/aiService';
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
        const res = await aiService.getInsights();
        const payload = (res.data as unknown as { success: boolean; data: AIInsights });
        if (!cancelled) setInsights(payload.data);
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
