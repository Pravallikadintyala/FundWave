import { Routes, Route } from 'react-router-dom';
import ProtectedRoute        from '@/components/common/ProtectedRoute';
import PublicRoute           from '@/components/common/PublicRoute';
import AuthLayout            from '@/layouts/AuthLayout';
import DashboardLayout       from '@/layouts/DashboardLayout';
import LandingPage           from '@/pages/LandingPage';
import LoginPage             from '@/pages/LoginPage';
import RegisterPage          from '@/pages/RegisterPage';

import OAuthCallback        from '@/pages/OAuthCallback';
import DashboardPage         from '@/pages/DashboardPage';
import TransactionsPage      from '@/pages/TransactionsPage';
import SavingsGoalsPage      from '@/pages/SavingsGoalsPage';
import Insights              from '@/pages/Insights';
import SettingsPage          from '@/pages/SettingsPage';
import NotFoundPage          from '@/pages/NotFoundPage';

/**
 * AppRouter — central route configuration.
 *
 * Route groups:
 *  Public     /                   LandingPage
 *  Auth       /login              LoginPage         ← protected by PublicRoute
 *             /register           RegisterPage          (redirect to /dashboard
 *             /auth/callback      OAuthCallback
 *  Protected  /dashboard          DashboardPage     ← protected by ProtectedRoute
 *             /transactions       TransactionsPage      (redirect to /login
 *             /savings-goals      SavingsGoalsPage       if not authed)
 *             /ai-insights        AIInsightsPage
 *             /profile            ProfilePage
 *  Fallback   *                   NotFoundPage
 */
const AppRouter = () => (
  <Routes>
    {/* Public landing */}
    <Route path="/" element={<LandingPage />} />

    {/* Auth pages — redirect to /dashboard if already logged in */}
    <Route element={<PublicRoute />}>
      <Route element={<AuthLayout />}>
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/register"        element={<RegisterPage />} />
      </Route>
    </Route>

    {/* OAuth callback — standalone, no PublicRoute guard */}
    <Route path="/auth/callback" element={<OAuthCallback />} />

    {/* Protected pages — redirect to /login if not authenticated */}
    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard"     element={<DashboardPage />} />
        <Route path="/transactions"  element={<TransactionsPage />} />
        <Route path="/savings-goals" element={<SavingsGoalsPage />} />
        <Route path="/insights"      element={<Insights />} />
        <Route path="/settings"      element={<SettingsPage />} />
      </Route>
    </Route>

    {/* 404 */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRouter;
