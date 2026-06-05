import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Bell, Shield, Users, Key, Trash2, Save, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import NavBar from '../components/NavBar';
import BackButton from '../components/BackButton';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { token, user, logout } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    // Account
    fullName: user?.name || '',
    email: user?.email || '',
    company: user?.company || 'ATS Team',
    role: user?.role || 'recruiter',

    // Notifications
    emailNotifications: true,
    applicationUpdates: true,
    pipelineChanges: true,
    weeklyDigest: true,
    notificationFrequency: 'realtime',

    // Workspace
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    theme: 'dark',
    language: 'English',

    // Team
    defaultInterviewers: [],
    allowPublicProfiles: false,
    requireApprovalSteps: true,

    // Security
    twoFactorAuth: false,
    sessionTimeout: 30,
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
    setSaved(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar user={user} onLogout={logout} />
      <main className="mx-auto max-w-[1000px] px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <BackButton to="/dashboard" />
          <div className="mt-6 flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 shadow-lg">
              <Settings size={28} className="text-white" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Configuration</p>
              <h1 className="text-4xl font-black text-white">Workspace Settings</h1>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Account Section */}
          <section className="rounded-[2rem] border border-slate-800 bg-slate-900/50 p-8 shadow-lg shadow-slate-950/20">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-1 w-1 rounded-full bg-cyan-400" />
              <h2 className="text-xl font-semibold text-white">Account Information</h2>
            </div>
            <div className="space-y-5">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-slate-300">Full Name</label>
                  <input
                    type="text"
                    value={settings.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className="mt-2 w-full rounded-[1.2rem] border border-slate-700 bg-slate-950/80 px-4 py-2 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-300">Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="mt-2 w-full rounded-[1.2rem] border border-slate-700 bg-slate-950/80 px-4 py-2 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-300">Company</label>
                  <input
                    type="text"
                    value={settings.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    className="mt-2 w-full rounded-[1.2rem] border border-slate-700 bg-slate-950/80 px-4 py-2 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-300">Role</label>
                  <select
                    value={settings.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className="mt-2 w-full rounded-[1.2rem] border border-slate-700 bg-slate-950/80 px-4 py-2 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                  >
                    <option value="recruiter">Recruiter</option>
                    <option value="hiring_manager">Hiring Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Notification Settings */}
          <section className="rounded-[2rem] border border-slate-800 bg-slate-900/50 p-8 shadow-lg shadow-slate-950/20">
            <div className="mb-6 flex items-center gap-3">
              <Bell size={20} className="text-amber-400" />
              <h2 className="text-xl font-semibold text-white">Notifications</h2>
            </div>
            <div className="space-y-5">
              <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/50 p-4">
                <div>
                  <p className="font-medium text-white">Email Notifications</p>
                  <p className="text-sm text-slate-400">Receive updates via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                  className="h-5 w-5 cursor-pointer rounded border-slate-600 accent-cyan-500"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/50 p-4">
                <div>
                  <p className="font-medium text-white">Application Updates</p>
                  <p className="text-sm text-slate-400">Notify on new/updated applications</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.applicationUpdates}
                  onChange={(e) => handleChange('applicationUpdates', e.target.checked)}
                  className="h-5 w-5 cursor-pointer rounded border-slate-600 accent-cyan-500"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/50 p-4">
                <div>
                  <p className="font-medium text-white">Pipeline Changes</p>
                  <p className="text-sm text-slate-400">Notify on candidate stage changes</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.pipelineChanges}
                  onChange={(e) => handleChange('pipelineChanges', e.target.checked)}
                  className="h-5 w-5 cursor-pointer rounded border-slate-600 accent-cyan-500"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/50 p-4">
                <div>
                  <p className="font-medium text-white">Weekly Digest</p>
                  <p className="text-sm text-slate-400">Get a weekly summary every Monday</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.weeklyDigest}
                  onChange={(e) => handleChange('weeklyDigest', e.target.checked)}
                  className="h-5 w-5 cursor-pointer rounded border-slate-600 accent-cyan-500"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-300">Notification Frequency</label>
                <select
                  value={settings.notificationFrequency}
                  onChange={(e) => handleChange('notificationFrequency', e.target.value)}
                  className="mt-2 w-full rounded-[1.2rem] border border-slate-700 bg-slate-950/80 px-4 py-2 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                >
                  <option value="realtime">Real-time</option>
                  <option value="daily">Daily digest</option>
                  <option value="weekly">Weekly digest</option>
                </select>
              </div>
            </div>
          </section>

          {/* Workspace Settings */}
          <section className="rounded-[2rem] border border-slate-800 bg-slate-900/50 p-8 shadow-lg shadow-slate-950/20">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-1 w-1 rounded-full bg-emerald-400" />
              <h2 className="text-xl font-semibold text-white">Workspace Preferences</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-300">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                  className="mt-2 w-full rounded-[1.2rem] border border-slate-700 bg-slate-950/80 px-4 py-2 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                >
                  <option value="America/New_York">Eastern Time (EST)</option>
                  <option value="America/Chicago">Central Time (CST)</option>
                  <option value="America/Denver">Mountain Time (MST)</option>
                  <option value="America/Los_Angeles">Pacific Time (PST)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Berlin">Berlin (CET)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-300">Date Format</label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => handleChange('dateFormat', e.target.value)}
                  className="mt-2 w-full rounded-[1.2rem] border border-slate-700 bg-slate-950/80 px-4 py-2 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-300">Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleChange('theme', e.target.value)}
                  className="mt-2 w-full rounded-[1.2rem] border border-slate-700 bg-slate-950/80 px-4 py-2 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-300">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="mt-2 w-full rounded-[1.2rem] border border-slate-700 bg-slate-950/80 px-4 py-2 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Español</option>
                  <option value="French">Français</option>
                  <option value="German">Deutsch</option>
                </select>
              </div>
            </div>
          </section>

          {/* Team & Permissions */}
          <section className="rounded-[2rem] border border-slate-800 bg-slate-900/50 p-8 shadow-lg shadow-slate-950/20">
            <div className="mb-6 flex items-center gap-3">
              <Users size={20} className="text-rose-400" />
              <h2 className="text-xl font-semibold text-white">Team & Permissions</h2>
            </div>
            <div className="space-y-5">
              <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/50 p-4">
                <div>
                  <p className="font-medium text-white">Allow Public Profiles</p>
                  <p className="text-sm text-slate-400">Let team members access public profile pages</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowPublicProfiles}
                  onChange={(e) => handleChange('allowPublicProfiles', e.target.checked)}
                  className="h-5 w-5 cursor-pointer rounded border-slate-600 accent-cyan-500"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/50 p-4">
                <div>
                  <p className="font-medium text-white">Require Approval Steps</p>
                  <p className="text-sm text-slate-400">Managers must approve candidate movements</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.requireApprovalSteps}
                  onChange={(e) => handleChange('requireApprovalSteps', e.target.checked)}
                  className="h-5 w-5 cursor-pointer rounded border-slate-600 accent-cyan-500"
                />
              </div>
            </div>
          </section>

          {/* Security Settings */}
          <section className="rounded-[2rem] border border-slate-800 bg-slate-900/50 p-8 shadow-lg shadow-slate-950/20">
            <div className="mb-6 flex items-center gap-3">
              <Shield size={20} className="text-indigo-400" />
              <h2 className="text-xl font-semibold text-white">Security</h2>
            </div>
            <div className="space-y-5">
              <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/50 p-4">
                <div>
                  <p className="font-medium text-white">Two-Factor Authentication</p>
                  <p className="text-sm text-slate-400">Enhance account security with 2FA</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                  className="h-5 w-5 cursor-pointer rounded border-slate-600 accent-cyan-500"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-300">Session Timeout (minutes)</label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                  min="5"
                  max="480"
                  className="mt-2 w-full rounded-[1.2rem] border border-slate-700 bg-slate-950/80 px-4 py-2 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                />
              </div>
            </div>
          </section>

          {/* API & Integration */}
          <section className="rounded-[2rem] border border-slate-800 bg-slate-900/50 p-8 shadow-lg shadow-slate-950/20">
            <div className="mb-6 flex items-center gap-3">
              <Key size={20} className="text-lime-400" />
              <h2 className="text-xl font-semibold text-white">API & Integrations</h2>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-slate-400">Manage API keys and third-party integrations</p>
              <button className="rounded-[1.2rem] border border-slate-700 bg-slate-950/80 px-4 py-3 font-semibold text-white transition hover:border-slate-600 hover:bg-slate-900">
                View API Documentation
              </button>
              <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">API Key</p>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="password"
                    value="••••••••••••••••••••••••"
                    readOnly
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-400 outline-none"
                  />
                  <button className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700">
                    Copy
                  </button>
                  <button className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700">
                    Regenerate
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="rounded-[2rem] border border-rose-900/50 bg-rose-950/20 p-8 shadow-lg shadow-rose-950/10">
            <div className="mb-6 flex items-center gap-3">
              <Trash2 size={20} className="text-rose-400" />
              <h2 className="text-xl font-semibold text-white">Danger Zone</h2>
            </div>
            <div className="space-y-4">
              <button
                onClick={handleLogout}
                className="w-full rounded-[1.2rem] border border-rose-500/30 bg-rose-500/10 px-4 py-3 font-semibold text-rose-200 transition hover:border-rose-500/50 hover:bg-rose-500/20"
              >
                Logout
              </button>
              <button className="w-full rounded-[1.2rem] border border-rose-500/30 bg-rose-500/10 px-4 py-3 font-semibold text-rose-200 transition hover:border-rose-500/50 hover:bg-rose-500/20">
                Delete Account
              </button>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 rounded-[1.2rem] bg-gradient-to-r from-cyan-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-600/40 transition hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50"
            >
              <div className="flex items-center justify-center gap-2">
                {saved ? <Check size={20} /> : <Save size={20} />}
                {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
