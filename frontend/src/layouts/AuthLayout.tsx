import { Outlet } from 'react-router-dom';

/**
 * AuthLayout — wrapper for unauthenticated pages (Login, Register).
 * Centres content vertically and horizontally.
 */
const AuthLayout = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-full max-w-md">
      <Outlet />
    </div>
  </div>
);

export default AuthLayout;
