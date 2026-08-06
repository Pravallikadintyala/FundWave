import { useAuth } from '@/hooks/useAuth';
import { Card, CardBody, Avatar, Badge, Button } from '@/components/ui';

const ProfileRow = ({ label, value }: { label: string; value: string }) => (
  <div className="profile-row">
    <span className="profile-row__label">{label}</span>
    <span className="profile-row__value">{value}</span>
  </div>
);

const ProfilePage = () => {
  const { user } = useAuth();
  const displayName = user?.fullName ?? user?.username ?? 'User';
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Unknown';

  return (
    <div className="page page-enter">
      <div className="page__header">
        <div>
          <h1 className="page__title">Profile</h1>
          <p className="page__subtitle">Manage your account preferences.</p>
        </div>
      </div>

      <div className="profile-grid">
        {/* Identity card */}
        <Card variant="elevated" padding="lg" className="profile-grid__identity">
          <CardBody>
            <div className="profile-identity">
              <Avatar name={displayName} size="xl" />
              <div className="profile-identity__info">
                <h2 className="heading-sm">{displayName}</h2>
                <p className="caption">@{user?.username ?? '—'}</p>
                <Badge variant="success" size="sm" dot style={{ marginTop: 8 }}>Active</Badge>
              </div>
            </div>
            <div className="profile-identity__actions">
              <Button variant="primary" size="sm" disabled>Edit Profile</Button>
              <Button variant="ghost" size="sm" disabled>Change Password</Button>
            </div>
          </CardBody>
        </Card>

        {/* Account details */}
        <Card variant="default" padding="lg">
          <CardBody>
            <h2 className="card-section-title" style={{ marginBottom: 'var(--space-5)' }}>Account Details</h2>
            <div className="profile-rows">
              <ProfileRow label="Username"   value={user?.username ?? '—'} />
              <ProfileRow label="Full Name"  value={user?.fullName ?? '—'} />
              <ProfileRow label="Member Since" value={joinDate} />
            </div>
          </CardBody>
        </Card>

        {/* Preferences */}
        <Card variant="default" padding="lg">
          <CardBody>
            <h2 className="card-section-title" style={{ marginBottom: 'var(--space-5)' }}>Preferences</h2>
            <div className="profile-rows">
              <ProfileRow label="Currency" value={user?.currency ?? 'INR'} />
              <ProfileRow label="Timezone" value={user?.timezone ?? 'Asia/Kolkata'} />
            </div>
          </CardBody>
        </Card>

        {/* Danger zone */}
        <Card variant="bordered" padding="lg" className="profile-grid__danger">
          <CardBody>
            <h2 className="card-section-title" style={{ color: 'var(--color-danger)', marginBottom: 'var(--space-3)' }}>Danger Zone</h2>
            <p className="caption" style={{ marginBottom: 'var(--space-5)' }}>
              These actions are permanent and cannot be undone.
            </p>
            <Button variant="danger" size="sm" disabled>Delete Account</Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
