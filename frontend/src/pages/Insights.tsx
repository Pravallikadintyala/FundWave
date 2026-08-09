import { useAIInsights } from '@/hooks/useAIInsights';
import { Card, CardHeader, CardBody, Badge, Skeleton } from '@/components/ui';

// ── Icons ────────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500" aria-hidden="true" style={{ color: 'var(--color-success)' }}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500" aria-hidden="true" style={{ color: 'var(--color-warning)' }}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500" aria-hidden="true" style={{ color: 'var(--color-primary)' }}>
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </svg>
);

const LightbulbIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500" aria-hidden="true" style={{ color: 'var(--color-warning)' }}>
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2v1" />
    <path d="M12 15a5.5 5.5 0 1 0-7.78-7.78" />
  </svg>
);

const ScoreRing = ({ score = 0 }: { score?: number }) => {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  
  // Determine color based on score
  let color = 'var(--color-success)';
  if (score < 40) color = 'var(--color-danger)';
  else if (score < 60) color = 'var(--color-warning)';
  else if (score < 80) color = 'var(--color-primary)';

  return (
    <svg width="110" height="110" viewBox="0 0 110 110" aria-label={`Score: ${score}`}>
      <circle cx="55" cy="55" r={r} fill="none" stroke="var(--color-border)" strokeWidth="10" />
      <circle
        cx="55" cy="55" r={r} fill="none"
        stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 55 55)"
        style={{ transition: 'stroke-dasharray var(--transition-slow)' }}
      />
      <text x="55" y="62" textAnchor="middle" fontSize="24" fontWeight="700" fill="var(--color-text)">{score}</text>
    </svg>
  );
};

// ── Component ────────────────────────────────────────────────────────────────

const Insights = () => {
  const { insights, isLoading, error } = useAIInsights();

  // Helper to interpret the score
  const getScoreLabel = (score: number) => {
    if (score >= 80) return { text: 'Excellent', variant: 'success' as const };
    if (score >= 60) return { text: 'Good', variant: 'info' as const };
    if (score >= 40) return { text: 'Needs Attention', variant: 'warning' as const };
    return { text: 'Needs Improvement', variant: 'danger' as const };
  };

  return (
    <div className="page page-enter">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="page__header" style={{ marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 className="page__title gradient-text">AI Financial Insights</h1>
          <p className="page__subtitle">Understand your financial habits and get personalized recommendations.</p>
        </div>
      </div>

      {/* ── Error State ─────────────────────────────────────────────────────── */}
      {error && (
        <Card variant="elevated" padding="lg" style={{ marginBottom: 'var(--space-6)', borderLeft: '4px solid var(--color-danger)' }}>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <AlertIcon />
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text)' }}>Error Loading Insights</h3>
              </div>
              <p style={{ color: 'var(--color-text-secondary)' }}>{error}</p>
              <button 
                className="btn btn--primary" 
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ── Content Grid ────────────────────────────────────────────────────── */}
      <div className="ai-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-6)' }}>
        
        {/* Top Row: Score & Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
          {/* Health Score */}
          <Card variant="elevated" padding="lg">
            <CardHeader>
              <div className="card-section-header">
                <h2 className="card-section-title">Financial Health Score</h2>
                {!isLoading && insights && (
                  <Badge variant={getScoreLabel(insights.overallScore).variant} size="sm">
                    {getScoreLabel(insights.overallScore).text}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                  <div style={{ width: '110px', height: '110px', borderRadius: '50%', backgroundColor: 'var(--color-border)', opacity: 0.5 }}></div>
                  <Skeleton variant="line" lines={2} />
                </div>
              ) : insights ? (
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                  <ScoreRing score={insights.overallScore} />
                  <div>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
                      This score is based on your income, expenses, and savings habits.
                    </p>
                  </div>
                </div>
              ) : null}
            </CardBody>
          </Card>

          {/* AI Summary */}
          <Card variant="elevated" padding="lg" style={{ background: 'linear-gradient(135deg, var(--color-card) 0%, var(--color-bg) 100%)' }}>
            <CardHeader>
              <div className="card-section-header">
                <h2 className="card-section-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span>✨</span> AI Summary
                </h2>
              </div>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <Skeleton variant="line" lines={4} />
              ) : insights ? (
                <p style={{ color: 'var(--color-text)', fontSize: 'var(--text-base)', lineHeight: 1.6 }}>
                  {insights.summary}
                </p>
              ) : null}
            </CardBody>
          </Card>
        </div>

        {/* Strengths & Concerns Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
          {/* Strengths */}
          <Card variant="default" padding="lg">
            <CardHeader>
              <div className="card-section-header">
                <h2 className="card-section-title">What's Going Well</h2>
              </div>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <Skeleton variant="line" lines={3} />
              ) : insights ? (
                insights.strengths.length > 0 ? (
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {insights.strengths.map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                        <div style={{ marginTop: '2px' }}><CheckIcon /></div>
                        <span style={{ color: 'var(--color-text)', lineHeight: 1.5 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: 'var(--color-text-muted)' }}>No specific strengths identified at this time.</p>
                )
              ) : null}
            </CardBody>
          </Card>

          {/* Concerns */}
          <Card variant="default" padding="lg">
            <CardHeader>
              <div className="card-section-header">
                <h2 className="card-section-title">Areas to Watch</h2>
              </div>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <Skeleton variant="line" lines={3} />
              ) : insights ? (
                insights.concerns.length > 0 ? (
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {insights.concerns.map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                        <div style={{ marginTop: '2px' }}><AlertIcon /></div>
                        <span style={{ color: 'var(--color-text)', lineHeight: 1.5 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: 'var(--color-text-muted)' }}>No major concerns identified. Keep up the good work!</p>
                )
              ) : null}
            </CardBody>
          </Card>
        </div>

        {/* Recommendations */}
        <Card variant="default" padding="lg">
          <CardHeader>
            <div className="card-section-header">
              <h2 className="card-section-title">Recommended Actions</h2>
            </div>
          </CardHeader>
          <CardBody>
            {isLoading ? (
              <Skeleton variant="line" lines={3} />
            ) : insights ? (
              insights.recommendations.length > 0 ? (
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {insights.recommendations.map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', padding: 'var(--space-3)', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ marginTop: '2px' }}><ArrowRightIcon /></div>
                      <span style={{ color: 'var(--color-text)', lineHeight: 1.5, fontWeight: 500 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: 'var(--color-text-muted)' }}>No specific recommendations at this time.</p>
              )
            ) : null}
          </CardBody>
        </Card>

        {/* Savings Tip */}
        <Card variant="elevated" padding="lg" style={{ borderLeft: '4px solid var(--color-warning)' }}>
          <CardHeader>
            <div className="card-section-header">
              <h2 className="card-section-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <LightbulbIcon /> Savings Tip
              </h2>
            </div>
          </CardHeader>
          <CardBody>
            {isLoading ? (
              <Skeleton variant="line" lines={2} />
            ) : insights ? (
              <p style={{ color: 'var(--color-text)', fontSize: 'var(--text-lg)', fontWeight: 500, lineHeight: 1.6 }}>
                "{insights.savingsTip}"
              </p>
            ) : null}
          </CardBody>
        </Card>

      </div>
    </div>
  );
};

export default Insights;
