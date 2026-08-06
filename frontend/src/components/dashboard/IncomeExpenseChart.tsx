/**
 * IncomeExpenseChart — Recharts LineChart showing monthly income vs expense.
 *
 * Smooth curves, minimal grid, professional legends, responsive.
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { MonthlyIncomeVsExpense } from '@/types';

// ── Formatters ────────────────────────────────────────────────────────────────

const fmtCurrency = (n: number): string =>
  n >= 1_00_000
    ? `₹${(n / 1_00_000).toFixed(1)}L`
    : n >= 1000
    ? `₹${(n / 1000).toFixed(0)}K`
    : `₹${n}`;

const fmtFull = (n: number): string =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

// ── Custom tooltip ────────────────────────────────────────────────────────────

interface TooltipItem {
  name: string;
  value: number;
  color: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipItem[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip chart-tooltip--line">
      <p className="chart-tooltip__month">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="chart-tooltip__row">
          <span className="chart-tooltip__dot" style={{ background: p.color }} />
          <span className="chart-tooltip__label">{p.name}</span>
          <span className="chart-tooltip__value">{fmtFull(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

// ── Empty state ───────────────────────────────────────────────────────────────

const LineEmptyState = () => (
  <div className="chart-empty">
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="4" y="8" width="40" height="32" rx="4" stroke="var(--color-border)" strokeWidth="2" />
      <path d="M10 32l8-10 6 5 8-12 6 7" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
    <p className="chart-empty__title">Not enough data</p>
    <p className="chart-empty__desc">Add more transactions to see monthly trends.</p>
  </div>
);

// ── Component ─────────────────────────────────────────────────────────────────

interface IncomeExpenseChartProps {
  data: MonthlyIncomeVsExpense[];
}

const IncomeExpenseChart = ({ data }: IncomeExpenseChartProps) => {
  if (!data.length) return <LineEmptyState />;

  return (
    <div aria-label="Monthly income vs expenses chart">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border-subtle)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={fmtCurrency}
            tick={{ fontSize: 11, fill: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)' }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-border)', strokeWidth: 1 }} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => (
              <span className="chart-legend-label">{value}</span>
            )}
          />
          <Line
            type="monotone"
            dataKey="income"
            name="Income"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            name="Expense"
            stroke="#f87171"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeExpenseChart;
