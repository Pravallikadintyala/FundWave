import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, Dropdown, type DropdownItem } from '@/components/ui';

const ProfileIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="7.5" cy="5" r="2.5" />
    <path d="M2 13c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 2H2.5A1.5 1.5 0 0 0 1 3.5v8A1.5 1.5 0 0 0 2.5 13H5" />
    <path d="M10 10l3-3-3-3M13 7H5" />
  </svg>
);

const UserMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const items: DropdownItem[] = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <ProfileIcon />,
      onClick: () => navigate('/profile'),
    },
    { key: 'sep', label: '', separator: true },
    {
      key: 'logout',
      label: 'Sign out',
      icon: <LogoutIcon />,
      danger: true,
      onClick: () => { void logout(); navigate('/login'); },
    },
  ];

  return (
    <Dropdown
      trigger={
        <button className="user-menu-trigger" aria-label="User menu">
          <Avatar
            name={user?.fullName ?? user?.username ?? 'User'}
            size="sm"
          />
          <span className="user-menu-trigger__name">
            {user?.fullName ?? user?.username ?? 'Account'}
          </span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor"
            strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 5l4 4 4-4" />
          </svg>
        </button>
      }
      items={items}
      align="right"
    />
  );
};

export default UserMenu;
