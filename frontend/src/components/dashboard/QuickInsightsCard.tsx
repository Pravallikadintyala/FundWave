/**
 * QuickInsightsCard — shows AI financial score + short summary + top recommendation.
 *
 * Displays a beautiful SVG circular progress indicator for the score.
 * Handles loading, error, and data states.
 */

import type { AIInsights } from '@/types';
import { Skeleton } from '@/components/ui';

// ── Circular progress ─────────────────────────────────────────────────────────

interface CircularScoreProps {
  score: number; // 0–100
}

const CircularScore = ({ score }: CircularScoreProps) => {
  const size = 100;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const scoreColor =
    score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#f87171';

  return (
    <div className="score-ring" aria-label={`Financial score: ${score} out of 100`} role="img">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      {/* Label inside */}
      <div className="score-ring__label">
        <span className="score-ring__value" style={{ color: scoreColor }}>{score}</span>
        <span className="score-ring__unit">/100</span>
      </div>
    </div>
  );
};

// ── Skeleton state ─────────────────────────────────────────────────────────────

const InsightsSkeleton = () => (
  <div className="insights-skeleton">
    <Skeleton variant="circle" width={100} height={100} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Skeleton variant="line" width="80%" />
      <Skeleton variant="line" width="60%" />
      <Skeleton variant="line" width="70%" />
    </div>
  </div>
);

// ── Error state ───────────────────────────────────────────────────────────────

const InsightsError = () => (
  <div className="chart-empty">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="16" stroke="var(--color-border)" strokeWidth="2" />
      <path d="M20 13v8" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="26" r="1.5" fill="var(--color-text-muted)" />
    </svg>
    <p className="chart-empty__title">Insights unavailable</p>
    <p className="chart-empty__desc">We couldn't generate insights. Add more transactions to get started.</p>
  </div>
);

// ── Public ────────────────────────────────────────────────────────────────────

interface QuickInsightsCardProps {
  insights: AIInsights | null;
  isLoading: boolean;
  error: string | null;
}

const QuickInsightsCard = ({ insights, isLoading, error }: QuickInsightsCardProps) => {
  if (isLoading) return <InsightsSkeleton />;
  if (error || !insights) return <InsightsError />;

  return (
    <div className="insights-body">
      <CircularScore score={insights.overallScore} />
      <div className="insights-content">
        <p className="insights-summary">{insights.summary}</p>
        {insights.recommendations[0] && (
          <div className="insights-rec">
            <span className="insights-rec__label">Top recommendation</span>
            <p className="insights-rec__text">💡 {insights.recommendations[0]}</p>
          </div>
        )}
        <button
          className="btn btn--secondary btn--sm insights-cta"
          type="button"
          aria-label="View full AI insights"
          disabled
        >
          View Full Insights
        </button>
      </div>
    </div>
  );
};

export default QuickInsightsCard;
