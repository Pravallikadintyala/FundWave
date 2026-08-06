import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import TransactionsPage from '@/pages/TransactionsPage';
import SavingsGoalsPage from '@/pages/SavingsGoalsPage';
import ProfilePage from '@/pages/ProfilePage';
import NotFoundPage from '@/pages/NotFoundPage';

/**
 * AppRouter — central route configuration.
 *
 * Route groups:
 *  Public     /          LandingPage
 *  Auth       /login     LoginPage
 *             /register  RegisterPage
 *  Protected  /dashboard DashboardPage
 *             /transactions
 *             /savings-goals
 *             /profile
 *  Fallback   *          NotFoundPage
 */
const AppRouter = () => (
  <Routes>
    {/* Public landing */}
    <Route path="/" element={<LandingPage />} />

    {/* Auth pages — centred card layout */}
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Route>

    {/* Protected pages — dashboard shell layout */}
    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/savings-goals" element={<SavingsGoalsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Route>

    {/* 404 */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRouter;
