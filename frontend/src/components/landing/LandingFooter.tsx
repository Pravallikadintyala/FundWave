/**
 * LandingFooter — premium footer with CTA section and gradient top border.
 */

import { useNavigate } from 'react-router-dom';

const LogoMark = () => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <rect width="28" height="28" rx="9" fill="var(--color-primary)" />
    <path d="M8 14h12M14 8l6 6-6 6" stroke="white" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LandingFooter = () => {
  const navigate = useNavigate();

  return (
    <footer id="contact" className="lfooter" role="contentinfo">
      {/* CTA Banner */}
      <div className="lfooter__cta">
        <div className="lfooter__cta-inner">
          <div className="lfooter__cta-glow" aria-hidden="true" />
          <div className="lfooter__cta-content">
            <h2 className="lfooter__cta-title">Ready to take control of your finances?</h2>
            <p className="lfooter__cta-sub">Start tracking your personal finances and take control of your budget today.</p>
            <div className="lfooter__cta-btns">
              <button className="lfooter__cta-btn lfooter__cta-btn--primary" onClick={() => navigate('/register')}>
                Start for Free
              </button>
              <button className="lfooter__cta-btn lfooter__cta-btn--ghost" onClick={() => navigate('/login')}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer body */}
      <div className="lfooter__body">
        <div className="lfooter__inner">
          <div className="lfooter__brand">
            <div className="lfooter__brand-logo">
              <LogoMark />
              <span className="lfooter__brand-name">FundWave</span>
            </div>
            <p className="lfooter__brand-desc">
              Your personal finance platform for smarter, AI-powered money management.
            </p>
          </div>

          <div className="lfooter__contact" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div className="lfooter__col-title">Contact</div>
            <p className="lfooter__brand-desc">
              Contact me at <a href="mailto:pravallikad730@gmail.com" className="lfooter__link" style={{ textDecoration: 'underline' }}>pravallikad730@gmail.com</a>.
            </p>
          </div>
        </div>

        <div className="lfooter__bottom">
          <p className="lfooter__copy">© 2026 FundWave</p>
          <p className="lfooter__made">Made with ♥ for smart finance</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
