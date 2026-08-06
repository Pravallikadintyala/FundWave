/**
 * RecentTransactions — shows the last 5 transactions in a styled list.
 *
 * Each row has:
 *   - Category icon  (emoji or first-letter fallback)
 *   - Description / category name
 *   - Date
 *   - Amount with Income / Expense badge
 *
 * Hover effect on each row. Empty state when no transactions exist.
 */

import type { Transaction, Category } from '@/types';

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

const fmtAmount = (n: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

const getCategoryName = (cat: string | Category): string =>
  typeof cat === 'string' ? cat : cat.name;

const getCategoryIcon = (cat: string | Category): string => {
  if (typeof cat !== 'string' && cat.icon) return cat.icon;
  const name = typeof cat === 'string' ? cat : cat.name;
  return name.charAt(0).toUpperCase();
};

const getCategoryColor = (cat: string | Category): string => {
  if (typeof cat !== 'string' && cat.color) return cat.color;
  return 'var(--color-primary)';
};

// ── Empty state ───────────────────────────────────────────────────────────────

const TransactionsEmptyState = () => (
  <div className="tx-empty">
    <div className="tx-empty__icon" aria-hidden="true">
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <rect x="6" y="10" width="40" height="32" rx="6" stroke="var(--color-border)" strokeWidth="2" />
        <path d="M6 21h40" stroke="var(--color-border)" strokeWidth="1.5" />
        <path d="M16 32h10" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 27h14" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="40" cy="38" r="8" fill="var(--color-primary-muted)" />
        <path d="M40 35v3l2 2" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
    <p className="tx-empty__title">No transactions yet</p>
    <p className="tx-empty__desc">
      Your recent transactions will appear here once you start adding them.
    </p>
  </div>
);

// ── Row ───────────────────────────────────────────────────────────────────────

interface TxRowProps {
  tx: Transaction;
}

const TxRow = ({ tx }: TxRowProps) => {
  const catName = getCategoryName(tx.category);
  const catIcon = getCategoryIcon(tx.category);
  const catColor = getCategoryColor(tx.category);
  const isIncome = tx.type === 'Income';

  return (
    <li className="tx-row" role="listitem">
      {/* Icon */}
      <span
        className="tx-row__icon"
        style={{ background: `${catColor}18`, color: catColor }}
        aria-hidden="true"
      >
        {catIcon}
      </span>

      {/* Description + category */}
      <div className="tx-row__info">
        <span className="tx-row__desc">
          {tx.description || catName}
        </span>
        <span className="tx-row__cat">{catName}</span>
      </div>

      {/* Date */}
      <span className="tx-row__date">
        <time dateTime={tx.transactionDate}>{fmtDate(tx.transactionDate)}</time>
      </span>

      {/* Amount + badge */}
      <div className="tx-row__amount-wrap">
        <span className={`tx-row__amount ${isIncome ? 'tx-row__amount--income' : 'tx-row__amount--expense'}`}>
          {isIncome ? '+' : '−'}{fmtAmount(tx.amount)}
        </span>
        <span className={`badge badge--sm ${isIncome ? 'badge--success' : 'badge--danger'}`}>
          {tx.type}
        </span>
      </div>
    </li>
  );
};

// ── Public ────────────────────────────────────────────────────────────────────

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  if (!transactions.length) return <TransactionsEmptyState />;

  return (
    <ul className="tx-list" aria-label="Recent transactions" role="list">
      {transactions.map((tx) => (
        <TxRow key={tx.id} tx={tx} />
      ))}
    </ul>
  );
};

export default RecentTransactions;
