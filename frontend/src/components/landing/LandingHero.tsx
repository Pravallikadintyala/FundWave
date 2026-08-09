/**
 * LandingHero — hero section with animated gradient background,
 * floating dashboard preview cards, and premium CTAs.
 */

import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M3 8h10M9 5l4 3-4 3" />
  </svg>
);

/* Mini sparkline chart for visual interest */
const SparkLine = () => (
  <svg viewBox="0 0 120 40" fill="none" preserveAspectRatio="none" className="lh-sparkline" aria-hidden="true">
    <defs>
      <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d="M0 30 C15 28 20 15 35 18 S60 10 75 8 S95 14 120 5" stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M0 30 C15 28 20 15 35 18 S60 10 75 8 S95 14 120 5 V40 H0Z" fill="url(#sparkGrad)" />
  </svg>
);

const LandingHero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handlePrimary = () => {
    navigate(isAuthenticated ? '/dashboard' : '/register');
  };

  return (
    <section className="lhero" aria-label="Hero section">
      {/* Background mesh gradient */}
      <div className="lhero__bg" aria-hidden="true">
        <svg
          className="lhero__bg-waves"
          viewBox="0 0 2000 1000"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* We use a long path that repeats its pattern, so animating it -50% loops perfectly */}
          <path
            className="lhero__wave-path lhero__wave-path--1"
            d="M 0 500 Q 250 300 500 500 T 1000 500 T 1500 500 T 2000 500 T 2500 500 T 3000 500 T 3500 500 T 4000 500"
          />
          <path
            className="lhero__wave-path lhero__wave-path--2"
            d="M 0 600 Q 250 800 500 600 T 1000 600 T 1500 600 T 2000 600 T 2500 600 T 3000 600 T 3500 600 T 4000 600"
          />
          <path
            className="lhero__wave-path lhero__wave-path--3"
            d="M 0 400 Q 250 150 500 400 T 1000 400 T 1500 400 T 2000 400 T 2500 400 T 3000 400 T 3500 400 T 4000 400"
          />
        </svg>
        <div className="lhero__bg-grid" />
      </div>

      <div className="lhero__inner">
        {/* Left: Text content */}
        <div className="lhero__content">
          <div className="lhero__badge">
            <span className="lhero__badge-dot" aria-hidden="true" />
            AI-Powered Finance Platform
          </div>

          <h1 className="lhero__title">
            Your finances,<br />
            <span className="lhero__title-accent">smarter by design.</span>
          </h1>

          <p className="lhero__subtitle">
            Track spending, hit savings goals, and get AI-powered insights — all in one elegant space that works as hard as you do.
          </p>

          <div className="lhero__ctas">
            <button
              className="lhero__btn lhero__btn--primary"
              onClick={handlePrimary}
              id="hero-primary-cta"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Start for Free'}
              <ArrowIcon />
            </button>
            <button
              className="lhero__btn lhero__btn--ghost"
              onClick={() => navigate('/login')}
              id="hero-signin-cta"
            >
              Sign In
            </button>
          </div>


        </div>

        {/* Right: Dashboard preview */}
        <div className="lhero__visual" aria-hidden="true">
          {/* Main card */}
          <div className="lhero__card lhero__card--main">
            <div className="lhero__card-header">
              <div className="lhero__card-dot lhero__card-dot--red" />
              <div className="lhero__card-dot lhero__card-dot--yellow" />
              <div className="lhero__card-dot lhero__card-dot--green" />
              <span className="lhero__card-title">FundWave Dashboard</span>
            </div>

            {/* KPI row */}
            <div className="lhero__kpi-row">
              {[
                { label: 'Balance', value: '₹2,45,000', color: 'var(--color-primary)', up: true },
                { label: 'Income', value: '₹85,000', color: 'var(--color-success)', up: true },
                { label: 'Expenses', value: '₹34,200', color: 'var(--color-danger)', up: false },
              ].map(k => (
                <div key={k.label} className="lhero__kpi">
                  <span className="lhero__kpi-label">{k.label}</span>
                  <span className="lhero__kpi-value" style={{ color: k.color }}>{k.value}</span>
                  <span className="lhero__kpi-trend" style={{ color: k.up ? 'var(--color-success)' : 'var(--color-danger)' }}>
                    {k.up ? '↑' : '↓'} {k.up ? '12.4%' : '3.1%'}
                  </span>
                </div>
              ))}
            </div>

            {/* Chart area */}
            <div className="lhero__chart-area">
              <div className="lhero__chart-label">Monthly Income vs Expenses</div>
              <SparkLine />
              <div className="lhero__chart-bars">
                {[65, 45, 70, 55, 80, 60, 75, 50, 85, 65, 90, 72].map((h, i) => (
                  <div key={i} className="lhero__bar-group">
                    <div className="lhero__bar lhero__bar--income" style={{ height: `${h}%` }} />
                    <div className="lhero__bar lhero__bar--expense" style={{ height: `${h * 0.45}%` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating AI insight chip */}
          <div className="lhero__chip lhero__chip--ai">
            <span className="lhero__chip-icon">✨</span>
            <div>
              <div className="lhero__chip-title">AI Insight</div>
              <div className="lhero__chip-text">Save ₹8K more this month</div>
            </div>
          </div>

          {/* Floating savings progress chip */}
          <div className="lhero__chip lhero__chip--savings">
            <span className="lhero__chip-icon">🎯</span>
            <div>
              <div className="lhero__chip-title">Emergency Fund</div>
              <div className="lhero__chip-progress">
                <div className="lhero__chip-bar">
                  <div className="lhero__chip-fill" style={{ width: '68%' }} />
                </div>
                <span className="lhero__chip-pct">68%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
