import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/**
 * ProtectedRoute — renders children only for authenticated users.
 * Unauthenticated users are redirected to /login.
 * While auth state is loading, shows a full-screen branded loader.
 */
const ProtectedRoute = () => {
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

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
