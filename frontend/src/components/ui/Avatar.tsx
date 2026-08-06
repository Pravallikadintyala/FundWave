type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: AvatarSize;
  online?: boolean;
  className?: string;
}

const sizeMap: Record<AvatarSize, number> = { xs: 24, sm: 32, md: 40, lg: 56, xl: 80 };

const getInitials = (name: string) =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

const Avatar = ({ src, name = '', size = 'md', online, className = '' }: AvatarProps) => {
  const px = sizeMap[size];
  return (
    <span
      className={['avatar', `avatar--${size}`, className].filter(Boolean).join(' ')}
      style={{ width: px, height: px, minWidth: px }}
      aria-label={name || 'User avatar'}
    >
      {src ? (
        <img src={src} alt={name} className="avatar__img" />
      ) : (
        <span className="avatar__initials" aria-hidden="true">
          {name ? getInitials(name) : '?'}
        </span>
      )}
      {online !== undefined && (
        <span className={['avatar__status', online ? 'avatar__status--online' : 'avatar__status--offline'].join(' ')} />
      )}
    </span>
  );
};

export default Avatar;
