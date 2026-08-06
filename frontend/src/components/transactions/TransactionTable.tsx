/**
 * TransactionTable — desktop view. Beautiful sticky-header table with
 * category icon, hover animation, and action buttons per row.
 */

import type { Transaction, Category } from '@/types';

// ─── Helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const fmtAmount = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const getCategory = (cat: string | Category): Category | null =>
  typeof cat === 'string' ? null : cat;

const getCategoryName = (cat: string | Category): string =>
  typeof cat === 'string' ? 'Uncategorized' : cat.name;

const getCategoryIcon = (cat: string | Category): string => {
  if (typeof cat !== 'string' && cat.icon) return cat.icon;
  const name = getCategoryName(cat);
  return name.charAt(0).toUpperCase();
};

const getCategoryColor = (cat: string | Category): string => {
  const c = getCategory(cat);
  return c?.color ?? 'var(--color-primary)';
};

// ─── Icons ─────────────────────────────────────────────────────────────────────

const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.5 2.5l2 2L5 12H3v-2l7.5-7.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4h11M5 4V2h5v2M6 7v5M9 7v5M3 4l1 9h7l1-9H3z" />
  </svg>
);

// ─── Row ───────────────────────────────────────────────────────────────────────

interface TxTableRowProps {
  tx: Transaction;
  onEdit:   (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
}

const TxTableRow = ({ tx, onEdit, onDelete }: TxTableRowProps) => {
  const catName  = getCategoryName(tx.category);
  const catIcon  = getCategoryIcon(tx.category);
  const catColor = getCategoryColor(tx.category);
  const isIncome = tx.type === 'Income';

  return (
    <tr className="txtable__row" role="row">
      {/* Category icon */}
      <td className="txtable__td txtable__td--icon" role="cell">
        <span
          className="txtable__cat-icon"
          style={{ background: `${catColor}20`, color: catColor }}
          aria-hidden="true"
        >
          {catIcon}
        </span>
      </td>

      {/* Category name */}
      <td className="txtable__td" role="cell">
        <span className="txtable__cat-name">{catName}</span>
      </td>

      {/* Description */}
      <td className="txtable__td txtable__td--desc" role="cell">
        <span className="txtable__desc">{tx.description || '—'}</span>
      </td>

      {/* Amount */}
      <td className="txtable__td txtable__td--amount" role="cell">
        <span className={`txtable__amount ${isIncome ? 'txtable__amount--income' : 'txtable__amount--expense'}`}>
          {isIncome ? '+' : '−'}{fmtAmount(tx.amount)}
        </span>
      </td>

      {/* Type badge */}
      <td className="txtable__td" role="cell">
        <span className={`badge badge--sm ${isIncome ? 'badge--success' : 'badge--danger'}`}>
          {tx.type}
        </span>
      </td>

      {/* Date */}
      <td className="txtable__td txtable__td--date" role="cell">
        <time dateTime={tx.transactionDate} className="txtable__date">
          {fmtDate(tx.transactionDate)}
        </time>
      </td>

      {/* Actions */}
      <td className="txtable__td txtable__td--actions" role="cell">
        <div className="txtable__actions">
          <button
            type="button"
            className="txtable__action-btn txtable__action-btn--edit"
            onClick={() => onEdit(tx)}
            aria-label={`Edit ${catName} transaction`}
            title="Edit"
          >
            <EditIcon />
          </button>
          <button
            type="button"
            className="txtable__action-btn txtable__action-btn--delete"
            onClick={() => onDelete(tx)}
            aria-label={`Delete ${catName} transaction`}
            title="Delete"
          >
            <TrashIcon />
          </button>
        </div>
      </td>
    </tr>
  );
};

// ─── Component ─────────────────────────────────────────────────────────────────

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit:   (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
}

const TransactionTable = ({ transactions, onEdit, onDelete }: TransactionTableProps) => (
  <div className="txtable-wrap" role="region" aria-label="Transactions table">
    <table className="txtable" role="table">
      <thead className="txtable__head">
        <tr role="row">
          <th className="txtable__th txtable__th--icon"  scope="col" aria-label="Category icon" />
          <th className="txtable__th"                    scope="col">Category</th>
          <th className="txtable__th txtable__th--desc"  scope="col">Description</th>
          <th className="txtable__th txtable__th--amount" scope="col">Amount</th>
          <th className="txtable__th"                    scope="col">Type</th>
          <th className="txtable__th"                    scope="col">Date</th>
          <th className="txtable__th txtable__th--actions" scope="col" aria-label="Actions" />
        </tr>
      </thead>
      <tbody className="txtable__body">
        {transactions.map(tx => (
          <TxTableRow key={tx.id} tx={tx} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  </div>
);

export default TransactionTable;
