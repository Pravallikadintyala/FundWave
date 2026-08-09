/**
 * TransactionSummary — four animated stat cards above the transactions table.
 *
 * Displays:
 *  - Total Income
 *  - Total Expense
 *  - Net Cash Flow (Income − Expense)
 *  - Transaction Count
 *
 * Recalculates from the full (unfiltered) transactions list so the
 * numbers always reflect the complete picture, not the current page.
 */

import { useMemo } from 'react';
import type { Transaction } from '@/types';

// ─── Helpers ───────────────────────────────────────────────────────────────────

const fmtAmount = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.abs(n));

// ─── Icons ─────────────────────────────────────────────────────────────────────

const IncomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 17V7M5 12l5-5 5 5" />
    <path d="M3 17h14" opacity="0.4" />
  </svg>
);

const ExpenseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 7v10M5 12l5 5 5-5" />
    <path d="M3 7h14" opacity="0.4" />
  </svg>
);

const NetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="10" cy="10" r="7.5" />
    <path d="M7 10h6M10 7v6" />
  </svg>
);

const CountIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="14" height="13" rx="2.5" />
    <path d="M7 4V2.5M13 4V2.5" />
    <path d="M6 9h8M6 12.5h5" />
  </svg>
);

// ─── Single card ───────────────────────────────────────────────────────────────

interface SummaryCardProps {
  label:    string;
  value:    string;
  subLabel: string;
  icon:     React.ReactNode;
  variant:  'income' | 'expense' | 'net' | 'count';
  sign?:    '' | '+' | '−';
}

const SummaryCard = ({ label, value, subLabel, icon, variant, sign = '' }: SummaryCardProps) => (
  <article
    className={`tx-summary-card tx-summary-card--${variant}`}
    aria-label={`${label}: ${sign}${value}`}
  >
    {/* shimmer layer */}
    <span className="tx-summary-card__shimmer" aria-hidden="true" />

    {/* top row */}
    <div className="tx-summary-card__header">
      <span className="tx-summary-card__label">{label}</span>
      <span className="tx-summary-card__icon" aria-hidden="true">{icon}</span>
    </div>

    {/* value */}
    <div className="tx-summary-card__value">
      {sign && <span className="tx-summary-card__sign">{sign}</span>}
      {value}
    </div>

    {/* sub label */}
    <div className="tx-summary-card__sub">{subLabel}</div>
  </article>
);

// ─── Component ─────────────────────────────────────────────────────────────────

interface TransactionSummaryProps {
  transactions: Transaction[];
  isLoading:    boolean;
}

const TransactionSummary = ({ transactions, isLoading }: TransactionSummaryProps) => {
  const stats = useMemo(() => {
    let income  = 0;
    let expense = 0;
    for (const tx of transactions) {
      if (tx.type === 'Income')  income  += tx.amount;
      else                        expense += tx.amount;
    }
    return {
      income,
      expense,
      net:   income - expense,
      count: transactions.length,
    };
  }, [transactions]);

  if (isLoading) {
    return (
      <div className="tx-summary-grid" aria-busy="true" aria-label="Loading summary">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="tx-summary-card tx-summary-card--skeleton">
            <div className="txskel__line" style={{ width: '55%', marginBottom: 12 }} />
            <div className="txskel__line txskel__line--bold" style={{ width: '80%', height: 28, marginBottom: 8 }} />
            <div className="txskel__line txskel__line--sm" style={{ width: '40%' }} />
          </div>
        ))}
      </div>
    );
  }

  const net     = stats.net;
  const netSign = net > 0 ? '+' : net < 0 ? '−' : '';

  return (
    <div className="tx-summary-grid" role="region" aria-label="Financial summary">
      <SummaryCard
        label="Total Income"
        value={fmtAmount(stats.income)}
        subLabel={`${transactions.filter(t => t.type === 'Income').length} transactions`}
        icon={<IncomeIcon />}
        variant="income"
        sign={stats.income > 0 ? '+' : ''}
      />
      <SummaryCard
        label="Total Expense"
        value={fmtAmount(stats.expense)}
        subLabel={`${transactions.filter(t => t.type === 'Expense').length} transactions`}
        icon={<ExpenseIcon />}
        variant="expense"
        sign={stats.expense > 0 ? '−' : ''}
      />
      <SummaryCard
        label="Net Cash Flow"
        value={fmtAmount(net)}
        subLabel={net >= 0 ? 'You are saving well' : 'Expenses exceed income'}
        icon={<NetIcon />}
        variant="net"
        sign={netSign}
      />
      <SummaryCard
        label="Transactions"
        value={String(stats.count)}
        subLabel="total recorded"
        icon={<CountIcon />}
        variant="count"
      />
    </div>
  );
};

export default TransactionSummary;
