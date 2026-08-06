/**
 * useTransactions — full state management for the Transactions page.
 *
 * Responsibilities:
 *  - Fetch transactions + categories on mount
 *  - Apply client-side search, type filter, category filter, date range, sort
 *  - Expose create / update / delete with optimistic UI + rollback
 *  - Manage toast queue for success / error feedback
 *  - Manage modal / delete-dialog open state
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  transactionService,
  type CreateTransactionPayload,
  type UpdateTransactionPayload,
} from '@/services/transactionService';
import type { Transaction, Category } from '@/types';

// ─── Toast ─────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

// ─── Filters ───────────────────────────────────────────────────────────────────

export type TxTypeFilter = 'all' | 'Income' | 'Expense';
export type SortOption  = 'newest' | 'oldest' | 'highest' | 'lowest';

export interface TxFilters {
  search:    string;
  type:      TxTypeFilter;
  category:  string;          // category id or ''
  startDate: string;
  endDate:   string;
  sort:      SortOption;
}

const DEFAULT_FILTERS: TxFilters = {
  search:    '',
  type:      'all',
  category:  '',
  startDate: '',
  endDate:   '',
  sort:      'newest',
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 10);

const extractError = (err: unknown): string => {
  const e = err as { response?: { data?: { message?: string } }; message?: string };
  return e?.response?.data?.message ?? e?.message ?? 'Something went wrong';
};

const getCategoryId = (cat: string | Category): string =>
  typeof cat === 'string' ? cat : cat.id;

// ─── Hook ──────────────────────────────────────────────────────────────────────

export const useTransactions = () => {
  // ── raw data ──────────────────────────────────────────────────────────────
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories]     = useState<Category[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [error, setError]               = useState<string | null>(null);

  // ── filters ───────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<TxFilters>(DEFAULT_FILTERS);

  // ── pagination ────────────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 15;

  // ── modals ────────────────────────────────────────────────────────────────
  const [modalOpen, setModalOpen]         = useState(false);
  const [editingTx, setEditingTx]         = useState<Transaction | null>(null);
  const [deletingTx, setDeletingTx]       = useState<Transaction | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── toasts ────────────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const pushToast = useCallback((type: ToastType, message: string) => {
    const id = uid();
    setToasts(prev => [...prev, { id, type, message }]);
    const timer = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      toastTimers.current.delete(id);
    }, 4000);
    toastTimers.current.set(id, timer);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    const timer = toastTimers.current.get(id);
    if (timer) { clearTimeout(timer); toastTimers.current.delete(id); }
  }, []);

  // cleanup timers on unmount
  useEffect(() => {
    const timers = toastTimers.current;
    return () => { timers.forEach(clearTimeout); };
  }, []);

  // ── fetch ─────────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [txRes, catRes] = await Promise.all([
        transactionService.getTransactions(),
        transactionService.getCategories(),
      ]);
      const txPayload  = (txRes.data  as unknown as { success: boolean; data: { transactions: Transaction[] } });
      const catPayload = (catRes.data as unknown as { success: boolean; data: { categories: Category[] } });
      setTransactions(txPayload.data.transactions ?? []);
      setCategories(catPayload.data.categories ?? []);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void fetchAll(); }, [fetchAll]);

  // ── filtered + sorted list ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...transactions];

    // type filter
    if (filters.type !== 'all') {
      list = list.filter(t => t.type === filters.type);
    }

    // category filter
    if (filters.category) {
      list = list.filter(t => getCategoryId(t.category) === filters.category);
    }

    // search (description or category name)
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(t => {
        const desc = (t.description ?? '').toLowerCase();
        const cat  = typeof t.category === 'string'
          ? t.category.toLowerCase()
          : (t.category.name ?? '').toLowerCase();
        return desc.includes(q) || cat.includes(q);
      });
    }

    // date range
    if (filters.startDate) {
      const start = new Date(filters.startDate).getTime();
      list = list.filter(t => new Date(t.transactionDate).getTime() >= start);
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate).getTime() + 86_400_000; // inclusive
      list = list.filter(t => new Date(t.transactionDate).getTime() <= end);
    }

    // sort
    list.sort((a, b) => {
      switch (filters.sort) {
        case 'oldest':  return new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime();
        case 'highest': return b.amount - a.amount;
        case 'lowest':  return a.amount - b.amount;
        case 'newest':
        default:        return new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime();
      }
    });

    return list;
  }, [transactions, filters]);

  // ── pagination slice ───────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // reset page on filter change
  useEffect(() => { setCurrentPage(1); }, [filters]);

  // ── filter helpers ─────────────────────────────────────────────────────────
  const updateFilter = useCallback(<K extends keyof TxFilters>(key: K, value: TxFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const hasActiveFilters =
    filters.type !== 'all' ||
    filters.category !== '' ||
    filters.startDate !== '' ||
    filters.endDate !== '' ||
    filters.search !== '' ||
    filters.sort !== 'newest';

  // ── CRUD ───────────────────────────────────────────────────────────────────

  const createTransaction = useCallback(async (payload: CreateTransactionPayload): Promise<boolean> => {
    try {
      const res = await transactionService.createTransaction(payload);
      const data = (res.data as unknown as { success: boolean; data: { transaction: Transaction } });
      setTransactions(prev => [data.data.transaction, ...prev]);
      pushToast('success', 'Transaction added successfully');
      return true;
    } catch (err) {
      pushToast('error', extractError(err));
      return false;
    }
  }, [pushToast]);

  const updateTransaction = useCallback(async (id: string, payload: UpdateTransactionPayload): Promise<boolean> => {
    // optimistic update
    const prev = transactions.find(t => t.id === id);
    setTransactions(list => list.map(t => t.id === id ? { ...t, ...payload } : t));
    try {
      const res = await transactionService.updateTransaction(id, payload);
      const data = (res.data as unknown as { success: boolean; data: { transaction: Transaction } });
      setTransactions(list => list.map(t => t.id === id ? data.data.transaction : t));
      pushToast('success', 'Transaction updated');
      return true;
    } catch (err) {
      // rollback
      if (prev) setTransactions(list => list.map(t => t.id === id ? prev : t));
      pushToast('error', extractError(err));
      return false;
    }
  }, [transactions, pushToast]);

  const deleteTransaction = useCallback(async (id: string): Promise<boolean> => {
    setDeleteLoading(true);
    // optimistic remove
    const backup = transactions.find(t => t.id === id);
    setTransactions(prev => prev.filter(t => t.id !== id));
    try {
      await transactionService.deleteTransaction(id);
      pushToast('success', 'Transaction deleted');
      setDeletingTx(null);
      return true;
    } catch (err) {
      // rollback
      if (backup) setTransactions(prev => [...prev, backup]);
      pushToast('error', extractError(err));
      return false;
    } finally {
      setDeleteLoading(false);
    }
  }, [transactions, pushToast]);

  // ── modal helpers ──────────────────────────────────────────────────────────
  const openCreateModal = useCallback(() => { setEditingTx(null); setModalOpen(true); }, []);
  const openEditModal   = useCallback((tx: Transaction) => { setEditingTx(tx); setModalOpen(true); }, []);
  const closeModal      = useCallback(() => { setModalOpen(false); setEditingTx(null); }, []);
  const openDeleteDialog  = useCallback((tx: Transaction) => setDeletingTx(tx), []);
  const closeDeleteDialog = useCallback(() => setDeletingTx(null), []);

  return {
    // data
    transactions,
    categories,
    isLoading,
    error,
    refetch: fetchAll,
    // filtered & paginated
    filtered,
    paginated,
    currentPage,
    setCurrentPage,
    totalPages,
    // filters
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    // CRUD
    createTransaction,
    updateTransaction,
    deleteTransaction,
    // modal state
    modalOpen,
    editingTx,
    deletingTx,
    deleteLoading,
    openCreateModal,
    openEditModal,
    closeModal,
    openDeleteDialog,
    closeDeleteDialog,
    // toasts
    toasts,
    dismissToast,
  };
};
