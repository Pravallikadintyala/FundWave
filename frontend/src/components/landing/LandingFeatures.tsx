/**
 * LandingFeatures — the four core features grid.
 */

import Card, { CardBody } from '@/components/ui/Card';

// ─── Icons ─────────────────────────────────────────────────────────────────────

const TransactionIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="6" width="24" height="20" rx="2" />
    <path d="M4 12h24" />
    <path d="M8 18h6M16 18h8" />
    <circle cx="20" cy="25" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 24h24M8 24V10M14 24v-8M20 24v-5M26 24v-12" />
    <circle cx="8" cy="9" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="14" cy="15" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="20" cy="11" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="26" cy="11" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const SavingsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="16" cy="12" r="8" />
    <path d="M16 8v8M12 12h8" />
    <path d="M10 22h12a2 2 0 012 2v2a2 2 0 01-2 2H10a2 2 0 01-2-2v-2a2 2 0 012-2z" />
  </svg>
);

const AIIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="16" cy="16" r="12" />
    <path d="M16 10v12M10 16h12" />
    <circle cx="16" cy="16" r="2" fill="currentColor" stroke="none" />
    <path d="M22 10l2-2M10 22l-2 2M10 10l-2-2M22 22l2 2" />
  </svg>
);

// ─── Feature card ──────────────────────────────────────────────────────────────

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'primary' | 'secondary' | 'success' | 'warning';
}

const colorClass: Record<FeatureProps['color'], string> = {
  primary: 'landing-feature--primary',
  secondary: 'landing-feature--secondary',
  success: 'landing-feature--success',
  warning: 'landing-feature--warning',
};

const Feature = ({ icon, title, description, color }: FeatureProps) => (
  <Card variant="default" padding="lg" className={['landing-feature', colorClass[color]].filter(Boolean).join(' ')}>
    <CardBody>
      <div className="landing-feature__icon">{icon}</div>
      <h3 className="landing-feature__title">{title}</h3>
      <p className="landing-feature__desc">{description}</p>
    </CardBody>
  </Card>
);

// ─── Features grid ────────────────────────────────────────────────────────────

const LandingFeatures = () => (
  <section className="landing-features" id="features" aria-label="Features section">
    <div className="landing-features__header">
      <h2 className="landing-features__title">Built for financial clarity</h2>
      <p className="landing-features__subtitle">
        Everything you need to understand and manage your money, all in one place.
      </p>
    </div>

    <div className="landing-features__grid">
      <Feature
        icon={<TransactionIcon />}
        title="Smart Transaction Tracking"
        description="Track income and expenses with clear categories and powerful filtering. See where your money goes."
        color="primary"
      />
      <Feature
        icon={<AnalyticsIcon />}
        title="Financial Analytics"
        description="Understand your spending through clear charts and summaries. Spot trends and patterns."
        color="secondary"
      />
      <Feature
        icon={<SavingsIcon />}
        title="Savings Goals"
        description="Set goals, contribute money, and monitor your progress. Reach your financial milestones."
        color="success"
      />
      <Feature
        icon={<AIIcon />}
        title="AI Financial Insights"
        description="Get personalized financial insights powered by Gemini. Actionable recommendations."
        color="warning"
      />
    </div>
  </section>
);

export default LandingFeatures;
