/**
 * OAuthCallback — handles the redirect from the backend after Google OAuth.
 *
 * Flow:
 *   1. Backend redirects to /auth/callback?token=<JWT>
 *   2. We read `token` from the URL query string
 *   3. Call loginWithToken() — fetches /users/me, persists token + user in
 *      AuthContext exactly as normal email/password login does
 *   4. Replace browser history so the token never sits in the URL
 *   5. Navigate to /dashboard
 *
 * Error path: if token is missing or /users/me rejects, show an error with a
 * link back to /login. Never leave the user stuck on this page.
 */

import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// ─── Icons ─────────────────────────────────────────────────────────────────────

const SpinnerIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 16 16"
    fill="none"
    stroke="var(--color-primary)"
    strokeWidth="2"
    strokeLinecap="round"
    style={{ animation: 'spin 0.7s linear infinite' }}
    aria-hidden="true"
  >
    <path d="M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2z" opacity="0.25" />
    <path d="M8 2a6 6 0 0 1 6 6" />
  </svg>
);

const LogoMark = () => (
  <svg width="40" height="40" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <rect width="28" height="28" rx="9" fill="var(--color-primary)" />
    <path
      d="M8 14h12M14 8l6 6-6 6"
      stroke="white"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Component ──────────────────────────────────────────────────────────────────

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Guard against double-invocation in React Strict Mode
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get('token');

    if (!token) {
      setErrorMsg('No authentication token was received. Please try signing in again.');
      return;
    }

    // Remove the token from the URL immediately so it is not visible in history
    // or accidentally bookmarked. We do this before the async work so that even
    // a slow /users/me call does not leave the token sitting in the address bar.
    window.history.replaceState({}, '', '/auth/callback');

    loginWithToken(token)
      .then(() => {
        navigate('/dashboard', { replace: true });
      })
      .catch(() => {
        setErrorMsg(
          'Authentication failed — the token may be expired or invalid. Please try again.',
        );
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Error state ───────────────────────────────────────────────────────────

  if (errorMsg) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: '1.5rem',
          padding: '2rem',
          backgroundColor: 'var(--color-bg-base)',
          textAlign: 'center',
        }}
      >
        <LogoMark />
        <div
          style={{
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-danger-muted)',
            color: 'var(--color-danger-fg)',
            borderLeft: '4px solid var(--color-danger)',
            maxWidth: '420px',
            lineHeight: 1.6,
            fontSize: '0.9375rem',
          }}
          role="alert"
        >
          <strong style={{ display: 'block', marginBottom: '0.35rem' }}>
            Sign-in failed
          </strong>
          {errorMsg}
        </div>
        <Link
          to="/login"
          style={{
            color: 'var(--color-primary)',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          ← Back to login
        </Link>
      </div>
    );
  }

  // ─── Loading state (default) ──────────────────────────────────────────────

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '1.25rem',
        backgroundColor: 'var(--color-bg-base)',
      }}
      aria-live="polite"
      aria-label="Authenticating with Google"
    >
      <LogoMark />
      <SpinnerIcon />
      <p
        style={{
          color: 'var(--color-text-secondary)',
          fontSize: '0.9375rem',
          margin: 0,
        }}
      >
        Completing sign-in with Google…
      </p>
    </div>
  );
};

export default OAuthCallback;
