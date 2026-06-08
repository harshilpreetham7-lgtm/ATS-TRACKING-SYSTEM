import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { connectSocket, disconnectSocket } from '../socket';
import { TrendingUp, Briefcase, Users, Laptop, BarChart3, Brain, Zap, Settings } from 'lucide-react';
import NavBar from '../components/NavBar';
import SummaryCard from '../components/SummaryCard';
import { workflowModules } from '../data/workflowModules';

// Small inline sparkline component — no extra deps
const Sparkline = ({ apps = [], className = '' }) => {
  const recent = (apps || []).slice(-10);
  const mapStatus = (s) => {
    if (!s) return 1;
    if (s === 'offered') return 5;
    if (s === 'interviewed') return 4;
    if (s === 'shortlisted') return 3;
    if (s === 'reviewing') return 2;
    if (s === 'rejected') return 0.5;
    return 1;
  };
  const values = recent.map((a) => mapStatus(a.status || a.stage || a.source));
  const max = Math.max(...values, 1);
  const width = 220;
  const height = 48;
  const step = width / Math.max(values.length - 1, 1);
  const points = values.map((v, i) => `${i * step},${height - (v / max) * height}`).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
      <polyline points={points} fill="none" stroke="#7c3aed" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.28" transform="translate(0,2)" />
    </svg>
  );
};

const statusColumns = [
  { id: 'applied', title: 'Applied' },
  { id: 'reviewing', title: 'Reviewing' },
  { id: 'shortlisted', title: 'Shortlisted' },
  { id: 'interviewed', title: 'Interviewed' },
  { id: 'offered', title: 'Offered' },
  { id: 'rejected', title: 'Rejected' },
];

const stageDefinitions = [
  {
    id: 'applied',
    title: 'Applied',
    description: 'New candidates enter here. Confirm eligibility, role fit, and the minimum data required before reviewing further.',
    goal: 'Validate role match and complete the first-pass screen.',
    output: 'A clean candidate record with all required submission details.',
    criteria: ['Resume or profile present', 'Core role fit identified', 'Contact details and availability captured', 'Portfolio or work samples attached when relevant'],
  },
  {
    id: 'reviewing',
    title: 'Reviewing',
    description: 'Evaluate experience depth, skills, and hiring manager alignment. Compare against the role scorecard.',
    goal: 'Determine whether the candidate meets the role bar.',
    output: 'Shortlist recommendation with notes and risk flags.',
    criteria: ['Technical or functional depth reviewed', 'Role-specific scorecard completed', 'Compensation and location fit checked', 'Manager feedback collected'],
  },
  {
    id: 'shortlisted',
    title: 'Shortlisted',
    description: 'Candidates are strong enough to interview. Confirm interviewer panel, schedule, and interview rubric.',
    goal: 'Prepare the candidate for structured interviews.',
    output: 'Interview plan with owners, topics, and evaluation rubric.',
    criteria: ['Panel selected', 'Interview slots scheduled', 'Interview questions assigned', 'Candidate communication sent'],
  },
  {
    id: 'interviewed',
    title: 'Interviewed',
    description: 'Collect feedback from each interviewer, resolve disagreements, and decide if the candidate should move to offer.',
    goal: 'Convert interview feedback into a decision-ready record.',
    output: 'Hiring decision summary with strengths, concerns, and recommendation.',
    criteria: ['Interview scorecards submitted', 'Debrief completed', 'Offer or reject decision documented', 'Follow-up questions resolved'],
  },
  {
    id: 'offered',
    title: 'Offered',
    description: 'Send the offer, manage approvals, and track acceptance. Keep compensation and start-date details synchronized.',
    goal: 'Close the candidate with a clean offer process.',
    output: 'Offer package with compensation, title, and start date.',
    criteria: ['Offer approved internally', 'Compensation aligned', 'Start date confirmed', 'Offer sent to candidate'],
  },
  {
    id: 'rejected',
    title: 'Rejected',
    description: 'Use when the candidate does not meet the bar, the role fit is wrong, or the interview signals are weak.',
    goal: 'Maintain a professional close-out with clear reasoning.',
    output: 'Closed candidate record with rejection reason and future fit notes.',
    criteria: ['Role mismatch documented', 'Interview concerns recorded', 'Communication sent professionally', 'Future re-engagement tagged if appropriate'],
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { token, user, loadBoard, applications, logout, jobs } = useAppStore();
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token) {
      loadBoard();
      const socket = connectSocket();
      socket.on('applicationUpdated', (updated) => {
        useAppStore.setState((state) => ({
          applications: state.applications.map((item) => (item._id === updated._id ? updated : item)),
        }));
      });
      socket.on('newApplication', (application) => {
        useAppStore.setState((state) => ({ applications: [application, ...state.applications] }));
        useAppStore.getState().pushNotification({
          title: 'New application',
          message: `${application.applicant?.name || 'Someone'} applied to ${application.job?.title || 'a role'}`,
          type: 'info',
        });
      });
      socket.on('applicationStatusChanged', (updated) => {
        useAppStore.setState((state) => ({
          applications: state.applications.map((item) => (item._id === updated._id ? updated : item)),
        }));
        useAppStore.getState().pushNotification({
          title: 'Application moved',
          message: `${updated.applicant?.name || 'Candidate'} moved to ${updated.status}`,
          type: 'info',
        });
      });
      return () => {
        socket.off('applicationUpdated');
        socket.off('newApplication');
        socket.off('applicationStatusChanged');
        disconnectSocket();
      };
    }
  }, [token, loadBoard]);

  useEffect(() => {
    if (!selectedJob && jobs.length > 0) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs, selectedJob]);

  const totalApplications = applications.length;
  const totalJobs = jobs.length;

  const recentApplications = applications.slice(0, 4);
  const statusCount = useMemo(() => {
    return applications.reduce(
      (acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      },
      { applied: 0, reviewing: 0, shortlisted: 0, interviewed: 0, offered: 0, rejected: 0 }
    );
  }, [applications]);

  const conversionRate = totalApplications ? Math.round((statusCount.offered / totalApplications) * 100) : 0;

  const handleSync = async () => {
    await loadBoard();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar user={user} onLogout={logout} onSync={handleSync} />
      <main className="mx-auto max-w-[1440px] px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-20 lg:pt-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300 ring-1 ring-emerald-500/30">
            <Zap size={14} />
            Workspace
          </p>
          <p className="mx-auto mt-4 inline-flex rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300 shadow-lg shadow-black/20">
            Review-ready product flow for recruiters and hiring managers
          </p>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
            ATS <span className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 bg-clip-text text-transparent">Workspace</span>
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-400">
            Manage your hiring workflow, track applications, and present a clear, high-trust recruiting product inspired by Greenhouse, Lever, and Workday.
          </p>
        </section>

        <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard title="Open roles" value={totalJobs} subtitle="Active positions" accent="from-indigo-500 via-indigo-600 to-indigo-400" />
              <SummaryCard title="Applications" value={totalApplications} subtitle="In pipeline" accent="from-rose-500 via-rose-600 to-pink-400" />
              <SummaryCard title="Shortlisted" value={statusCount.shortlisted} subtitle="Ready to interview" accent="from-amber-500 via-amber-600 to-amber-400" />
              <SummaryCard title="Conversion" value={`${conversionRate}%`} subtitle="Offer rate" accent="from-emerald-400 via-emerald-500 to-cyan-400" />
            </div>

            {/* Module Grid */}
            <section className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">Available Modules</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Access your ATS tools</h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* Roles Module */}
                <button
                  onClick={() => navigate('/tool/roles')}
                  className="group rounded-[2rem] border border-purple-500/40 bg-gradient-to-br from-purple-950/40 to-purple-950/10 p-6 text-left shadow-lg shadow-purple-950/20 transition hover:-translate-y-1 hover:border-purple-500/60 hover:shadow-purple-500/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-[1.2rem] bg-gradient-to-br from-purple-500 to-purple-600 p-4 shadow-lg shadow-purple-500/40">
                      <Briefcase className="text-white" size={28} />
                    </div>
                    <span className="text-sm font-bold text-slate-400">1</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white transition group-hover:text-purple-200">Browse Roles</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400 transition group-hover:text-slate-300">
                    Explore open positions with a polished card layout and clear role metadata.
                  </p>
                </button>

                {/* Pipeline Module */}
                <button
                  onClick={() => navigate('/tool/pipeline')}
                  className="group rounded-[2rem] border border-cyan-500/40 bg-gradient-to-br from-cyan-950/40 to-cyan-950/10 p-6 text-left shadow-lg shadow-cyan-950/20 transition hover:-translate-y-1 hover:border-cyan-500/60 hover:shadow-cyan-500/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-[1.2rem] bg-gradient-to-br from-cyan-500 to-cyan-600 p-4 shadow-lg shadow-cyan-500/40">
                      <Brain className="text-white" size={28} />
                    </div>
                    <span className="text-sm font-bold text-slate-400">2</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white transition group-hover:text-cyan-200">Pipeline Board</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400 transition group-hover:text-slate-300">
                    Drag and drop candidates through stages with action-rich candidate details.
                  </p>
                </button>

                {/* Workflow Module */}
                <button
                  onClick={() => navigate('/tool/application-data')}
                  className="group rounded-[2rem] border border-amber-500/40 bg-gradient-to-br from-amber-950/40 to-amber-950/10 p-6 text-left shadow-lg shadow-amber-950/20 transition hover:-translate-y-1 hover:border-amber-500/60 hover:shadow-amber-500/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-[1.2rem] bg-gradient-to-br from-amber-500 to-amber-600 p-4 shadow-lg shadow-amber-500/40">
                      <Zap className="text-white" size={28} />
                    </div>
                    <span className="inline-flex items-center rounded-full bg-amber-500/20 px-2 py-1 text-xs font-bold text-amber-300 ring-1 ring-amber-500/40">PRO</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white transition group-hover:text-amber-200">Workflow Forms</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400 transition group-hover:text-slate-300">
                    Create structured workflows for any process
                  </p>
                </button>

                {/* Analytics Module */}
                <button
                  onClick={() => navigate('/tool/analytics')}
                  className="group rounded-[2rem] border border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 to-emerald-950/10 p-6 text-left shadow-lg shadow-emerald-950/20 transition hover:-translate-y-1 hover:border-emerald-500/60 hover:shadow-emerald-500/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-[1.2rem] bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 shadow-lg shadow-emerald-500/40">
                      <BarChart3 className="text-white" size={28} />
                    </div>
                    <span className="text-sm font-bold text-slate-400">4</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white transition group-hover:text-emerald-200">Analytics</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400 transition group-hover:text-slate-300">
                    Track pipeline metrics and hiring insights
                  </p>
                </button>
              </div>
            </section>
          </div>
          
          {/* Right column: live activity + mini chart */}
          <aside className="space-y-6">
            <div className="rounded-[1.4rem] border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Live activity</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">Recent events</h3>
                </div>
                <button onClick={handleSync} className="rounded-full bg-slate-800/60 px-3 py-1 text-xs text-slate-200">Sync</button>
              </div>
              <div className="mt-4 space-y-3">
                {recentApplications.length === 0 ? (
                  <p className="text-slate-500">No recent activity — your board will populate here.</p>
                ) : (
                  recentApplications.map((a) => (
                    <div key={a._id} className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">{(a.candidateName || 'C').charAt(0)}</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{a.candidateName || 'Candidate'}</p>
                        <p className="text-xs text-slate-500">{a.job?.title || 'Role'} • {a.status || 'New'}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Applications trend</p>
              <h3 className="mt-1 text-lg font-semibold text-white">Last 10 events</h3>
              <div className="mt-4">
                {/* simple sparkline using application counts */}
                <Sparkline apps={applications} className="h-24 w-full" />
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Top sources</p>
              <div className="mt-3 space-y-2 text-sm text-slate-300">
                {Object.entries(statusCount).slice(0, 5).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="capitalize">{k}</span>
                    <span className="font-semibold text-white">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
