/**
 * LandingHero — the hero section with headline, supporting text, and dual CTAs.
 *
 * If authenticated, the primary CTA links to /dashboard; otherwise /register.
 */

import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M3 8h10M9 5l4 3-4 3" />
  </svg>
);

const LandingHero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handlePrimary = () => {
    navigate(isAuthenticated ? '/dashboard' : '/register');
  };

  return (
    <section className="landing-hero" aria-label="Hero section">
      <div className="landing-hero__content">
        <h1 className="landing-hero__title">Your finances, smarter by design.</h1>
        <p className="landing-hero__subtitle">
          Track spending, hit savings goals, and get AI-powered insights — all in one elegant space.
        </p>

        <div className="landing-hero__ctas">
          <Button
            size="lg"
            variant="primary"
            onClick={handlePrimary}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/login')}
          >
            <span>Sign In</span>
            <span className="btn__icon"><ArrowIcon /></span>
          </Button>
        </div>

        <p className="landing-hero__trust">
          Join thousands managing their finances with clarity and confidence.
        </p>
      </div>

      <div className="landing-hero__visual" aria-hidden="true">
        <div className="landing-hero__graphic">
          <svg viewBox="0 0 300 300" className="landing-hero__illustration">
            {/* Floating cards effect */}
            <g opacity="0.8">
              <rect x="20" y="40" width="120" height="100" rx="12" fill="var(--color-primary-muted)" stroke="var(--color-primary)" strokeWidth="1.5" />
              <rect x="30" y="50" width="100" height="12" rx="6" fill="var(--color-primary)" opacity="0.3" />
              <rect x="30" y="70" width="80" height="8" rx="4" fill="var(--color-primary)" opacity="0.2" />
              <rect x="30" y="90" width="90" height="8" rx="4" fill="var(--color-primary)" opacity="0.2" />
              <rect x="30" y="110" width="70" height="8" rx="4" fill="var(--color-primary)" opacity="0.2" />
            </g>

            <g opacity="0.7" style={{ transform: 'translateY(40px)' }}>
              <rect x="160" y="80" width="120" height="100" rx="12" fill="var(--color-secondary-muted)" stroke="var(--color-secondary)" strokeWidth="1.5" />
              <circle cx="210" cy="110" r="24" fill="var(--color-secondary)" opacity="0.2" />
              <circle cx="235" cy="95" r="16" fill="var(--color-secondary)" opacity="0.3" />
              <path d="M180 140l15-8l15 8" stroke="var(--color-secondary)" strokeWidth="1.5" fill="none" />
            </g>

            <g opacity="0.9">
              <rect x="80" y="160" width="140" height="110" rx="12" fill="var(--color-success-muted)" stroke="var(--color-success)" strokeWidth="1.5" />
              <circle cx="150" cy="185" r="18" fill="var(--color-success)" opacity="0.3" />
              <line x1="100" y1="220" x2="200" y2="220" stroke="var(--color-success)" strokeWidth="2" opacity="0.4" />
              <line x1="100" y1="240" x2="200" y2="240" stroke="var(--color-success)" strokeWidth="2" opacity="0.4" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
