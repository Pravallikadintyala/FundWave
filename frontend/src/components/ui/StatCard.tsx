import type { ReactNode } from 'react';

type TrendDirection = 'up' | 'down' | 'neutral';

interface StatCardProps {
  label: string;
  value: string;
  trend?: { value: string; direction: TrendDirection; label?: string };
  icon?: ReactNode;
  accentColor?: string;
  className?: string;
}

const TrendIcon = ({ direction }: { direction: TrendDirection }) => {
  if (direction === 'up') return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M6 2L10 7H2L6 2Z" fill="currentColor" />
    </svg>
  );
  if (direction === 'down') return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M6 10L2 5H10L6 10Z" fill="currentColor" />
    </svg>
  );
  return <span aria-hidden="true">—</span>;
};

const StatCard = ({ label, value, trend, icon, accentColor, className = '' }: StatCardProps) => (
  <div className={['stat-card', className].filter(Boolean).join(' ')}>
    <div className="stat-card__header">
      <span className="stat-card__label">{label}</span>
      {icon && (
        <span className="stat-card__icon" style={accentColor ? { color: accentColor } : undefined}>
          {icon}
        </span>
      )}
    </div>
    <div className="stat-card__value">{value}</div>
    {trend && (
      <div className={['stat-card__trend', `stat-card__trend--${trend.direction}`].join(' ')}>
        <TrendIcon direction={trend.direction} />
        <span>{trend.value}</span>
        {trend.label && <span className="stat-card__trend-label">{trend.label}</span>}
      </div>
    )}
  </div>
);

export default StatCard;
