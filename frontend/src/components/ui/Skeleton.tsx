interface SkeletonProps {
  variant?: 'line' | 'block' | 'circle' | 'card';
  width?: string | number;
  height?: string | number;
  className?: string;
  lines?: number;
}

const Skeleton = ({ variant = 'line', width, height, className = '', lines = 1 }: SkeletonProps) => {
  if (variant === 'card') {
    return (
      <div className={['skeleton skeleton--card', className].filter(Boolean).join(' ')}>
        <div className="skeleton skeleton--block" style={{ height: 140 }} />
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="skeleton skeleton--line" style={{ width: '60%' }} />
          <div className="skeleton skeleton--line" style={{ width: '40%' }} />
        </div>
      </div>
    );
  }

  if (variant === 'line' && lines > 1) {
    return (
      <div className={['skeleton-group', className].filter(Boolean).join(' ')}
           style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="skeleton skeleton--line"
            style={{ width: i === lines - 1 ? '70%' : '100%' }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={['skeleton', `skeleton--${variant}`, className].filter(Boolean).join(' ')}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
