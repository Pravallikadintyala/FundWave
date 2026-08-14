import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '@/services/authService';
import { AxiosError } from 'axios';

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4h12M2 4l6 4.5L14 4M2 4v8h12V4" />
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

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.forgotPassword(email.trim());
      setSuccess(true);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || 'An error occurred. Please try again.');
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
          <h2 className="auth-success__title">Check your email</h2>
          <p className="auth-success__desc">
            If an account exists for <strong>{email}</strong>, we have sent a password reset link.
          </p>
          <Link to="/login" className="auth-form__submit-btn" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '1rem' }}>
            Return to login
          </Link>
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
        <h1 className="auth-form__title">Reset Password</h1>
        <p className="auth-form__subtitle">
          Enter your email to receive a reset link
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
          <label htmlFor="forgot-email" className="auth-form__label">Email</label>
          <div className="auth-form__input-wrap">
            <span className="auth-form__input-icon"><MailIcon /></span>
            <input
              id="forgot-email"
              type="email"
              className="auth-form__input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              <span>Sending link...</span>
            </>
          ) : (
            <span>Send Reset Link</span>
          )}
        </button>
      </form>

      <p className="auth-form__footer-text" style={{ marginTop: '1.5rem' }}>
        Remember your password?{' '}
        <Link to="/login" className="auth-form__footer-link">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
