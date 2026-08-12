/**
 * LandingNavigation — premium frosted-glass navigation bar.
 */

import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="8" cy="8" r="2.75" />
    <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" />
  </svg>
);
const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
    <path d="M12.5 9A5 5 0 0 1 6 2.5a5.5 5.5 0 1 0 6.5 6.5z" />
  </svg>
);

const LogoMark = () => (
  <svg width="30" height="30" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <rect width="28" height="28" rx="9" fill="var(--color-primary)" />
    <path d="M8 14h12M14 8l6 6-6 6" stroke="white" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LandingNavigation = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/');
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email || 'U')[0].toUpperCase();

  return (
    <nav className={['lnav', scrolled ? 'lnav--scrolled' : ''].filter(Boolean).join(' ')} role="navigation" aria-label="Main navigation">
      <div className="lnav__inner">
        {/* Logo */}
        <button type="button" className="lnav__logo" onClick={() => navigate('/')} aria-label="FundWave home">
          <LogoMark />
          <span className="lnav__logo-text">FundWave</span>
        </button>

        {/* Center nav links */}
        <div className="lnav__links">
          <a href="#features" className="lnav__link">Features</a>
          <a href="#preview" className="lnav__link">Preview</a>
          <a href="#contact" className="lnav__link">Contact Us</a>
        </div>

        {/* Actions */}
        <div className="lnav__actions">
          <button
            className="lnav__btn lnav__btn--ghost"
            style={{ padding: '0 8px', marginRight: '4px' }}
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          
          {isAuthenticated ? (
            <div className="lnav__user" style={{ position: 'relative' }}>
              <button
                type="button"
                className="lnav__user-btn"
                onClick={() => setDropdownOpen(v => !v)}
                aria-expanded={dropdownOpen}
                aria-haspopup="menu"
              >
                <span className="lnav__avatar">{initials}</span>
                <span className="lnav__user-name">{user?.fullName ?? user?.email}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M2 4l4 4 4-4" />
                </svg>
              </button>
              {dropdownOpen && (
                <>
                  <div className="lnav__overlay" onClick={() => setDropdownOpen(false)} />
                  <div className="lnav__dropdown" role="menu">
                    <button type="button" className="lnav__drop-item" role="menuitem" onClick={() => { setDropdownOpen(false); navigate('/dashboard'); }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="5" height="5" rx="1" /><rect x="9" y="2" width="5" height="5" rx="1" /><rect x="2" y="9" width="5" height="5" rx="1" /><rect x="9" y="9" width="5" height="5" rx="1" /></svg>
                      Dashboard
                    </button>
                    <button type="button" className="lnav__drop-item" role="menuitem" onClick={() => { setDropdownOpen(false); navigate('/settings'); }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="5" r="3" /><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" /></svg>
                      Settings
                    </button>
                    <div className="lnav__drop-sep" />
                    <button type="button" className="lnav__drop-item lnav__drop-item--danger" role="menuitem" onClick={handleLogout}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M10 8H2M6 5l-3 3 3 3M9 3h3a2 2 0 012 2v6a2 2 0 01-2 2H9" /></svg>
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <button className="lnav__btn lnav__btn--ghost" onClick={() => navigate('/login')}>Sign In</button>
              <button className="lnav__btn lnav__btn--primary" onClick={() => navigate('/register')}>Get Started</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default LandingNavigation;
