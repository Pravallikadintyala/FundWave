/**
 * useAIInsights — fetches AI insights with stale-while-revalidate.
 *
 * - Immediately shows last cached insights from localStorage (no blank screen).
 * - Fetches fresh insights in the background and updates when ready.
 * - isRefreshing = true while fresh data is loading (cached data is still shown).
 */

import { useEffect, useState } from 'react';
import { aiInsightsService } from '@/services/aiInsightsService';
import type { AIInsights } from '@/types';

const CACHE_KEY = 'fw_ai_insights';

interface UseAIInsightsReturn {
  insights: AIInsights | null;
  isLoading: boolean;   // true only when there is NO cached data at all
  isRefreshing: boolean; // true when fetching fresh data (cached data shown)
  error: string | null;
}

export const useAIInsights = (): UseAIInsightsReturn => {
  const getCached = (): AIInsights | null => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      return raw ? (JSON.parse(raw) as AIInsights) : null;
    } catch {
      return null;
    }
  };

  const cached = getCached();
  const [insights, setInsights] = useState<AIInsights | null>(cached);
  const [isLoading, setIsLoading] = useState(cached === null); // only blank if no cache
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsRefreshing(true);
      try {
        const res = await aiInsightsService.getInsights();
        const payload = (res.data as unknown as { success: boolean; data: { insights: AIInsights } });
        const fresh = payload.data.insights;
        if (!cancelled) {
          setInsights(fresh);
          setError(null);
          try { localStorage.setItem(CACHE_KEY, JSON.stringify(fresh)); } catch { /* ignore */ }
        }
      } catch {
        if (!cancelled) setError('Unable to load insights');
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  return { insights, isLoading, isRefreshing, error };
};
