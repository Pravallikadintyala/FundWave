/**
 * EmptyTransactions — beautiful illustrated empty state with a CTA.
 *
 * Shown when either:
 *   - there are no transactions at all ("first time" state)
 *   - filters return zero results ("no match" state)
 */

interface EmptyTransactionsProps {
  hasFilters:  boolean;
  onAdd:       () => void;
  onClear?:    () => void;
}

import { useAuth } from '@/hooks/useAuth';
import { getCurrencySymbol } from '@/utils/format';

// ─── Illustration ───────────────────────────────────────────────────────────────

const EmptyIllustration = ({ symbol }: { symbol: string }) => (
  <svg
    width="120"
    height="100"
    viewBox="0 0 120 100"
    fill="none"
    aria-hidden="true"
    className="empty-tx__illustration"
  >
    {/* Receipt body */}
    <rect x="20" y="10" width="60" height="72" rx="8" fill="var(--color-primary-muted)" stroke="var(--color-border)" strokeWidth="1.5" />
    {/* Receipt lines */}
    <rect x="30" y="26" width="40" height="5"  rx="2.5" fill="var(--color-border)" />
    <rect x="30" y="36" width="30" height="4"  rx="2"   fill="var(--color-border)" />
    <rect x="30" y="46" width="36" height="4"  rx="2"   fill="var(--color-border)" />
    <rect x="30" y="56" width="24" height="4"  rx="2"   fill="var(--color-border)" />
    {/* Amount */}
    <rect x="30" y="66" width="40" height="6"  rx="3"   fill="var(--color-primary-muted)" stroke="var(--color-primary)" strokeWidth="1" />
    {/* Receipt scallop bottom */}
    <path d="M20 82 Q24 86 28 82 Q32 86 36 82 Q40 86 44 82 Q48 86 52 82 Q56 86 60 82 Q64 86 68 82 Q72 86 76 82 Q80 86 80 82V82" stroke="var(--color-border)" strokeWidth="1.5" fill="none" />

    {/* Floating coin */}
    <circle cx="88" cy="28" r="14" fill="var(--color-warning-muted)" stroke="var(--color-warning)" strokeWidth="1.5" />
    <text x="88" y="33" textAnchor="middle" fontSize="14" fill="var(--color-warning-fg)" fontWeight="700">{symbol}</text>

    {/* Plus badge */}
    <circle cx="90" cy="72" r="12" fill="var(--color-success-muted)" stroke="var(--color-success)" strokeWidth="1.5" />
    <path d="M90 66v12M84 72h12" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const FilterIllustration = () => (
  <svg
    width="100"
    height="90"
    viewBox="0 0 100 90"
    fill="none"
    aria-hidden="true"
    className="empty-tx__illustration"
  >
    {/* Magnifier */}
    <circle cx="42" cy="40" r="26" stroke="var(--color-border)" strokeWidth="2" fill="var(--color-primary-muted)" />
    <path d="M60 58l18 18" stroke="var(--color-text-muted)" strokeWidth="3" strokeLinecap="round" />
    {/* Lines inside */}
    <path d="M32 35h20M32 42h14M32 49h18" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
    {/* X mark */}
    <circle cx="78" cy="22" r="10" fill="var(--color-danger-muted)" stroke="var(--color-danger)" strokeWidth="1.5" />
    <path d="M74 18l8 8M82 18l-8 8" stroke="var(--color-danger)" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// ─── Component ─────────────────────────────────────────────────────────────────

const EmptyTransactions = ({ hasFilters, onAdd, onClear }: EmptyTransactionsProps) => {
  const { user } = useAuth();
  const symbol = getCurrencySymbol(user?.currency);

  return (
    <div className="empty-tx" role="region" aria-label="Empty state">
      <div className="empty-tx__art">
        {hasFilters ? <FilterIllustration /> : <EmptyIllustration symbol={symbol} />}
      </div>

    <h2 className="empty-tx__title">
      {hasFilters ? 'No matching transactions' : 'No transactions yet'}
    </h2>

    <p className="empty-tx__desc">
      {hasFilters
        ? 'Try adjusting your filters or clearing them to see all transactions.'
        : 'Track every rupee with clarity. Add your first transaction to get started.'}
    </p>

    <div className="empty-tx__actions">
      {hasFilters && onClear && (
        <button type="button" className="btn btn--ghost btn--md" onClick={onClear}>
          Clear filters
        </button>
      )}
      <button type="button" className="btn btn--primary btn--md" onClick={onAdd}>
        {hasFilters ? '+ New transaction' : 'Add your first transaction'}
      </button>
    </div>
  </div>
  );
};

export default EmptyTransactions;
