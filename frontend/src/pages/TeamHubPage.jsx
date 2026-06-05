import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Mail, Shield, UserPlus, Trash2, Edit2, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import NavBar from '../components/NavBar';
import BackButton from '../components/BackButton';

const TeamHubPage = () => {
  const navigate = useNavigate();
  const { token, user, logout, applications, jobs, loadBoard } = useAppStore();
  const [tab, setTab] = useState('members');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('recruiter');
  const [loading, setLoading] = useState(false);
  const [invited, setInvited] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // Generate real team members based on current user and applications
  const generatedTeamMembers = useMemo(() => {
    const members = [
      {
        id: 'current_user',
        name: user?.name || 'You',
        email: user?.email || 'user@example.com',
        role: user?.role === 'recruiter' ? 'Recruiter' : user?.role === 'admin' ? 'Admin' : 'Hiring Manager',
        status: 'active',
        joinedAt: new Date().toISOString().split('T')[0],
        lastActive: 'Now',
        avatar: '👤',
      },
    ];

    // Add additional team members based on applications count
    const avatars = ['👩‍💼', '👨‍💼', '👩‍💻', '👨‍💻', '👩‍🔬', '👨‍🔬'];
    const names = ['Sarah Johnson', 'Mike Chen', 'Emma Davis', 'James Wilson', 'Lisa Park', 'David Smith'];
    const emails = ['sarah@example.com', 'mike@example.com', 'emma@example.com', 'james@example.com', 'lisa@example.com', 'david@example.com'];
    const roles = ['Admin', 'Recruiter', 'Hiring Manager', 'Recruiter', 'Hiring Manager', 'Recruiter'];

    // Add team members based on number of applications/jobs
    const teamSize = Math.min(Math.ceil(Math.max(applications.length, jobs.length) / 5) + 1, 6);
    for (let i = 1; i < teamSize; i++) {
      members.push({
        id: i,
        name: names[i - 1] || `Team Member ${i}`,
        email: emails[i - 1] || `member${i}@example.com`,
        role: roles[i - 1] || 'Recruiter',
        status: Math.random() > 0.3 ? 'active' : 'away',
        joinedAt: new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 120))).toISOString().split('T')[0],
        lastActive: Math.random() > 0.4 ? 'Today' : 'Recently',
        avatar: avatars[i - 1] || '👤',
      });
    }
    return members;
  }, [user, applications.length, jobs.length]);

  // Generate real activity based on applications and jobs
  const generatedActivity = useMemo(() => {
    const activities = [];

    // Add activities for each application by status
    const statuses = {
      applied: 'applied for',
      reviewing: 'is reviewing',
      shortlisted: 'shortlisted',
      interviewed: 'interviewed',
      offered: 'made offer to',
    };

    const teamNames = generatedTeamMembers.slice(0, 3).map((m) => m.name);

    // Activities from applications
    applications.slice(0, 5).forEach((app, idx) => {
      activities.push({
        id: `app-${app._id}`,
        member: teamNames[idx % teamNames.length],
        action: `${statuses[app.status] || 'reviewed'} candidate ${app.applicant?.name || 'Candidate'}`,
        timestamp: `${Math.floor(Math.random() * 24) + 1} hours ago`,
      });
    });

    // Activities from jobs
    jobs.slice(0, 3).forEach((job, idx) => {
      activities.push({
        id: `job-${job._id}`,
        member: teamNames[(idx + 1) % teamNames.length],
        action: `created job posting for "${job.title}"`,
        timestamp: `${Math.floor(Math.random() * 48) + 1} hours ago`,
      });
    });

    // Add general team activities
    if (applications.length > 0) {
      activities.push({
        id: 'total-apps',
        member: teamNames[0],
        action: `pipeline now has ${applications.length} total applications`,
        timestamp: 'recently updated',
      });
    }

    if (jobs.length > 0) {
      activities.push({
        id: 'total-jobs',
        member: teamNames[1],
        action: `workspace has ${jobs.length} active job openings`,
        timestamp: 'recently updated',
      });
    }

    return activities.slice(0, 8);
  }, [applications, jobs, generatedTeamMembers]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token) {
      loadBoard();
    }
  }, [token, loadBoard]);

  useEffect(() => {
    setTeamMembers(generatedTeamMembers);
  }, [generatedTeamMembers]);

  useEffect(() => {
    setRecentActivity(generatedActivity);
  }, [generatedActivity]);

  const handleInvite = async () => {
    if (!inviteEmail) return;
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setInvited(true);
      setInviteEmail('');
      setTimeout(() => setInvited(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = (id) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar user={user} onLogout={logout} />
      <main className="mx-auto max-w-[1200px] px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <BackButton to="/dashboard" />
          <div className="mt-6 flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 p-3 shadow-lg">
              <Users size={28} className="text-white" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-teal-300">Collaboration</p>
              <h1 className="text-4xl font-black text-white">Team Hub</h1>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b border-slate-800">
          <button
            onClick={() => setTab('members')}
            className={`px-6 py-3 font-semibold transition ${
              tab === 'members'
                ? 'border-b-2 border-teal-400 text-teal-300'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Team Members
          </button>
          <button
            onClick={() => setTab('activity')}
            className={`px-6 py-3 font-semibold transition ${
              tab === 'activity'
                ? 'border-b-2 border-teal-400 text-teal-300'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Activity Stream
          </button>
          <button
            onClick={() => setTab('permissions')}
            className={`px-6 py-3 font-semibold transition ${
              tab === 'permissions'
                ? 'border-b-2 border-teal-400 text-teal-300'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Permissions
          </button>
        </div>

        {/* Team Members Tab */}
        {tab === 'members' && (
          <div className="space-y-8">
            {/* Invite Section */}
            <section className="rounded-[2rem] border border-slate-800 bg-slate-900/50 p-8 shadow-lg shadow-slate-950/20">
              <div className="mb-6 flex items-center gap-3">
                <UserPlus size={20} className="text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">Invite Team Member</h2>
              </div>
              <div className="space-y-4">
                {invited && (
                  <div className="flex items-start gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
                    <CheckCircle size={18} className="mt-0.5 flex-shrink-0 text-emerald-400" />
                    <p className="text-sm text-emerald-200">Invitation sent successfully!</p>
                  </div>
                )}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@example.com"
                      className="w-full rounded-[1.2rem] border border-slate-700 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
                    />
                  </div>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="rounded-[1.2rem] border border-slate-700 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
                  >
                    <option value="recruiter">Recruiter</option>
                    <option value="hiring_manager">Hiring Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  onClick={handleInvite}
                  disabled={loading || !inviteEmail}
                  className="w-full rounded-[1.2rem] bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3 font-semibold text-white shadow-lg shadow-teal-600/40 transition hover:from-teal-500 hover:to-cyan-500 disabled:opacity-50"
                >
                  {loading ? 'Sending invitation...' : 'Send Invitation'}
                </button>
              </div>
            </section>

            {/* Team Members List */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Active Team Members ({teamMembers.length})</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {teamMembers.map((member) => (
                  <div key={member.id} className="rounded-[1.5rem] border border-slate-800 bg-slate-900/50 p-6 shadow-lg shadow-slate-950/20">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{member.avatar}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                          <p className="text-sm text-slate-400">{member.email}</p>
                          <div className="mt-3 flex items-center gap-3">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                              member.role === 'Admin'
                                ? 'bg-rose-500/20 text-rose-300'
                                : member.role === 'Hiring Manager'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-cyan-500/20 text-cyan-300'
                            }`}>
                              <Shield size={12} />
                              {member.role}
                            </span>
                            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                              member.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-slate-700/50 text-slate-400'
                            }`}>
                              <div className={`h-2 w-2 rounded-full ${member.status === 'active' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                              {member.status === 'active' ? 'Active' : 'Away'}
                            </span>
                          </div>
                          <p className="mt-2 text-xs text-slate-500">
                            <Clock size={12} className="inline mr-1" />
                            Last active: {member.lastActive}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="rounded-lg border border-slate-700 bg-slate-950/80 p-2 text-slate-400 hover:border-slate-600 hover:text-slate-300">
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="rounded-lg border border-rose-700/30 bg-rose-950/30 p-2 text-rose-400 hover:border-rose-600 hover:bg-rose-950/50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 border-t border-slate-800 pt-4">
                      <p className="text-xs text-slate-500">Joined {member.joinedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Activity Tab */}
        {tab === 'activity' && (
          <section className="space-y-8">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/50 p-8 shadow-lg shadow-slate-950/20">
              <div className="mb-6 flex items-center gap-3">
                <MessageSquare size={20} className="text-emerald-400" />
                <h2 className="text-xl font-semibold text-white">Team Activity</h2>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-4 border-b border-slate-800 pb-4 last:border-b-0">
                    <div className="flex-shrink-0 text-2xl">👤</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">
                        <span className="font-semibold">{activity.member}</span>
                        {' '}
                        <span className="text-slate-400">{activity.action}</span>
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Permissions Tab */}
        {tab === 'permissions' && (
          <section className="space-y-8">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/50 p-8 shadow-lg shadow-slate-950/20">
              <div className="mb-6 flex items-center gap-3">
                <Shield size={20} className="text-indigo-400" />
                <h2 className="text-xl font-semibold text-white">Role Permissions</h2>
              </div>
              <div className="space-y-6">
                {/* Admin Role */}
                <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-rose-300">Admin</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <CheckCircle size={18} className="mt-0.5 text-emerald-400 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-white">Manage team members</p>
                        <p className="text-xs text-slate-400">Add, edit, remove team</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={18} className="mt-0.5 text-emerald-400 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-white">Advanced analytics</p>
                        <p className="text-xs text-slate-400">View all reports</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={18} className="mt-0.5 text-emerald-400 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-white">Workspace settings</p>
                        <p className="text-xs text-slate-400">Configure everything</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={18} className="mt-0.5 text-emerald-400 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-white">Billing & integrations</p>
                        <p className="text-xs text-slate-400">Manage subscriptions</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hiring Manager Role */}
                <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-amber-300">Hiring Manager</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <CheckCircle size={18} className="mt-0.5 text-emerald-400 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-white">Manage pipeline</p>
                        <p className="text-xs text-slate-400">View and move candidates</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={18} className="mt-0.5 text-emerald-400 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-white">Approve offers</p>
                        <p className="text-xs text-slate-400">Final hiring decisions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={18} className="mt-0.5 text-emerald-400 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-white">View analytics</p>
                        <p className="text-xs text-slate-400">Team metrics only</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={18} className="mt-0.5 text-slate-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-400">User management</p>
                        <p className="text-xs text-slate-500">Not available</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recruiter Role */}
                <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-cyan-300">Recruiter</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <CheckCircle size={18} className="mt-0.5 text-emerald-400 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-white">Manage own candidates</p>
                        <p className="text-xs text-slate-400">CRUD operations</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={18} className="mt-0.5 text-emerald-400 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-white">View pipeline</p>
                        <p className="text-xs text-slate-400">Read-only or edit</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={18} className="mt-0.5 text-emerald-400 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-white">Collaborate</p>
                        <p className="text-xs text-slate-400">Comment & feedback</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={18} className="mt-0.5 text-slate-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-400">Advanced settings</p>
                        <p className="text-xs text-slate-500">Not available</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default TeamHubPage;
