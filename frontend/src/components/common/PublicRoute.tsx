import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/**
 * PublicRoute — wraps auth pages (login, register, forgot-password).
 *
 * - While auth state is loading → show a minimal loader (prevents flash).
 * - If user is already authenticated → redirect to /dashboard.
 * - Otherwise → render the child route.
 */
const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="app-loader">
        <div className="app-loader__inner">
          <svg width="40" height="40" viewBox="0 0 28 28" fill="none" className="app-loader__logo" aria-hidden="true">
            <rect width="28" height="28" rx="9" fill="var(--color-primary)" />
            <path d="M8 14h12M14 8l6 6-6 6" stroke="white" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="app-loader__dots" aria-label="Loading">
            <span /><span /><span />
          </div>
        </div>
      </div>
    );
  }

  return isAuthenticated
    ? <Navigate to="/dashboard" replace />
    : <Outlet />;
};

export default PublicRoute;
