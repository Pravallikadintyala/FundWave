/**
 * SavingsSummary — the four headline statistics above the goal grid.
 *
 * Total Saved · Active Goals · Completed Goals · Total Goal Amount
 * Every value is derived from the goals list by useSavingsGoals, so the numbers
 * always agree with what the cards below show.
 */

import type { ReactNode } from 'react';
import type { SavingsGoalsSummary } from '@/hooks/useSavingsGoals';
import { formatCurrency } from '@/utils/format';

// ─── Icons ─────────────────────────────────────────────────────────────────────

const SavedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16.5 6.5H3.5A1.5 1.5 0 002 8v5a1.5 1.5 0 001.5 1.5h13A1.5 1.5 0 0018 13V8a1.5 1.5 0 00-1.5-1.5z" />
    <path d="M13.5 11.5a1 1 0 100-2 1 1 0 000 2z" fill="currentColor" stroke="none" />
    <path d="M5 4.5h9" opacity="0.5" />
  </svg>
);

const ActiveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="10" cy="10" r="7.5" />
    <path d="M10 5.5V10l3 2" />
  </svg>
);

const CompletedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="10" cy="10" r="7.5" />
    <path d="M6.5 10.2l2.4 2.3 4.6-4.8" />
  </svg>
);

const TargetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="10" cy="10" r="7.5" />
    <circle cx="10" cy="10" r="4" />
    <circle cx="10" cy="10" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

// ─── Single tile ───────────────────────────────────────────────────────────────

type TileVariant = 'saved' | 'active' | 'completed' | 'target';

interface TileProps {
  label:   string;
  value:   string;
  sub:     string;
  icon:    ReactNode;
  variant: TileVariant;
}

const Tile = ({ label, value, sub, icon, variant }: TileProps) => (
  <article
    className={`savings-summary-item savings-summary-item--${variant}`}
    aria-label={`${label}: ${value}`}
  >
    <div className="savings-summary-item__header">
      <span className="savings-summary-item__label">{label}</span>
      <span className="savings-summary-item__icon" aria-hidden="true">{icon}</span>
    </div>
    <span className="savings-summary-item__value">{value}</span>
    <span className="savings-summary-item__sub">{sub}</span>
  </article>
);

// ─── Component ─────────────────────────────────────────────────────────────────

const plural = (count: number, word: string): string =>
  `${count} ${word}${count === 1 ? '' : 's'}`;

interface SavingsSummaryProps {
  summary: SavingsGoalsSummary;
}

const SavingsSummary = ({ summary }: SavingsSummaryProps) => {
  const {
    totalSaved,
    totalTargetAmount,
    totalGoals,
    activeGoals,
    completedGoals,
    overallProgressPercent,
  } = summary;

  return (
    <section className="savings-summary-strip" aria-label="Savings summary">
      <Tile
        label="Total Saved"
        value={formatCurrency(totalSaved)}
        sub={totalGoals === 0 ? 'No goals yet' : `across ${plural(totalGoals, 'goal')}`}
        icon={<SavedIcon />}
        variant="saved"
      />
      <Tile
        label="Active Goals"
        value={String(activeGoals)}
        sub={activeGoals === 0 ? 'Nothing in progress' : 'Still in progress'}
        icon={<ActiveIcon />}
        variant="active"
      />
      <Tile
        label="Completed Goals"
        value={String(completedGoals)}
        sub={completedGoals === 0 ? 'None reached yet' : 'Target reached'}
        icon={<CompletedIcon />}
        variant="completed"
      />
      <Tile
        label="Total Goal Amount"
        value={formatCurrency(totalTargetAmount)}
        sub={
          totalTargetAmount === 0
            ? 'Set your first target'
            : `${overallProgressPercent.toFixed(0)}% funded overall`
        }
        icon={<TargetIcon />}
        variant="target"
      />
    </section>
  );
};

export default SavingsSummary;
