/**
 * DashboardPage — the main financial overview screen.
 *
 * Consumes GET /api/dashboard and GET /api/ai/insights.
 * Composed entirely from small, focused sub-components.
 */

import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDashboard } from '@/hooks/useDashboard';
import { useAIInsights } from '@/hooks/useAIInsights';
import { Card, CardHeader, CardBody } from '@/components/ui';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SummaryCards from '@/components/dashboard/SummaryCards';
import ExpensePieChart from '@/components/dashboard/ExpensePieChart';
import IncomeExpenseChart from '@/components/dashboard/IncomeExpenseChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import QuickInsightsCard from '@/components/dashboard/QuickInsightsCard';
import SavingsSnapshot from '@/components/dashboard/SavingsSnapshot';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';

// ── Error fallback ─────────────────────────────────────────────────────────────

interface DashboardErrorProps {
  message: string;
  onRetry: () => void;
}

const DashboardError = ({ message, onRetry }: DashboardErrorProps) => (
  <div className="db-error">
    <div className="db-error__icon" aria-hidden="true">
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="22" stroke="var(--color-danger-muted)" strokeWidth="2" fill="var(--color-danger-muted)" />
        <path d="M28 18v12" stroke="var(--color-danger)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="28" cy="36" r="2" fill="var(--color-danger)" />
      </svg>
    </div>
    <h2 className="db-error__title">Something went wrong</h2>
    <p className="db-error__desc">{message}</p>
    <button className="btn btn--primary btn--md" type="button" onClick={onRetry}>
      Try again
    </button>
  </div>
);

// ── Section header helper ──────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  linkTo?: string;
  linkLabel?: string;
}

const SectionHeader = ({ title, subtitle, linkTo, linkLabel }: SectionHeaderProps) => (
  <CardHeader>
    <div className="card-section-header">
      <h2 className="card-section-title">{title}</h2>
      {linkTo ? (
        <Link to={linkTo} className="card-section-link">{linkLabel ?? 'View all'} →</Link>
      ) : (
        subtitle && <span className="label-sm">{subtitle}</span>
      )}
    </div>
  </CardHeader>
);

// ── Page ──────────────────────────────────────────────────────────────────────

const DashboardPage = () => {
  const { user } = useAuth();
  const displayName =
    user?.fullName?.split(' ')[0] ?? user?.username ?? 'there';

  const { data, isLoading, error, refetch } = useDashboard();
  const { insights, isLoading: insightsLoading, error: insightsError } = useAIInsights();

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) return <DashboardSkeleton />;

  // ── Error state ────────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="page page-enter">
        <DashboardError
          message={error ?? 'Dashboard data unavailable.'}
          onRetry={refetch}
        />
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="page page-enter db-page">
      {/* ── Greeting ──────────────────────────────────────────────────────── */}
      <DashboardHeader displayName={displayName} />

      {/* ── KPI Summary Cards ──────────────────────────────────────────────── */}
      <SummaryCards summary={data.summary} savings={data.savings} />

      {/* ── Charts ──────────────────────────────────────────────────────────── */}
      <div className="db-charts-grid">
        {/* Monthly Income vs Expense — wide */}
        <Card variant="default" padding="lg" className="db-charts-grid__wide">
          <SectionHeader title="Monthly Income vs Expenses" subtitle="All time" />
          <CardBody>
            <IncomeExpenseChart data={data.incomeVsExpense} />
          </CardBody>
        </Card>

        {/* Expense by Category */}
        <Card variant="default" padding="lg">
          <SectionHeader title="Expenses by Category" subtitle="All time" />
          <CardBody>
            <ExpensePieChart data={data.expenseByCategory} />
          </CardBody>
        </Card>

        {/* Quick Insights */}
        <Card variant="default" padding="lg">
          <SectionHeader title="Financial Insights" subtitle="AI powered" />
          <CardBody>
            <QuickInsightsCard
              insights={insights}
              isLoading={insightsLoading}
              error={insightsError}
            />
          </CardBody>
        </Card>
      </div>

      {/* ── Bottom row ──────────────────────────────────────────────────────── */}
      <div className="db-bottom-grid">
        {/* Recent Transactions */}
        <Card variant="default" padding="lg">
          <SectionHeader title="Recent Transactions" subtitle="Last 5 entries" />
          <CardBody>
            <RecentTransactions transactions={data.recentTransactions} />
          </CardBody>
        </Card>

        {/* Savings Snapshot */}
        <Card variant="default" padding="lg">
          <SectionHeader title="Savings Snapshot" linkTo="/savings-goals" linkLabel="View all goals" />
          <CardBody>
            <SavingsSnapshot savings={data.savings} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
