/**
 * useSavingsGoals — all state and business logic for the Savings Goals page.
 *
 * Responsibilities:
 *  - Fetch goals on mount (GET /savings-goals) with loading + error state
 *  - Derive the summary statistics shown at the top of the page
 *  - Apply the All / Active / Completed filter
 *  - Expose create / update / delete / contribute mutations
 *  - Load a single goal on demand (GET /savings-goals/:id) for the detail view
 *  - Own modal / dialog open state and the toast queue
 *
 * Components never call the service directly.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  savingsGoalService,
  type CreateSavingsGoalPayload,
  type UpdateSavingsGoalPayload,
} from '@/services/savingsGoalService';
import { useToasts } from '@/hooks/useToasts';
import { extractApiError } from '@/utils/apiError';
import { formatCurrency } from '@/utils/format';
import type { SavingsGoal } from '@/types';

// ─── Public types ──────────────────────────────────────────────────────────────

export type GoalFilter = 'all' | 'Active' | 'Completed';

export interface SavingsGoalsSummary {
  /** Sum of currentAmount across every goal — matches GET /dashboard `savings.totalSaved`. */
  totalSaved: number;
  /** Sum of targetAmount across every goal. */
  totalTargetAmount: number;
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  /** totalSaved / totalTargetAmount as a 0–100 percentage. */
  overallProgressPercent: number;
}

/** Mutations report both the toast-worthy outcome and the message, so forms can show it inline. */
export interface MutationResult {
  success: boolean;
  message?: string;
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export const useSavingsGoals = () => {
  // ── raw data ───────────────────────────────────────────────────────────────
  const [goals, setGoals]         = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);

  // ── filter ─────────────────────────────────────────────────────────────────
  const [filter, setFilter] = useState<GoalFilter>('all');

  // ── modals / dialogs ───────────────────────────────────────────────────────
  const [goalModalOpen, setGoalModalOpen]     = useState(false);
  const [editingGoal, setEditingGoal]         = useState<SavingsGoal | null>(null);
  const [contributingGoal, setContributing]   = useState<SavingsGoal | null>(null);
  const [deletingGoal, setDeletingGoal]       = useState<SavingsGoal | null>(null);
  const [deleteLoading, setDeleteLoading]     = useState(false);

  // ── single-goal detail view ────────────────────────────────────────────────
  const [detailGoal, setDetailGoal]       = useState<SavingsGoal | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError]     = useState<string | null>(null);

  // ── toasts ─────────────────────────────────────────────────────────────────
  const { toasts, pushToast, dismissToast } = useToasts();

  // ── helpers ────────────────────────────────────────────────────────────────

  /** Replace a goal everywhere it is currently rendered. */
  const syncGoal = useCallback((goal: SavingsGoal) => {
    setGoals(prev => prev.map(g => (g.id === goal.id ? goal : g)));
    setDetailGoal(prev => (prev && prev.id === goal.id ? goal : prev));
    setEditingGoal(prev => (prev && prev.id === goal.id ? goal : prev));
    setContributing(prev => (prev && prev.id === goal.id ? goal : prev));
  }, []);

  // ── fetch ──────────────────────────────────────────────────────────────────

  const fetchGoals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await savingsGoalService.getGoals();
      setGoals(res.data.data.goals ?? []);
    } catch (err) {
      setError(extractApiError(err, 'Failed to load your savings goals'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void fetchGoals(); }, [fetchGoals]);

  // ── derived summary ────────────────────────────────────────────────────────

  const summary = useMemo<SavingsGoalsSummary>(() => {
    let totalSaved = 0;
    let totalTargetAmount = 0;
    let activeGoals = 0;
    let completedGoals = 0;

    for (const goal of goals) {
      totalSaved += goal.currentAmount;
      totalTargetAmount += goal.targetAmount;
      if (goal.status === 'Active')    activeGoals += 1;
      if (goal.status === 'Completed') completedGoals += 1;
    }

    return {
      totalSaved,
      totalTargetAmount,
      totalGoals: goals.length,
      activeGoals,
      completedGoals,
      overallProgressPercent:
        totalTargetAmount > 0
          ? Math.min(100, (totalSaved / totalTargetAmount) * 100)
          : 0,
    };
  }, [goals]);

  // ── filtered list ──────────────────────────────────────────────────────────

  const filteredGoals = useMemo(() => {
    if (filter === 'all') return goals;
    return goals.filter(g => g.status === filter);
  }, [goals, filter]);

  // ── mutations ──────────────────────────────────────────────────────────────

  const createGoal = useCallback(
    async (payload: CreateSavingsGoalPayload): Promise<MutationResult> => {
      try {
        const res = await savingsGoalService.createGoal(payload);
        const goal = res.data.data.goal;
        setGoals(prev => [goal, ...prev]);
        pushToast('success', `“${goal.title}” created — time to start saving`);
        return { success: true };
      } catch (err) {
        const message = extractApiError(err, 'Could not create this goal');
        pushToast('error', message);
        return { success: false, message };
      }
    },
    [pushToast],
  );

  const updateGoal = useCallback(
    async (id: string, payload: UpdateSavingsGoalPayload): Promise<MutationResult> => {
      try {
        const res = await savingsGoalService.updateGoal(id, payload);
        const goal = res.data.data.goal;
        syncGoal(goal);
        pushToast('success', `“${goal.title}” updated`);
        return { success: true };
      } catch (err) {
        const message = extractApiError(err, 'Could not update this goal');
        pushToast('error', message);
        return { success: false, message };
      }
    },
    [pushToast, syncGoal],
  );

  const deleteGoal = useCallback(
    async (id: string): Promise<MutationResult> => {
      const backup = goals.find(g => g.id === id);
      setDeleteLoading(true);
      // optimistic removal
      setGoals(prev => prev.filter(g => g.id !== id));
      try {
        await savingsGoalService.deleteGoal(id);
        setDeletingGoal(null);
        setDetailGoal(prev => (prev && prev.id === id ? null : prev));
        pushToast('success', backup ? `“${backup.title}” deleted` : 'Savings goal deleted');
        return { success: true };
      } catch (err) {
        // rollback, preserving list order
        if (backup) {
          setGoals(prev =>
            prev.some(g => g.id === id)
              ? prev
              : [...prev, backup].sort(
                  (a, b) =>
                    new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
                ),
          );
        }
        const message = extractApiError(err, 'Could not delete this goal');
        pushToast('error', message);
        return { success: false, message };
      } finally {
        setDeleteLoading(false);
      }
    },
    [goals, pushToast],
  );

  const contributeToGoal = useCallback(
    async (id: string, amount: number): Promise<MutationResult> => {
      try {
        const res = await savingsGoalService.contribute(id, { amount });
        const goal = res.data.data.goal;
        syncGoal(goal);
        pushToast(
          'success',
          goal.status === 'Completed'
            ? `🎉 ${formatCurrency(amount)} added — “${goal.title}” is fully funded!`
            : `${formatCurrency(amount)} added to “${goal.title}”`,
        );
        return { success: true };
      } catch (err) {
        const message = extractApiError(err, 'Could not add money to this goal');
        pushToast('error', message);
        return { success: false, message };
      }
    },
    [pushToast, syncGoal],
  );

  // ── single goal detail ─────────────────────────────────────────────────────

  /**
   * Shows the goal we already have (instant paint), then refreshes it from
   * GET /savings-goals/:id so the detail view is authoritative.
   */
  const openDetail = useCallback(async (goal: SavingsGoal) => {
    setDetailGoal(goal);
    setDetailError(null);
    setDetailLoading(true);
    try {
      const res = await savingsGoalService.getGoalById(goal.id);
      const fresh = res.data.data.goal;
      setDetailGoal(fresh);
      setGoals(prev => prev.map(g => (g.id === fresh.id ? fresh : g)));
    } catch (err) {
      setDetailError(extractApiError(err, 'Could not refresh this goal'));
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const closeDetail = useCallback(() => {
    setDetailGoal(null);
    setDetailError(null);
  }, []);

  // ── modal helpers ──────────────────────────────────────────────────────────

  const openCreateModal = useCallback(() => {
    setEditingGoal(null);
    setGoalModalOpen(true);
  }, []);

  const openEditModal = useCallback((goal: SavingsGoal) => {
    setEditingGoal(goal);
    setGoalModalOpen(true);
  }, []);

  const closeGoalModal = useCallback(() => {
    setGoalModalOpen(false);
    setEditingGoal(null);
  }, []);

  const openContributeModal  = useCallback((goal: SavingsGoal) => setContributing(goal), []);
  const closeContributeModal = useCallback(() => setContributing(null), []);
  const openDeleteDialog     = useCallback((goal: SavingsGoal) => setDeletingGoal(goal), []);
  const closeDeleteDialog    = useCallback(() => setDeletingGoal(null), []);

  return {
    // data
    goals,
    filteredGoals,
    summary,
    isLoading,
    error,
    refetch: fetchGoals,
    // filter
    filter,
    setFilter,
    // mutations
    createGoal,
    updateGoal,
    deleteGoal,
    contributeToGoal,
    // detail view
    detailGoal,
    detailLoading,
    detailError,
    openDetail,
    closeDetail,
    // modal state
    goalModalOpen,
    editingGoal,
    contributingGoal,
    deletingGoal,
    deleteLoading,
    openCreateModal,
    openEditModal,
    closeGoalModal,
    openContributeModal,
    closeContributeModal,
    openDeleteDialog,
    closeDeleteDialog,
    // toasts
    toasts,
    dismissToast,
  };
};
