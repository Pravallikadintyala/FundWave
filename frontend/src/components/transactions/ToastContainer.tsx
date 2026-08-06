/**
 * ToastContainer — renders the toast notification queue.
 *
 * Toasts slide in from the bottom-right and auto-dismiss after 4s.
 * Each toast has a progress bar animation.
 */

import type { Toast } from '@/hooks/useTransactions';

// ─── Icons ─────────────────────────────────────────────────────────────────────

const SuccessIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="8" fill="var(--color-success)" />
    <path d="M5.5 9l2.5 2.5 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ErrorIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="8" fill="var(--color-danger)" />
    <path d="M6 6l6 6M12 6l-6 6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M11 3L3 11M3 3l8 8" />
  </svg>
);

// ─── Single Toast ───────────────────────────────────────────────────────────────

interface ToastItemProps {
  toast:     Toast;
  onDismiss: (id: string) => void;
}

const ToastItem = ({ toast, onDismiss }: ToastItemProps) => (
  <div
    className={`toast toast--${toast.type}`}
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <span className="toast__icon">
      {toast.type === 'success' ? <SuccessIcon /> : <ErrorIcon />}
    </span>
    <span className="toast__message">{toast.message}</span>
    <button
      type="button"
      className="toast__close"
      onClick={() => onDismiss(toast.id)}
      aria-label="Dismiss notification"
    >
      <CloseIcon />
    </button>
    {/* progress bar */}
    <span className="toast__progress" aria-hidden="true" />
  </div>
);

// ─── Container ─────────────────────────────────────────────────────────────────

interface ToastContainerProps {
  toasts:    Toast[];
  onDismiss: (id: string) => void;
}

const ToastContainer = ({ toasts, onDismiss }: ToastContainerProps) => {
  if (!toasts.length) return null;

  return (
    <div
      className="toast-container"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

export default ToastContainer;
