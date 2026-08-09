/**
 * LandingFooter — the footer with links and copyright.
 */

import { useNavigate } from 'react-router-dom';

const LandingFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="landing-footer" role="contentinfo">
      <div className="landing-footer__container">
        <div className="landing-footer__content">
          {/* Brand */}
          <div className="landing-footer__section">
            <h3 className="landing-footer__brand">FundWave</h3>
            <p className="landing-footer__tagline">
              Your finances, smarter by design.
            </p>
          </div>

          {/* Links */}
          <div className="landing-footer__links">
            <div className="landing-footer__column">
              <h4 className="landing-footer__column-title">Product</h4>
              <ul className="landing-footer__list">
                <li><a href="#features" className="landing-footer__link">Features</a></li>
                <li><a href="#" className="landing-footer__link">Pricing</a></li>
              </ul>
            </div>

            <div className="landing-footer__column">
              <h4 className="landing-footer__column-title">Company</h4>
              <ul className="landing-footer__list">
                <li><a href="#" className="landing-footer__link">About</a></li>
                <li><a href="#" className="landing-footer__link">Blog</a></li>
              </ul>
            </div>

            <div className="landing-footer__column">
              <h4 className="landing-footer__column-title">Legal</h4>
              <ul className="landing-footer__list">
                <li><a href="#" className="landing-footer__link">Privacy</a></li>
                <li><a href="#" className="landing-footer__link">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="landing-footer__bottom">
          <p className="landing-footer__copyright">
            © 2026 FundWave. All rights reserved.
          </p>
          <div className="landing-footer__bottom-links">
            <button
              type="button"
              className="landing-footer__bottom-link"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
            <button
              type="button"
              className="landing-footer__bottom-link landing-footer__bottom-link--primary"
              onClick={() => navigate('/register')}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
