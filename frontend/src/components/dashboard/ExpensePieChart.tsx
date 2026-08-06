/**
 * ExpensePieChart — Recharts PieChart showing expenses by category.
 *
 * Elegant muted color palette. Rounded animated tooltip.
 * Shows an empty state when there are no expense transactions.
 */

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ExpenseByCategory } from '@/types';

// ── Color palette — muted, elegant ────────────────────────────────────────────

const PALETTE = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#f59e0b', // amber
  '#f97316', // orange
  '#ec4899', // pink
  '#64748b', // slate
];

// ── Custom tooltip ────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: { fill: string };
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip__dot" style={{ background: item.payload.fill }} />
      <span className="chart-tooltip__label">{item.name}</span>
      <span className="chart-tooltip__value">{fmt(item.value)}</span>
    </div>
  );
};

// ── Empty state ───────────────────────────────────────────────────────────────

const PieEmptyState = () => (
  <div className="chart-empty">
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="20" stroke="var(--color-border)" strokeWidth="2" strokeDasharray="6 4" />
      <path d="M24 14v10l7 4" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" />
    </svg>
    <p className="chart-empty__title">No expense data yet</p>
    <p className="chart-empty__desc">Add expense transactions to see your spending breakdown.</p>
  </div>
);

// ── Component ─────────────────────────────────────────────────────────────────

interface ExpensePieChartProps {
  data: ExpenseByCategory[];
}

const ExpensePieChart = ({ data }: ExpensePieChartProps) => {
  if (!data.length) return <PieEmptyState />;

  const chartData = data.map((d) => ({ name: d.category, value: d.amount }));

  return (
    <div className="pie-chart-wrap" aria-label="Expense breakdown by category">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} opacity={0.9} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => (
              <span className="chart-legend-label">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpensePieChart;
