/**
 * DeleteGoalDialog — confirmation before a permanent delete.
 *
 * Shows exactly what is about to disappear (title, saved amount, progress) and
 * states plainly that the action cannot be undone. Nothing is deleted until the
 * user confirms.
 */

import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/utils/format';
import type { SavingsGoal } from '@/types';

const WarningIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
    <circle cx="22" cy="22" r="20" fill="var(--color-danger-muted)" />
    <path d="M22 13v12" stroke="var(--color-danger)" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="22" cy="30" r="2" fill="var(--color-danger)" />
  </svg>
);

interface DeleteGoalDialogProps {
  open:      boolean;
  goal:      SavingsGoal | null;
  loading:   boolean;
  onClose:   () => void;
  onConfirm: () => void;
}

const DeleteGoalDialog = ({ open, goal, loading, onClose, onConfirm }: DeleteGoalDialogProps) => {
  if (!goal) return null;

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="delete-dialog">
        <div className="delete-dialog__icon">
          <WarningIcon />
        </div>

        <div className="delete-dialog__body">
          <h2 className="delete-dialog__title">Delete this savings goal?</h2>
          <p className="delete-dialog__desc">You are about to permanently delete:</p>

          <div className="delete-dialog__tx-preview">
            <span className="delete-dialog__tx-label">
              {goal.icon ? `${goal.icon} ` : ''}{goal.title}
            </span>
            <span className="delete-dialog__tx-amount">
              {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
            </span>
          </div>

          <p className="delete-dialog__desc">
            The goal and the {goal.progressPercent.toFixed(0)}% progress recorded against it will be
            removed from your account.
          </p>

          <p className="delete-dialog__warning">
            This action cannot be undone.
          </p>
        </div>

        <div className="delete-dialog__actions">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            Delete goal
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteGoalDialog;
