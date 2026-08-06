/**
 * SummaryCards — four KPI cards: Balance, Income, Expenses, Savings.
 *
 * Each card has a subtle gradient accent and hover elevation.
 */

import type { DashboardSummary, SavingsSummary } from '@/types';

// ── Number formatter ──────────────────────────────────────────────────────────

const fmt = (n: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

// ── Icons ─────────────────────────────────────────────────────────────────────

const BalanceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="5" width="20" height="14" rx="3" />
    <path d="M2 10h20" />
    <circle cx="6" cy="15" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);
const IncomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);
const ExpenseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
);
const SavingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
    <path d="M16 14a2 2 0 100-4 2 2 0 000 4z" fill="currentColor" stroke="none" />
    <path d="M6 10h2" strokeLinecap="round" />
  </svg>
);

// ── Card ──────────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accentClass: string;
}

const KpiCard = ({ label, value, sub, icon, accentClass }: KpiCardProps) => (
  <article className={`kpi-card ${accentClass}`} tabIndex={0}>
    <div className="kpi-card__header">
      <span className="kpi-card__label">{label}</span>
      <span className="kpi-card__icon-wrap">{icon}</span>
    </div>
    <div className="kpi-card__value">{value}</div>
    {sub && <p className="kpi-card__sub">{sub}</p>}
    <div className="kpi-card__shimmer" aria-hidden="true" />
  </article>
);

// ── Public ────────────────────────────────────────────────────────────────────

interface SummaryCardsProps {
  summary: DashboardSummary;
  savings: SavingsSummary;
}

const SummaryCards = ({ summary, savings }: SummaryCardsProps) => (
  <div className="kpi-grid" role="list" aria-label="Financial summary">
    <KpiCard
      label="Current Balance"
      value={fmt(summary.currentBalance)}
      sub={`${summary.transactionCount} transactions`}
      icon={<BalanceIcon />}
      accentClass="kpi-card--balance"
    />
    <KpiCard
      label="Total Income"
      value={fmt(summary.totalIncome)}
      icon={<IncomeIcon />}
      accentClass="kpi-card--income"
    />
    <KpiCard
      label="Total Expenses"
      value={fmt(summary.totalExpenses)}
      icon={<ExpenseIcon />}
      accentClass="kpi-card--expense"
    />
    <KpiCard
      label="Total Saved"
      value={fmt(savings.totalSaved)}
      sub={`${savings.activeGoals} active goal${savings.activeGoals !== 1 ? 's' : ''}`}
      icon={<SavingsIcon />}
      accentClass="kpi-card--savings"
    />
  </div>
);

export default SummaryCards;
