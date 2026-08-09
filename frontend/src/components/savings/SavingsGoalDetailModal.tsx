/**
 * SavingsGoalDetailModal — the single-goal view (GET /savings-goals/:id).
 *
 * Opened from a card; the goal we already have is painted immediately while the
 * hook refreshes it from the server, so the modal never shows a blank frame.
 * Adds the derived pace guidance ("save ₹X/month to stay on track") that only
 * makes sense with the full goal in front of you.
 */

import type { CSSProperties } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { accentForGoal, DEFAULT_GOAL_ICON } from '@/components/savings/goalPresets';
import {
  formatCurrency,
  formatDate,
  daysUntil,
  formatRelativeDays,
} from '@/utils/format';
import type { SavingsGoal } from '@/types';

// ─── Progress ring ─────────────────────────────────────────────────────────────

const ProgressRing = ({ percent }: { percent: number }) => {
  const size = 108;
  const stroke = 9;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

  return (
    <div className="sg-detail__ring">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--goal-accent)"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 700ms cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="sg-detail__ring-label">
        <span className="sg-detail__ring-value">{percent.toFixed(percent % 1 === 0 ? 0 : 1)}%</span>
        <span className="sg-detail__ring-caption">complete</span>
      </div>
    </div>
  );
};

// ─── Pace guidance ─────────────────────────────────────────────────────────────

const paceHint = (goal: SavingsGoal): string | null => {
  if (goal.status !== 'Active' || goal.remainingAmount <= 0) return null;
  if (!goal.targetDate) {
    return `${formatCurrency(goal.remainingAmount)} left — add money whenever you can to close the gap.`;
  }

  const days = daysUntil(goal.targetDate);
  if (days < 0) {
    return `This target date has passed with ${formatCurrency(goal.remainingAmount)} still to go — consider moving the date or lowering the target.`;
  }
  if (days === 0) {
    return `Today is the target date and ${formatCurrency(goal.remainingAmount)} is still remaining.`;
  }
  if (days < 30) {
    return `${formatCurrency(goal.remainingAmount)} to go in ${days} day${days === 1 ? '' : 's'} — about ${formatCurrency(Math.ceil(goal.remainingAmount / days))} per day.`;
  }

  const months = Math.max(1, Math.round(days / 30));
  return `Save about ${formatCurrency(Math.ceil(goal.remainingAmount / months))} per month to reach this by ${formatDate(goal.targetDate)}.`;
};

// ─── Component ─────────────────────────────────────────────────────────────────

interface SavingsGoalDetailModalProps {
  open:         boolean;
  goal:         SavingsGoal | null;
  loading:      boolean;
  error:        string | null;
  onClose:      () => void;
  onEdit:       (goal: SavingsGoal) => void;
  onDelete:     (goal: SavingsGoal) => void;
  onContribute: (goal: SavingsGoal) => void;
}

const SavingsGoalDetailModal = ({
  open,
  goal,
  loading,
  error,
  onClose,
  onEdit,
  onDelete,
  onContribute,
}: SavingsGoalDetailModalProps) => {
  if (!goal) return null;

  const isActive = goal.status === 'Active';
  const style = { '--goal-accent': accentForGoal(goal) } as CSSProperties;
  const hint = paceHint(goal);

  return (
    <Modal open={open} onClose={onClose} title="Goal details" size="md">
      <div className="sg-detail" style={style}>
        {error && <p className="sg-form-banner" role="alert">{error}</p>}

        {/* ── Identity ─────────────────────────────────────────────────────── */}
        <header className="sg-detail__header">
          <span className="sg-detail__icon" aria-hidden="true">{goal.icon || DEFAULT_GOAL_ICON}</span>
          <div className="sg-detail__heading">
            <h3 className="sg-detail__title">{goal.title}</h3>
            <div className="sg-detail__badges">
              {goal.status === 'Completed' ? (
                <Badge variant="success" size="sm" dot>Completed</Badge>
              ) : goal.status === 'Archived' ? (
                <Badge variant="neutral" size="sm" dot>Archived</Badge>
              ) : (
                <Badge variant="primary" size="sm" dot>Active</Badge>
              )}
              {loading && <span className="sg-detail__refreshing">Refreshing…</span>}
            </div>
          </div>
        </header>

        {/* ── Progress ─────────────────────────────────────────────────────── */}
        <div className="sg-detail__progress">
          <ProgressRing percent={goal.progressPercent} />
          <div className="sg-detail__progress-text">
            <p className="sg-detail__amounts">
              {formatCurrency(goal.currentAmount)}
              <span> / {formatCurrency(goal.targetAmount)}</span>
            </p>
            <p className="sg-detail__remaining">
              {goal.remainingAmount > 0
                ? `${formatCurrency(goal.remainingAmount)} remaining`
                : 'Target fully funded'}
            </p>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${Math.min(100, goal.progressPercent)}%` }} />
            </div>
          </div>
        </div>

        {/* ── Facts ────────────────────────────────────────────────────────── */}
        <dl className="sg-detail__facts">
          <div className="sg-detail__fact">
            <dt>Target amount</dt>
            <dd>{formatCurrency(goal.targetAmount)}</dd>
          </div>
          <div className="sg-detail__fact">
            <dt>Saved so far</dt>
            <dd>{formatCurrency(goal.currentAmount)}</dd>
          </div>
          <div className="sg-detail__fact">
            <dt>Remaining</dt>
            <dd>{formatCurrency(goal.remainingAmount)}</dd>
          </div>
          <div className="sg-detail__fact">
            <dt>Target date</dt>
            <dd>
              {goal.targetDate ? formatDate(goal.targetDate) : 'Not set'}
              {goal.targetDate && isActive && (
                <span className="sg-detail__fact-sub">
                  {formatRelativeDays(daysUntil(goal.targetDate))}
                </span>
              )}
            </dd>
          </div>
          <div className="sg-detail__fact">
            <dt>Created</dt>
            <dd>{goal.createdAt ? formatDate(goal.createdAt) : '—'}</dd>
          </div>
          <div className="sg-detail__fact">
            <dt>Last updated</dt>
            <dd>{goal.updatedAt ? formatDate(goal.updatedAt) : '—'}</dd>
          </div>
        </dl>

        {/* ── Pace guidance ────────────────────────────────────────────────── */}
        {hint && <p className="sg-detail__hint">{hint}</p>}

        {/* ── Actions ──────────────────────────────────────────────────────── */}
        <div className="sg-detail__actions">
          <Button variant="ghost" onClick={() => onDelete(goal)}>Delete</Button>
          <Button variant="outline" onClick={() => onEdit(goal)}>Edit goal</Button>
          {isActive && (
            <Button variant="primary" onClick={() => onContribute(goal)}>Add Money</Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SavingsGoalDetailModal;
