/**
 * useToasts — reusable toast queue (push / auto-dismiss / manual dismiss).
 *
 * Extracted so any feature can drive the existing ToastContainer component.
 * The Toast shape is re-exported from useTransactions, which already owns the
 * canonical type consumed by ToastContainer — no duplicate definitions.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Toast, ToastType } from '@/hooks/useTransactions';

export type { Toast, ToastType };

const AUTO_DISMISS_MS = 4000; // matches the toast progress-bar animation

const uid = (): string => Math.random().toString(36).slice(2, 10);

interface UseToastsReturn {
  toasts: Toast[];
  pushToast: (type: ToastType, message: string) => void;
  dismissToast: (id: string) => void;
}

export const useToasts = (): UseToastsReturn => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const pushToast = useCallback((type: ToastType, message: string) => {
    const id = uid();
    setToasts(prev => [...prev, { id, type, message }]);
    const timer = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      timers.current.delete(id);
    }, AUTO_DISMISS_MS);
    timers.current.set(id, timer);
  }, []);

  // Clear pending timers on unmount
  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);

  return { toasts, pushToast, dismissToast };
};
