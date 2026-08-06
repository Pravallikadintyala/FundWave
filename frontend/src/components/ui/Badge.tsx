type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Badge = ({ variant = 'neutral', size = 'md', dot = false, children, className = '' }: BadgeProps) => (
  <span className={['badge', `badge--${variant}`, `badge--${size}`, className].filter(Boolean).join(' ')}>
    {dot && <span className="badge__dot" aria-hidden="true" />}
    {children}
  </span>
);

export default Badge;
