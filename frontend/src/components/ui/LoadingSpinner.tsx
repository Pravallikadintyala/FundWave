type SpinnerSize = 'sm' | 'md' | 'lg';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  className?: string;
  label?: string;
}

const sizePx: Record<SpinnerSize, number> = { sm: 14, md: 20, lg: 32 };

const LoadingSpinner = ({ size = 'md', className = '', label = 'Loading…' }: LoadingSpinnerProps) => {
  const px = sizePx[size];
  return (
    <span
      className={['spinner', `spinner--${size}`, className].filter(Boolean).join(' ')}
      role="status"
      aria-label={label}
      style={{ width: px, height: px }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ width: '100%', height: '100%', animation: 'spin 0.75s linear infinite' }}
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" fill="none" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
};

export default LoadingSpinner;
