import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/**
 * PublicRoute — wraps auth pages (login, register, forgot-password).
 *
 * - While auth state is loading → render nothing (prevents flash).
 * - If user is already authenticated → redirect to /dashboard.
 * - Otherwise → render the child route.
 */
const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  return isAuthenticated
    ? <Navigate to="/dashboard" replace />
    : <Outlet />;
};

export default PublicRoute;
