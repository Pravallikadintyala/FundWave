import { NavLink, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const routeLabels: Record<string, string> = {
  '/dashboard':     'Dashboard',
  '/transactions':  'Transactions',
  '/savings-goals': 'Savings Goals',
  '/ai-insights':   'AI Insights',
  '/profile':       'Profile',
};

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor"
    strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 3l4 4-4 4" />
  </svg>
);

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  const location = useLocation();

  const resolved: BreadcrumbItem[] = items ?? [
    { label: 'Home', href: '/dashboard' },
    { label: routeLabels[location.pathname] ?? location.pathname },
  ];

  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol className="breadcrumb__list">
        {resolved.map((item, i) => {
          const isLast = i === resolved.length - 1;
          return (
            <li key={i} className="breadcrumb__item">
              {i > 0 && <ChevronIcon />}
              {isLast || !item.href ? (
                <span className={isLast ? 'breadcrumb__current' : 'breadcrumb__link'}>
                  {item.label}
                </span>
              ) : (
                <NavLink to={item.href} className="breadcrumb__link">
                  {item.label}
                </NavLink>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
