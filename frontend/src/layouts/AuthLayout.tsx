import { Outlet, NavLink } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="2.75" />
    <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" />
  </svg>
);
const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round">
    <path d="M12.5 9A5 5 0 0 1 6 2.5a5.5 5.5 0 1 0 6.5 6.5z" />
  </svg>
);
const LogoMark = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect width="28" height="28" rx="9" fill="var(--color-primary)" />
    <path d="M8 14h12M14 8l6 6-6 6" stroke="white" strokeWidth="2.1"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AuthLayout = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="auth-layout">
      {/* Left brand panel */}
      <div className="auth-layout__panel" aria-hidden="true">
        <div className="auth-layout__panel-inner">
          <div className="auth-layout__logo">
            <LogoMark />
            <span className="auth-layout__logo-name">FundWave</span>
          </div>
          <div className="auth-layout__panel-text">
            <h1 className="auth-layout__panel-heading">
              Your finances,<br />beautifully managed.
            </h1>
            <p className="auth-layout__panel-sub">
              Track spending, hit savings goals, and get AI-powered insights —
              all in one elegant space.
            </p>
          </div>
          <ul className="auth-layout__features" aria-label="Key features">
            {['Smart transaction tracking', 'AI financial insights', 'Savings goal automation'].map(f => (
              <li key={f} className="auth-layout__feature-item">
                <span className="auth-layout__feature-check" aria-hidden="true">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-layout__form-panel">
        {/* Theme toggle */}
        <div className="auth-layout__form-header">
          <NavLink to="/" className="auth-layout__back-link">← Back to home</NavLink>
          <button
            className="topnav__icon-btn"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        <div className="auth-layout__form-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
