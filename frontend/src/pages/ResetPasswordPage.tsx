import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '@/services/authService';
import { AxiosError } from 'axios';

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="10" height="8" rx="2" />
    <path d="M5 7V5a3 3 0 0 1 6 0v2" />
  </svg>
);

const SpinnerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round"
    style={{ animation: 'spin 0.7s linear infinite' }}>
    <path d="M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2z" opacity="0.3" />
    <path d="M8 2a6 6 0 0 1 6 6" />
  </svg>
);

const LogoMark = () => (
  <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
    <rect width="28" height="28" rx="9" fill="var(--color-primary)" />
    <path d="M8 14h12M14 8l6 6-6 6" stroke="white" strokeWidth="2.1"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="auth-form-container" role="main">
        <div className="auth-form__error-banner" role="alert">
          <span className="auth-form__error-banner-icon">⚠</span>
          Invalid or missing reset token.
        </div>
        <Link to="/login" className="auth-form__submit-btn" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '1rem', textAlign: 'center' }}>
          Return to login
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.resetPassword(token, password, confirmPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || 'Failed to reset password. Token may have expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="auth-form-container auth-form-container--success" role="main">
        <div className="auth-success">
          <div className="auth-success__icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="var(--color-success)" strokeWidth="2.5" fill="var(--color-success-muted)" />
              <path d="M14 24l7 7 13-14" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="auth-success__title">Password Reset</h2>
          <p className="auth-success__desc">
            Your password has been successfully updated. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-form-container" role="main">
      <div className="auth-form__mobile-logo">
        <LogoMark />
        <span className="auth-form__mobile-logo-name">FundWave</span>
      </div>

      <div className="auth-form__heading-group">
        <h1 className="auth-form__title">Set new password</h1>
        <p className="auth-form__subtitle">
          Please enter your new password below.
        </p>
      </div>

      {error && (
        <div className="auth-form__error-banner" role="alert">
          <span className="auth-form__error-banner-icon">⚠</span>
          {error}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-form__field">
          <label htmlFor="reset-password" className="auth-form__label">New Password</label>
          <div className="auth-form__input-wrap">
            <span className="auth-form__input-icon"><LockIcon /></span>
            <input
              id="reset-password"
              type="password"
              className="auth-form__input"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="auth-form__field">
          <label htmlFor="reset-confirm" className="auth-form__label">Confirm Password</label>
          <div className="auth-form__input-wrap">
            <span className="auth-form__input-icon"><LockIcon /></span>
            <input
              id="reset-confirm"
              type="password"
              className="auth-form__input"
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <button
          type="submit"
          className="auth-form__submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <SpinnerIcon />
              <span>Resetting...</span>
            </>
          ) : (
            <span>Reset Password</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
