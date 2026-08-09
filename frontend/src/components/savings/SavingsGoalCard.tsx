/**
 * SavingsGoalCard — one savings goal, progress-first.
 *
 * Visual hierarchy: icon + title → saved / target → progress bar →
 * percentage + remaining → target date → actions.
 *
 * Completed goals get a distinct emerald treatment, a check ribbon and lose the
 * "Add Money" action (the backend rejects contributions to completed goals).
 *
 * The goal's colour drives the whole card through the `--goal-accent` custom
 * property, so no per-element inline styling is needed.
 */

import type { CSSProperties } from 'react';
import Badge from '@/components/ui/Badge';
import { accentForGoal, DEFAULT_GOAL_ICON } from '@/components/savings/goalPresets';
import { formatCurrency, formatDate, daysUntil, formatRelativeDays } from '@/utils/format';
import type { SavingsGoal } from '@/types';

// ─── Icons ─────────────────────────────────────────────────────────────────────

const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <path d="M8 3v10M3 8h10" />
  </svg>
);

const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1.5 9S4.5 3.75 9 3.75 16.5 9 16.5 9 13.5 14.25 9 14.25 1.5 9 1.5 9z" />
    <circle cx="9" cy="9" r="2.25" />
  </svg>
);

const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12.4 2.6a1.7 1.7 0 012.4 2.4L5.8 14H3v-2.8l9.4-8.6z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3.5 5h11M7 5V3.5h4V5M5 5l.6 9.5h6.8L13 5" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2.5" y="3.5" width="11" height="10" rx="2" />
    <path d="M5.5 3.5V2M10.5 3.5V2M2.5 6.5h11" />
  </svg>
);

const CheckSealIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="8" fill="var(--color-success)" />
    <path d="M5.5 9.2l2.3 2.2 4.7-4.8" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Status badge ──────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: SavingsGoal['status'] }) => {
  if (status === 'Completed') {
    return <Badge variant="success" size="sm" dot>Completed</Badge>;
  }
  if (status === 'Archived') {
    return <Badge variant="neutral" size="sm" dot>Archived</Badge>;
  }
  return <Badge variant="primary" size="sm" dot>Active</Badge>;
};

// ─── Target date line ──────────────────────────────────────────────────────────

const TargetDateLine = ({ goal }: { goal: SavingsGoal }) => {
  if (!goal.targetDate) {
    return (
      <p className="goal-card__date">
        <CalendarIcon />
        <span>No target date</span>
      </p>
    );
  }

  const days = daysUntil(goal.targetDate);
  const isOverdue = days < 0 && goal.status === 'Active';

  return (
    <p className={['goal-card__date', isOverdue ? 'goal-card__date--overdue' : ''].filter(Boolean).join(' ')}>
      <CalendarIcon />
      <span>
        {formatDate(goal.targetDate)}
        {goal.status === 'Active' && (
          <span className="goal-card__date-rel">
            {' · '}
            {isOverdue ? `${formatRelativeDays(days)} (past due)` : formatRelativeDays(days)}
          </span>
        )}
      </span>
    </p>
  );
};

// ─── Component ─────────────────────────────────────────────────────────────────

interface SavingsGoalCardProps {
  goal:         SavingsGoal;
  onView:       (goal: SavingsGoal) => void;
  onEdit:       (goal: SavingsGoal) => void;
  onDelete:     (goal: SavingsGoal) => void;
  onContribute: (goal: SavingsGoal) => void;
}

const SavingsGoalCard = ({
  goal,
  onView,
  onEdit,
  onDelete,
  onContribute,
}: SavingsGoalCardProps) => {
  const isCompleted = goal.status === 'Completed';
  const isActive    = goal.status === 'Active';
  const percent     = Math.min(100, Math.max(0, goal.progressPercent));

  const cardStyle = { '--goal-accent': accentForGoal(goal) } as CSSProperties;

  return (
    <article
      className={['goal-card', isCompleted ? 'goal-card--completed' : ''].filter(Boolean).join(' ')}
      style={cardStyle}
      aria-label={`${goal.title}: ${formatCurrency(goal.currentAmount)} of ${formatCurrency(goal.targetAmount)} saved`}
    >
      <span className="goal-card__color-bar" aria-hidden="true" />

      {/* ── Identity ─────────────────────────────────────────────────────── */}
      <header className="goal-card__top">
        <div className="goal-card__identity">
          <span className="goal-card__icon" aria-hidden="true">
            {goal.icon || DEFAULT_GOAL_ICON}
          </span>
          <div className="goal-card__heading">
            <h3 className="goal-card__title">
              <button
                type="button"
                className="goal-card__title-btn"
                onClick={() => onView(goal)}
                aria-label={`View details for ${goal.title}`}
              >
                {goal.title}
              </button>
            </h3>
            <TargetDateLine goal={goal} />
          </div>
        </div>
        <StatusBadge status={goal.status} />
      </header>

      {/* ── Amounts ──────────────────────────────────────────────────────── */}
      <p className="goal-card__amounts">
        {formatCurrency(goal.currentAmount)}
        <span> / {formatCurrency(goal.targetAmount)}</span>
      </p>

      {/* ── Progress ─────────────────────────────────────────────────────── */}
      <div
        className="progress-bar-track goal-card__progress"
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${goal.title} progress`}
      >
        <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
      </div>

      <div className="goal-card__progress-meta">
        <span className="goal-card__percent">{percent.toFixed(percent % 1 === 0 ? 0 : 1)}% complete</span>
        <span className="goal-card__remaining">
          {goal.remainingAmount > 0
            ? `${formatCurrency(goal.remainingAmount)} remaining`
            : 'Target reached'}
        </span>
      </div>

      {/* ── Breakdown ────────────────────────────────────────────────────── */}
      <dl className="goal-card__stats">
        <div className="goal-card__stat">
          <dt>Saved</dt>
          <dd>{formatCurrency(goal.currentAmount)}</dd>
        </div>
        <div className="goal-card__stat">
          <dt>Target</dt>
          <dd>{formatCurrency(goal.targetAmount)}</dd>
        </div>
        <div className="goal-card__stat">
          <dt>Remaining</dt>
          <dd>{formatCurrency(goal.remainingAmount)}</dd>
        </div>
      </dl>

      {/* ── Completed note ───────────────────────────────────────────────── */}
      {isCompleted && (
        <p className="goal-card__completed-note">
          <CheckSealIcon />
          <span>Goal reached — nicely done.</span>
        </p>
      )}

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <footer className="goal-card__actions">
        {isActive ? (
          <button
            type="button"
            className="btn btn--primary btn--sm goal-card__add-btn"
            onClick={() => onContribute(goal)}
            aria-label={`Add money to ${goal.title}`}
          >
            <span className="btn__icon"><PlusIcon /></span>
            <span>Add Money</span>
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--outline btn--sm goal-card__add-btn"
            onClick={() => onView(goal)}
          >
            <span>View goal</span>
          </button>
        )}

        <div className="goal-card__icon-actions">
          <button
            type="button"
            className="goal-card__icon-btn"
            onClick={() => onView(goal)}
            aria-label={`View ${goal.title}`}
            title="View details"
          >
            <EyeIcon />
          </button>
          <button
            type="button"
            className="goal-card__icon-btn"
            onClick={() => onEdit(goal)}
            aria-label={`Edit ${goal.title}`}
            title="Edit goal"
          >
            <EditIcon />
          </button>
          <button
            type="button"
            className="goal-card__icon-btn goal-card__icon-btn--danger"
            onClick={() => onDelete(goal)}
            aria-label={`Delete ${goal.title}`}
            title="Delete goal"
          >
            <TrashIcon />
          </button>
        </div>
      </footer>
    </article>
  );
};

export default SavingsGoalCard;
