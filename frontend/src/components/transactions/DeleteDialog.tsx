/**
 * DeleteDialog — confirmation dialog with soft animation before deleting.
 *
 * Shows the transaction description + amount so the user knows exactly
 * what they are about to delete.
 */

import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import type { Transaction, Category } from '@/types';

// ─── Helpers ───────────────────────────────────────────────────────────────────

const fmtAmount = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const getCategoryName = (cat: string | Category): string =>
  typeof cat === 'string' ? cat : cat.name;

// ─── Icon ──────────────────────────────────────────────────────────────────────

const WarningIcon = () => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 44 44"
    fill="none"
    aria-hidden="true"
    className="delete-dialog__icon-svg"
  >
    <circle cx="22" cy="22" r="20" fill="var(--color-danger-muted)" />
    <path d="M22 13v12" stroke="var(--color-danger)" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="22" cy="30" r="2" fill="var(--color-danger)" />
  </svg>
);

// ─── Component ─────────────────────────────────────────────────────────────────

interface DeleteDialogProps {
  open:       boolean;
  onClose:    () => void;
  onConfirm:  () => void;
  loading:    boolean;
  tx:         Transaction | null;
}

const DeleteDialog = ({ open, onClose, onConfirm, loading, tx }: DeleteDialogProps) => {
  if (!tx) return null;

  const catName    = getCategoryName(tx.category);
  const label      = tx.description ?? catName;
  const isIncome   = tx.type === 'Income';

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="delete-dialog">
        <div className="delete-dialog__icon">
          <WarningIcon />
        </div>

        <div className="delete-dialog__body">
          <h2 className="delete-dialog__title">Delete transaction?</h2>
          <p className="delete-dialog__desc">
            You are about to permanently delete:
          </p>

          <div className="delete-dialog__tx-preview">
            <span className="delete-dialog__tx-label">{label}</span>
            <span className={`delete-dialog__tx-amount ${isIncome ? 'delete-dialog__tx-amount--income' : 'delete-dialog__tx-amount--expense'}`}>
              {isIncome ? '+' : '−'}{fmtAmount(tx.amount)}
            </span>
          </div>

          <p className="delete-dialog__warning">This action cannot be undone.</p>
        </div>

        <div className="delete-dialog__actions">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteDialog;
