import { NavLink } from 'react-router-dom';

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

/* ── Inline SVG icons ─────────────────────────────────────── */
const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="1" width="7" height="7" rx="1.5" />
    <rect x="10" y="1" width="7" height="7" rx="1.5" />
    <rect x="1" y="10" width="7" height="7" rx="1.5" />
    <rect x="10" y="10" width="7" height="7" rx="1.5" />
  </svg>
);
const TransactionsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 5h12M3 9h8M3 13h5" />
    <path d="M14 11l2 2-2 2" />
    <path d="M16 13H11" />
  </svg>
);
const SavingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="9" r="7.5" />
    <path d="M9 5.5v3l2 2" />
    <circle cx="9" cy="9" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const AIIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 2a7 7 0 1 1 0 14A7 7 0 0 1 9 2z" />
    <path d="M6 9h6M9 6v6" />
    <circle cx="9" cy="9" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);
const ProfileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="6.5" r="3" />
    <path d="M2.5 16c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" />
  </svg>
);
const CollapseIcon = ({ collapsed }: { collapsed: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 300ms ease' }}>
    <path d="M10 4L6 8l4 4" />
  </svg>
);
const LogoMark = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <rect width="26" height="26" rx="8" fill="var(--color-primary)" />
    <path d="M7 13h12M13 7l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const navItems = [
  { to: '/dashboard',     label: 'Dashboard',      Icon: DashboardIcon },
  { to: '/transactions',  label: 'Transactions',   Icon: TransactionsIcon },
  { to: '/savings-goals', label: 'Savings Goals',  Icon: SavingsIcon },
  { to: '/insights',      label: 'AI Insights',    Icon: AIIcon },
  { to: '/settings',      label: 'Settings',       Icon: ProfileIcon },
];

const Sidebar = ({ collapsed, onCollapse, mobileOpen, onMobileClose }: SidebarProps) => (
  <>
    {/* Mobile overlay */}
    {mobileOpen && (
      <div className="sidebar-overlay" onClick={onMobileClose} aria-hidden="true" />
    )}

    <aside
      className={[
        'sidebar',
        collapsed ? 'sidebar--collapsed' : '',
        mobileOpen ? 'sidebar--mobile-open' : '',
      ].filter(Boolean).join(' ')}
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div className="sidebar__brand">
        <LogoMark />
        {!collapsed && (
          <span className="sidebar__brand-name">FundWave</span>
        )}
      </div>

      {/* Nav */}
      <nav className="sidebar__nav" role="navigation" aria-label="Primary">
        <ul className="sidebar__nav-list" role="list">
          {navItems.map(({ to, label, Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  ['sidebar__nav-item', isActive ? 'sidebar__nav-item--active' : ''].filter(Boolean).join(' ')
                }
                title={collapsed ? label : undefined}
                onClick={onMobileClose}
              >
                <span className="sidebar__nav-icon"><Icon /></span>
                {!collapsed && <span className="sidebar__nav-label">{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse toggle — desktop only */}
      <div className="sidebar__footer">
        <button
          className="sidebar__collapse-btn"
          onClick={() => onCollapse(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <CollapseIcon collapsed={collapsed} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  </>
);

export default Sidebar;
