/**
 * SavingsSnapshot — shows savings summary stats and a progress strip.
 *
 * Displays: Total Goals, Completed Goals, Total Saved.
 * Uses modern circular indicators and progress bars.
 */

import type { SavingsSummary } from '@/types';

// ── Formatter ─────────────────────────────────────────────────────────────────

const fmt = (n: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

// ── Stat pill ─────────────────────────────────────────────────────────────────

interface StatPillProps {
  label: string;
  value: string | number;
  accent?: string;
}

const StatPill = ({ label, value, accent }: StatPillProps) => (
  <div className="snap-pill">
    <span className="snap-pill__value" style={accent ? { color: accent } : undefined}>
      {value}
    </span>
    <span className="snap-pill__label">{label}</span>
  </div>
);

// ── Completion ring ───────────────────────────────────────────────────────────

interface CompletionRingProps {
  completed: number;
  total: number;
}

const CompletionRing = ({ completed, total }: CompletionRingProps) => {
  const pct = total > 0 ? (completed / total) * 100 : 0;
  const size = 64;
  const sw = 6;
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="snap-ring" aria-label={`${completed} of ${total} goals completed`} role="img">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-border)" strokeWidth={sw} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#10b981"
          strokeWidth={sw}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.9s ease' }}
        />
      </svg>
      <div className="snap-ring__label">
        <span className="snap-ring__frac">{completed}<span>/{total}</span></span>
      </div>
    </div>
  );
};

// ── Public ────────────────────────────────────────────────────────────────────

interface SavingsSnapshotProps {
  savings: SavingsSummary;
}

const SavingsSnapshot = ({ savings }: SavingsSnapshotProps) => {
  const { totalGoals, completedGoals, activeGoals, totalSaved } = savings;

  return (
    <div className="savings-snap">
      {/* Completion ring */}
      <div className="savings-snap__ring-section">
        <CompletionRing completed={completedGoals} total={totalGoals} />
        <div>
          <p className="savings-snap__ring-title">Goals completed</p>
          <p className="savings-snap__ring-sub">
            {totalGoals === 0
              ? 'No goals yet'
              : `${activeGoals} active · ${completedGoals} done`}
          </p>
        </div>
      </div>

      {/* Stat pills */}
      <div className="savings-snap__pills">
        <StatPill label="Total Goals" value={totalGoals} />
        <StatPill label="Completed" value={completedGoals} accent="#10b981" />
        <StatPill label="Total Saved" value={fmt(totalSaved)} accent="#6366f1" />
      </div>

      {/* Progress bar representing completion rate */}
      <div className="savings-snap__progress">
        <div
          className="savings-snap__progress-fill"
          style={{ width: `${totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0}%` }}
          role="progressbar"
          aria-valuenow={totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

export default SavingsSnapshot;
