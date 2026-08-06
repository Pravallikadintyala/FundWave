import { Card, CardHeader, CardBody, Badge, Skeleton } from '@/components/ui';

const ScoreRing = ({ score = 0 }: { score?: number }) => {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width="110" height="110" viewBox="0 0 110 110" aria-label={`Score: ${score}`}>
      <circle cx="55" cy="55" r={r} fill="none" stroke="var(--color-border)" strokeWidth="10" />
      <circle
        cx="55" cy="55" r={r} fill="none"
        stroke="var(--color-primary)" strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 55 55)"
        style={{ transition: 'stroke-dasharray var(--transition-slow)' }}
      />
      <text x="55" y="60" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--color-text)">{score}</text>
    </svg>
  );
};

const sections = [
  { key: 'strengths',       label: 'Strengths',        variant: 'success' as const, icon: '✦' },
  { key: 'concerns',        label: 'Concerns',          variant: 'warning' as const, icon: '⚠' },
  { key: 'recommendations', label: 'Recommendations',   variant: 'info'    as const, icon: '→' },
];

const AIInsightsPage = () => (
  <div className="page page-enter">
    <div className="page__header">
      <div>
        <h1 className="page__title gradient-text">AI Financial Insights</h1>
        <p className="page__subtitle">Powered by Gemini — personalised analysis of your finances.</p>
      </div>
      <Badge variant="info" size="md" dot>Beta</Badge>
    </div>

    <div className="ai-grid">
      {/* Score card */}
      <Card variant="elevated" padding="lg" className="ai-grid__score">
        <CardHeader>
          <div className="card-section-header">
            <h2 className="card-section-title">Financial Health Score</h2>
            <Badge variant="neutral" size="sm">Awaiting data</Badge>
          </div>
        </CardHeader>
        <CardBody>
          <div className="ai-score-wrap">
            <ScoreRing score={0} />
            <div className="ai-score-desc">
              <p className="body">Your score will reflect once we have enough transaction data.</p>
              <Skeleton variant="line" lines={3} />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tip card */}
      <Card variant="elevated" padding="lg" className="ai-grid__tip">
        <CardHeader>
          <div className="card-section-header">
            <h2 className="card-section-title">💡 Savings Tip</h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="ai-tip-placeholder">
            <Skeleton variant="line" lines={4} />
          </div>
        </CardBody>
      </Card>

      {/* Detail sections */}
      {sections.map(s => (
        <Card key={s.key} variant="default" padding="lg">
          <CardHeader>
            <div className="card-section-header">
              <h2 className="card-section-title">
                <span style={{ marginRight: 8 }}>{s.icon}</span>{s.label}
              </h2>
              <Badge variant={s.variant} size="sm">0 items</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <Skeleton variant="line" lines={3} />
          </CardBody>
        </Card>
      ))}
    </div>
  </div>
);

export default AIInsightsPage;
