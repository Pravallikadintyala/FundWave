import { useTheme } from '@/context/ThemeContext';
import Breadcrumb from './Breadcrumb';
import UserMenu from './UserMenu';

interface TopNavbarProps {
  onMenuToggle: () => void;
  sidebarCollapsed: boolean;
}

const SunIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="8.5" cy="8.5" r="3" />
    <path d="M8.5 1v2M8.5 14v2M1 8.5h2M14 8.5h2M3.1 3.1l1.4 1.4M12.1 12.1l1.4 1.4M3.1 13.9l1.4-1.4M12.1 4.9l1.4-1.4" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a6 6 0 1 0 7 7z" />
  </svg>
);

const BellIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M13 8A4.5 4.5 0 0 0 4 8c0 4-2 5-2 5h13s-2-1-2-5" />
    <path d="M9.73 14a1.5 1.5 0 0 1-2.46 0" />
  </svg>
);

const HamburgerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor"
    strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
    <path d="M2 4.5h14M2 9h14M2 13.5h14" />
  </svg>
);

const TopNavbar = ({ onMenuToggle }: TopNavbarProps) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="topnav" role="banner">
      <div className="topnav__left">
        <button
          className="topnav__menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
        >
          <HamburgerIcon />
        </button>
        <Breadcrumb />
      </div>

      <div className="topnav__right">
        {/* Theme toggle */}
        <button
          className="topnav__icon-btn"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Notifications */}
        <button className="topnav__icon-btn topnav__notif" aria-label="Notifications">
          <BellIcon />
          <span className="topnav__notif-dot" aria-hidden="true" />
        </button>

        {/* User menu */}
        <UserMenu />
      </div>
    </header>
  );
};

export default TopNavbar;
