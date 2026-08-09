/**
 * LandingNavigation — the top navigation bar for the landing page.
 *
 * Shows logo, features link, and auth CTAs.
 * If authenticated, shows user initials + dropdown instead of Sign In button.
 */

import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

const LogoMark = () => (
  <svg width="24" height="24" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <rect width="26" height="26" rx="8" fill="var(--color-primary)" />
    <path d="M7 13h12M13 7l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LandingNavigation = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    setDropdownOpen(false);
    logout();
    navigate('/');
  };

  return (
    <nav className="landing-nav" role="navigation" aria-label="Main navigation">
      <div className="landing-nav__container">
        {/* Logo */}
        <button
          type="button"
          className="landing-nav__logo"
          onClick={() => navigate('/')}
          aria-label="FundWave home"
        >
          <LogoMark />
          <span className="landing-nav__logo-text">FundWave</span>
        </button>

        {/* Center: Features link */}
        <div className="landing-nav__center">
          <a href="#features" className="landing-nav__link">Features</a>
        </div>

        {/* Right: Auth CTAs or user menu */}
        <div className="landing-nav__actions">
          {isAuthenticated ? (
            <div className="landing-nav__user-menu">
              <button
                type="button"
                className="landing-nav__user-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
              >
                <Avatar
                  alt={user?.fullName || user?.username}
                  initials={
                    user?.fullName
                      ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
                      : (user?.username || 'U')[0].toUpperCase()
                  }
                />
              </button>
              {dropdownOpen && (
                <div className="landing-nav__dropdown" role="menu">
                  <button
                    type="button"
                    className="landing-nav__dropdown-item"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/dashboard');
                    }}
                    role="menuitem"
                  >
                    Dashboard
                  </button>
                  <button
                    type="button"
                    className="landing-nav__dropdown-item"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/profile');
                    }}
                    role="menuitem"
                  >
                    Profile
                  </button>
                  <hr className="landing-nav__dropdown-sep" />
                  <button
                    type="button"
                    className="landing-nav__dropdown-item landing-nav__dropdown-item--danger"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default LandingNavigation;
