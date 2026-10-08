import { useState, useEffect } from 'react';
import { User, Lock, Bell, HardDrive } from 'lucide-react';
import { useAuth, useFiles } from '../../context';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import StorageUsageWidget from '../../components/common/StorageUsageWidget';
import { handleApiError, handleApiSuccess } from '../../utils/errorHandler';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'storage', label: 'Storage', icon: HardDrive },
];

export default function SettingsPage() {
  const { user, updateProfile, changePassword } = useAuth();
  const { storageUsage, fetchStorageUsage } = useFiles();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: '',
  });
  const [notifications, setNotifications] = useState({
    email_uploads: true,
    email_shares: true,
    email_storage: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStorageUsage();
  }, [fetchStorageUsage]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.full_name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ full_name: profileForm.full_name });
    } catch (error) {
      handleApiError(error, 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.new_password_confirm) {
      handleApiError({ message: 'Passwords do not match' });
      return;
    }
    setLoading(true);
    try {
      await changePassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
      });
      setPasswordForm({ old_password: '', new_password: '', new_password_confirm: '' });
    } catch (error) {
      handleApiError(error, 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSave = () => {
    handleApiSuccess('Notification preferences saved');
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-500">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <nav className="flex gap-2 overflow-x-auto lg:w-56 lg:flex-col lg:gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 rounded-xl border border-slate-200 bg-white p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave} className="max-w-md space-y-4">
              <div className="mb-6 flex items-center gap-4">
                <Avatar
                  name={user?.full_name || user?.email}
                  src={user?.avatar}
                  size="lg"
                />
                <div>
                  <p className="font-medium text-slate-900">{user?.full_name}</p>
                  <p className="text-sm text-slate-500">{user?.email}</p>
                </div>
              </div>

              <Input
                label="Full name"
                value={profileForm.full_name}
                onChange={(e) =>
                  setProfileForm((prev) => ({ ...prev, full_name: e.target.value }))
                }
              />

              <Input
                label="Email"
                type="email"
                value={profileForm.email}
                disabled
                hint="Contact support to change your email"
              />

              <Button type="submit" loading={loading}>
                Save changes
              </Button>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
              <Input
                label="Current password"
                type="password"
                value={passwordForm.old_password}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, old_password: e.target.value }))
                }
                autoComplete="current-password"
              />
              <Input
                label="New password"
                type="password"
                value={passwordForm.new_password}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, new_password: e.target.value }))
                }
                autoComplete="new-password"
              />
              <Input
                label="Confirm new password"
                type="password"
                value={passwordForm.new_password_confirm}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    new_password_confirm: e.target.value,
                  }))
                }
                autoComplete="new-password"
              />
              <Button type="submit" loading={loading}>
                Change password
              </Button>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div className="max-w-md space-y-4">
              {[
                { key: 'email_uploads', label: 'Upload notifications', desc: 'Get notified when uploads complete' },
                { key: 'email_shares', label: 'Share notifications', desc: 'Get notified when files are shared with you' },
                { key: 'email_storage', label: 'Storage alerts', desc: 'Get notified when storage is almost full' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-start gap-3 rounded-lg border border-slate-200 p-4 cursor-pointer hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={notifications[item.key]}
                    onChange={(e) =>
                      setNotifications((prev) => ({
                        ...prev,
                        [item.key]: e.target.checked,
                      }))
                    }
                    className="mt-1 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </label>
              ))}
              <Button onClick={handleNotificationSave}>
                Save preferences
              </Button>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="max-w-md space-y-6">
              <StorageUsageWidget
                used={storageUsage?.used_bytes ?? 0}
                total={storageUsage?.total_bytes}
              />
              <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-medium text-slate-900">Storage breakdown</p>
                <ul className="mt-3 space-y-2">
                  <li className="flex justify-between">
                    <span>Files</span>
                    <span>{storageUsage?.file_count ?? 0}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Folders</span>
                    <span>{storageUsage?.folder_count ?? 0}</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
