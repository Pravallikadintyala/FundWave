/**
 * LandingFeatures — premium feature cards with animated icons and gradient accents.
 */

// ─── Icons ─────────────────────────────────────────────────────────────────────

const TransactionIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="6" width="24" height="20" rx="3" />
    <path d="M4 12h24" />
    <path d="M8 18h6M16 18h8" />
    <circle cx="20" cy="25" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 24h24M8 24V10M14 24v-8M20 24v-5M26 24v-12" />
    <circle cx="8" cy="9" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="14" cy="15" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="20" cy="18" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="26" cy="11" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const SavingsIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M26 14c0 7-10 14-10 14S6 21 6 14a10 10 0 0120 0z" />
    <path d="M16 10v8M12 14h8" />
  </svg>
);

const AIIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="16,4 20,12 28,13 22,20 24,28 16,24 8,28 10,20 4,13 12,12" />
    <circle cx="16" cy="16" r="3" fill="currentColor" stroke="none" />
  </svg>
);

// ─── Feature card ──────────────────────────────────────────────────────────────

interface FeatureConfig {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
}

const features: FeatureConfig[] = [
  {
    icon: <TransactionIcon />,
    title: 'Smart Transaction Tracking',
    description: 'Track income and expenses with intelligent categorization. See where every rupee goes with powerful filtering and search.',
    badge: 'Core',
    gradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
    iconBg: 'var(--color-primary-muted)',
    iconColor: 'var(--color-primary)',
  },
  {
    icon: <AnalyticsIcon />,
    title: 'Financial Analytics',
    description: 'Understand your spending through beautiful charts and summaries. Spot trends and patterns that matter to your goals.',
    badge: 'Insights',
    gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    iconBg: 'var(--color-secondary-muted)',
    iconColor: 'var(--color-secondary)',
  },
  {
    icon: <SavingsIcon />,
    title: 'Savings Goals',
    description: 'Set meaningful goals, contribute money, and monitor progress with visual milestones. Reach your financial dreams faster.',
    badge: 'Goals',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    iconBg: 'var(--color-success-muted)',
    iconColor: 'var(--color-success)',
  },
  {
    icon: <AIIcon />,
    title: 'AI Financial Insights',
    description: 'Get personalized recommendations powered by Gemini AI. Actionable insights that adapt to your unique financial situation.',
    badge: 'AI',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    iconBg: 'var(--color-warning-muted)',
    iconColor: 'var(--color-warning)',
  },
];

const LandingFeatures = () => (
  <section className="lfeat" id="features" aria-label="Features section">
    <div className="lfeat__inner">
      <div className="lfeat__header">
        <div className="lfeat__eyebrow">Everything you need</div>
        <h2 className="lfeat__title">Built for financial clarity</h2>
        <p className="lfeat__subtitle">
          A complete toolkit to understand, manage, and grow your money — all in one beautifully designed space.
        </p>
      </div>

      <div className="lfeat__grid">
        {features.map((f, i) => (
          <article key={i} className="lfeat-card" style={{ '--card-gradient': f.gradient } as React.CSSProperties}>
            <div className="lfeat-card__top">
              <div className="lfeat-card__icon" style={{ background: f.iconBg, color: f.iconColor }}>
                {f.icon}
              </div>
              <span className="lfeat-card__badge" style={{ background: f.iconBg, color: f.iconColor }}>
                {f.badge}
              </span>
            </div>
            <h3 className="lfeat-card__title">{f.title}</h3>
            <p className="lfeat-card__desc">{f.description}</p>
            <div className="lfeat-card__bar" style={{ background: f.gradient }} aria-hidden="true" />
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default LandingFeatures;
