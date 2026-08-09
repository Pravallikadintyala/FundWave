import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardBody, Avatar, Button, Input } from '@/components/ui';
import { authService, UpdateProfilePayload } from '@/services/authService';

const SUPPORTED_CURRENCIES = [
  'INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'AUD', 'CAD', 'JPY', 'CHF',
];

const SUPPORTED_TIMEZONES = [
  'Asia/Kolkata',
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Paris',
  'Asia/Dubai',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
];

const SettingsPage = () => {
  const { user, logout, updateUser } = useAuth();
  
  const [formData, setFormData] = useState<UpdateProfilePayload>({
    fullName: user?.fullName ?? '',
    avatar: user?.avatar ?? '',
    currency: user?.currency ?? 'USD',
    timezone: user?.timezone ?? 'UTC',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{type: 'success'|'error', msg: string} | null>(null);

  // Sync form data if user context changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName ?? '',
        avatar: user.avatar ?? '',
        currency: user.currency ?? 'USD',
        timezone: user.timezone ?? 'UTC',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (isSaving || !user) return;
    setFeedback(null);
    
    if (!formData.fullName?.trim()) {
      setFeedback({ type: 'error', msg: 'Full name is required' });
      return;
    }

    setIsSaving(true);
    try {
      const res = await authService.updateProfile(formData);
      const updatedUser = res.data.data.user;
      
      // Map the response to our Auth Context user type
      updateUser({
        id: updatedUser.id,
        username: updatedUser.username,
        fullName: updatedUser.fullName,
        avatar: updatedUser.avatar,
        currency: updatedUser.currency,
        timezone: updatedUser.timezone,
      });

      setFeedback({ type: 'success', msg: 'Profile updated successfully' });
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || 'Failed to update profile';
      setFeedback({ type: 'error', msg });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    // We could add a confirm dialog here if needed, but we'll stick to a direct action
    // as per instructions, or use a window.confirm since there isn't a complex ConfirmDialog hook imported.
    if (window.confirm('Are you sure you want to log out?')) {
      await logout();
    }
  };

  const displayName = formData.fullName || user?.username || 'User';

  return (
    <div className="page page-enter">
      <div className="page__header">
        <div>
          <h1 className="page__title">Settings</h1>
          <p className="page__subtitle">Manage your profile and account preferences.</p>
        </div>
      </div>

      <div className="profile-grid">
        {/* Profile Card */}
        <Card variant="elevated" padding="lg" className="profile-grid__identity">
          <CardBody>
            <h2 className="card-section-title" style={{ marginBottom: 'var(--space-5)' }}>Profile</h2>
            
            {feedback && (
              <div style={{
                padding: 'var(--space-3)',
                marginBottom: 'var(--space-5)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: feedback.type === 'error' ? 'var(--color-danger-muted)' : 'var(--color-success-muted)',
                color: feedback.type === 'error' ? 'var(--color-danger-fg)' : 'var(--color-success-fg)',
                borderLeft: `4px solid ${feedback.type === 'error' ? 'var(--color-danger)' : 'var(--color-success)'}`
              }}>
                {feedback.msg}
              </div>
            )}

            <form onSubmit={handleSave} className="settings-form">
              <div className="settings-form__avatar-row" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <Avatar name={displayName} src={formData.avatar} size="xl" />
                <div style={{ flex: 1 }}>
                  <Input 
                    label="Avatar URL (Optional)" 
                    name="avatar"
                    value={formData.avatar} 
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.png"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                <Input 
                  label="Full Name" 
                  name="fullName"
                  value={formData.fullName} 
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  required
                />
                
                <div className="input-wrapper">
                  <label htmlFor="currency" className="input-label">Currency</label>
                  <select 
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="input-field input-field--md"
                  >
                    {SUPPORTED_CURRENCIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="input-wrapper">
                  <label htmlFor="timezone" className="input-label">Timezone</label>
                  <select 
                    id="timezone"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    className="input-field input-field--md"
                  >
                    {SUPPORTED_TIMEZONES.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Button type="submit" variant="primary" disabled={isSaving} isLoading={isSaving}>
                Save Changes
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Account Danger Zone */}
        <Card variant="bordered" padding="lg" className="profile-grid__danger">
          <CardBody>
            <h2 className="card-section-title" style={{ color: 'var(--color-danger)', marginBottom: 'var(--space-3)' }}>Account</h2>
            <p className="caption" style={{ marginBottom: 'var(--space-5)' }}>
              Log out of your current session on this device.
            </p>
            <Button variant="danger" size="sm" onClick={handleLogout}>Log out</Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
