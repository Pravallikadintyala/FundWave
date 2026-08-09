/**
 * SavingsEmptyState — two flavours of "nothing here":
 *
 *  - no goals at all      → the real onboarding empty state with the primary CTA
 *  - filter matched none  → a lighter state offering a way back to all goals
 */

import type { GoalFilter } from '@/hooks/useSavingsGoals';
import { useAuth } from '@/hooks/useAuth';
import { getCurrencySymbol } from '@/utils/format';

// ─── Illustrations ─────────────────────────────────────────────────────────────

const PiggyIllustration = ({ symbol }: { symbol: string }) => (
  <svg width="132" height="108" viewBox="0 0 132 108" fill="none" aria-hidden="true">
    {/* Coin stack */}
    <ellipse cx="30" cy="92" rx="20" ry="6" fill="var(--color-warning-muted)" stroke="var(--color-warning)" strokeWidth="1.4" />
    <ellipse cx="30" cy="85" rx="20" ry="6" fill="var(--color-warning-muted)" stroke="var(--color-warning)" strokeWidth="1.4" />
    <ellipse cx="30" cy="78" rx="20" ry="6" fill="var(--color-warning-muted)" stroke="var(--color-warning)" strokeWidth="1.4" />

    {/* Jar / target body */}
    <rect x="60" y="30" width="56" height="62" rx="14" fill="var(--color-primary-muted)" stroke="var(--color-border)" strokeWidth="1.6" />
    <path d="M60 62h56" stroke="var(--color-primary)" strokeWidth="1.6" opacity="0.45" />
    <path d="M60 74h56" stroke="var(--color-primary)" strokeWidth="1.6" opacity="0.3" />
    {/* Jar lid */}
    <rect x="68" y="22" width="40" height="12" rx="6" fill="var(--color-primary)" opacity="0.85" />
    {/* Currency mark */}
    <text x="88" y="58" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--color-primary)">{symbol}</text>

    {/* Falling coin */}
    <circle cx="88" cy="10" r="9" fill="var(--color-success-muted)" stroke="var(--color-success)" strokeWidth="1.5" />
    <path d="M84 10h8M88 6v8" stroke="var(--color-success)" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const FilterIllustration = () => (
  <svg width="104" height="92" viewBox="0 0 104 92" fill="none" aria-hidden="true">
    <circle cx="44" cy="42" r="26" stroke="var(--color-border)" strokeWidth="2" fill="var(--color-primary-muted)" />
    <path d="M62 60l18 18" stroke="var(--color-text-muted)" strokeWidth="3" strokeLinecap="round" />
    <circle cx="44" cy="42" r="13" stroke="var(--color-primary)" strokeWidth="2" fill="none" />
    <circle cx="44" cy="42" r="3" fill="var(--color-primary)" />
    <circle cx="82" cy="22" r="10" fill="var(--color-warning-muted)" stroke="var(--color-warning)" strokeWidth="1.5" />
    <path d="M82 17v6M82 26.5v.5" stroke="var(--color-warning)" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// ─── Component ─────────────────────────────────────────────────────────────────

interface SavingsEmptyStateProps {
  filter:      GoalFilter;
  onCreate:    () => void;
  onShowAll:   () => void;
}

const FILTER_COPY: Record<Exclude<GoalFilter, 'all'>, { title: string; desc: string }> = {
  Active: {
    title: 'No active goals',
    desc:  'Every goal you have is either completed or archived. Create a new one to keep the momentum going.',
  },
  Completed: {
    title: 'No completed goals yet',
    desc:  'Keep adding money to your active goals — completed ones will collect here.',
  },
};

const SavingsEmptyState = ({ filter, onCreate, onShowAll }: SavingsEmptyStateProps) => {
  const { user } = useAuth();
  const symbol = getCurrencySymbol(user?.currency);

  if (filter !== 'all') {
    const copy = FILTER_COPY[filter];
    return (
      <section className="empty-tx" aria-label="No goals in this filter">
        <div className="empty-tx__art"><FilterIllustration /></div>
        <h2 className="empty-tx__title">{copy.title}</h2>
        <p className="empty-tx__desc">{copy.desc}</p>
        <div className="empty-tx__actions">
          <button type="button" className="btn btn--ghost btn--md" onClick={onShowAll}>
            Show all goals
          </button>
          <button type="button" className="btn btn--primary btn--md" onClick={onCreate}>
            + Create Goal
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="empty-tx" aria-label="No savings goals yet">
      <div className="empty-tx__art"><PiggyIllustration symbol={symbol} /></div>
      <h2 className="empty-tx__title">Start saving for something that matters.</h2>
      <p className="empty-tx__desc">
        Set a target, track every contribution, and watch your progress build. Your first goal takes
        less than a minute.
      </p>
      <div className="empty-tx__actions">
        <button type="button" className="btn btn--primary btn--md" onClick={onCreate}>
          Create your first goal
        </button>
      </div>
    </section>
  );
};

export default SavingsEmptyState;
