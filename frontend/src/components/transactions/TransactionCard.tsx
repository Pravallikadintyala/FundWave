/**
 * TransactionCard — mobile-first card for a single transaction.
 *
 * Shows category icon, description, date, type badge, and amount.
 * Tap-target action buttons for edit / delete.
 */

import type { Transaction, Category } from '@/types';

// ─── Helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const fmtAmount = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const getCategoryName = (cat: string | Category): string =>
  typeof cat === 'string' ? 'Uncategorized' : cat.name;

const getCategoryIcon = (cat: string | Category): string => {
  if (typeof cat !== 'string' && cat.icon) return cat.icon;
  return getCategoryName(cat).charAt(0).toUpperCase();
};

const getCategoryColor = (cat: string | Category): string => {
  if (typeof cat !== 'string' && cat.color) return cat.color;
  return 'var(--color-primary)';
};

// ─── Icons ─────────────────────────────────────────────────────────────────────

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.5 2.5l2 2L5 12H3v-2l7.5-7.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4h11M5 4V2h5v2M6 7v5M9 7v5M3 4l1 9h7l1-9H3z" />
  </svg>
);

// ─── Component ─────────────────────────────────────────────────────────────────

interface TransactionCardProps {
  tx:       Transaction;
  onEdit:   (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
}

const TransactionCard = ({ tx, onEdit, onDelete }: TransactionCardProps) => {
  const catName  = getCategoryName(tx.category);
  const catIcon  = getCategoryIcon(tx.category);
  const catColor = getCategoryColor(tx.category);
  const isIncome = tx.type === 'Income';

  return (
    <article className="txcard" aria-label={`${catName} — ${fmtAmount(tx.amount)}`}>
      {/* Left: icon */}
      <span
        className="txcard__icon"
        style={{ background: `${catColor}20`, color: catColor }}
        aria-hidden="true"
      >
        {catIcon}
      </span>

      {/* Middle: info */}
      <div className="txcard__info">
        <span className="txcard__desc">{tx.description || catName}</span>
        <div className="txcard__meta">
          <span className="txcard__cat">{catName}</span>
          <span className="txcard__sep" aria-hidden="true">·</span>
          <time dateTime={tx.transactionDate} className="txcard__date">
            {fmtDate(tx.transactionDate)}
          </time>
        </div>
      </div>

      {/* Right: amount + badge */}
      <div className="txcard__right">
        <span className={`txcard__amount ${isIncome ? 'txcard__amount--income' : 'txcard__amount--expense'}`}>
          {isIncome ? '+' : '−'}{fmtAmount(tx.amount)}
        </span>
        <span className={`badge badge--sm ${isIncome ? 'badge--success' : 'badge--danger'}`}>
          {tx.type}
        </span>
      </div>

      {/* Action buttons */}
      <div className="txcard__actions" role="group" aria-label="Transaction actions">
        <button
          type="button"
          className="txcard__action-btn txcard__action-btn--edit"
          onClick={() => onEdit(tx)}
          aria-label={`Edit ${catName} transaction`}
        >
          <EditIcon />
        </button>
        <button
          type="button"
          className="txcard__action-btn txcard__action-btn--delete"
          onClick={() => onDelete(tx)}
          aria-label={`Delete ${catName} transaction`}
        >
          <TrashIcon />
        </button>
      </div>
    </article>
  );
};

export default TransactionCard;
