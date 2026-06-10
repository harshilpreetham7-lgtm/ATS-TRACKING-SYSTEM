import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { connectSocket, disconnectSocket } from '../socket';
import { TrendingUp, Clock, CheckCircle, AlertCircle, Briefcase, GraduationCap, ShieldCheck, Users, Laptop, Code2, Workflow, ArrowRight, BarChart3, Brain, Zap, Settings } from 'lucide-react';
import NavBar from '../components/NavBar';
import SummaryCard from '../components/SummaryCard';
import SectionHeader from '../components/SectionHeader';
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
  const { token, user, loadBoard, applications, updateApplicationStatus, logout, jobs } = useAppStore();
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

  const stageColor = {
    applied: 'from-slate-500 to-cyan-500',
    reviewing: 'from-cyan-500 to-blue-500',
    shortlisted: 'from-amber-500 to-orange-500',
    interviewed: 'from-violet-500 to-fuchsia-500',
    offered: 'from-emerald-500 to-cyan-500',
    rejected: 'from-rose-500 to-pink-500',
  };

  const getModuleIcon = (name) => {
    switch (name) {
      case 'role':
        return Briefcase;
      case 'data':
        return ShieldCheck;
      case 'review':
        return CheckCircle;
      case 'shortlist':
        return Users;
      case 'interview':
        return Clock;
      case 'offer':
        return ShieldCheck;
      case 'rejection':
        return AlertCircle;
      default:
        return Workflow;
    }
  };

  const moduleAccent = {
    cyan: 'from-cyan-500 to-cyan-600',
    sky: 'from-sky-500 to-sky-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
    violet: 'from-violet-500 to-violet-600',
    rose: 'from-rose-500 to-rose-600',
    pink: 'from-pink-500 to-pink-600',
    indigo: 'from-indigo-500 to-indigo-600',
    teal: 'from-teal-500 to-teal-600',
  };

  const pipelineSummary = [
    { label: 'Active roles', value: totalJobs, accent: 'from-indigo-500 to-cyan-500' },
    { label: 'Pipeline velocity', value: `${Math.min(totalApplications * 3, 120)} / mo`, accent: 'from-rose-500 to-pink-500' },
    { label: 'Offer rate', value: `${conversionRate}%`, accent: 'from-emerald-500 to-cyan-400' },
  ];

  const statusStages = statusColumns.map((stage) => ({
    ...stage,
    count: statusCount[stage.id] || 0,
    percent: totalApplications ? Math.round((statusCount[stage.id] / totalApplications) * 100) : 0,
    color: stageColor[stage.id] || 'from-slate-500 to-slate-500',
  }));

  const topModules = workflowModules.slice(0, 6);

  const handleSync = async () => {
    await loadBoard();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar user={user} onLogout={logout} onSync={handleSync} />
      <main className="mx-auto max-w-[1440px] px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-20 lg:pt-8">
        {/* Hero Section */}
        <section className="mb-12 overflow-hidden rounded-[2.5rem] border border-slate-800/80 bg-slate-900/80 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.55)] backdrop-blur-xl relative">
          <div className="pointer-events-none absolute -right-20 top-8 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="pointer-events-none absolute left-16 top-10 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300 ring-1 ring-emerald-500/30">
                <Zap size={14} />
                Workspace
              </p>
              <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
                ATS Dashboard for modern recruiting teams
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
                See your pipeline performance at a glance, surface the next hiring priorities, and keep the team aligned with polished stage insights.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {pipelineSummary.map((item) => (
                <div key={item.label} className="rounded-[1.8rem] border border-slate-800/70 bg-slate-950/90 p-5 shadow-xl shadow-black/20">
                  <p className="text-xs uppercase tracking-[0.26em] text-slate-400">{item.label}</p>
                  <p className="mt-4 text-3xl font-black text-white">{item.value}</p>
                  <div className={`mt-4 h-2 rounded-full bg-gradient-to-r ${item.accent}`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mb-10 grid gap-8 xl:grid-cols-[1.8fr_1fr]">
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard title="Open roles" value={totalJobs} subtitle="Active positions" accent="from-indigo-500 via-indigo-600 to-indigo-400" />
              <SummaryCard title="Pipeline" value={totalApplications} subtitle="Total applications" accent="from-rose-500 via-rose-600 to-pink-400" />
              <SummaryCard title="Shortlisted" value={statusCount.shortlisted} subtitle="To interview" accent="from-amber-500 via-amber-600 to-amber-400" />
              <SummaryCard title="Offer rate" value={`${conversionRate}%`} subtitle="Team conversion" accent="from-emerald-400 via-emerald-500 to-cyan-400" />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.25fr_0.85fr]">
              <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Pipeline snapshot</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Hiring stage health</h2>
                  </div>
                  <button onClick={handleSync} className="inline-flex items-center gap-2 rounded-full bg-slate-800/70 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700/80">
                    Sync board
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  {statusStages.map((stage) => (
                    <div key={stage.id} className="space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-white">{stage.title}</p>
                          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{stage.count} candidates</p>
                        </div>
                        <span className="text-sm font-semibold text-slate-300">{stage.percent}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                        <div className={`h-full rounded-full bg-gradient-to-r ${stage.color}`} style={{ width: `${stage.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Stage guide</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">What happens next</h2>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  {stageDefinitions.slice(0, 4).map((item) => (
                    <div key={item.id} className="rounded-[1.8rem] border border-slate-800/50 bg-slate-950/80 p-4">
                      <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-slate-800/70 bg-slate-900/70 p-6 shadow-2xl shadow-black/20">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Active role</p>
                  <h3 className="mt-1 text-xl font-semibold text-white">{activeJob?.title || 'No job selected'}</h3>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300 ring-1 ring-emerald-500/20">Active</span>
              </div>
              <div className="mt-5 space-y-3 text-sm text-slate-300">
                <p>{activeJob?.company || 'ATS Team'} • {activeJob?.location || 'Remote'}</p>
                <p>{activeJob?.type || 'Full-time'}</p>
                <p className="text-slate-400">{activeJob?.description || 'Select a role from the board to see details here.'}</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800/70 bg-slate-900/70 p-6 shadow-2xl shadow-black/20">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Live activity</p>
              <h3 className="mt-1 text-xl font-semibold text-white">Recent updates</h3>
              <div className="mt-5 space-y-4">
                {recentApplications.length === 0 ? (
                  <p className="text-slate-500">No recent activity yet. Sync the board to refresh.</p>
                ) : (
                  recentApplications.map((application) => (
                    <div key={application._id} className="rounded-[1.6rem] border border-slate-800/70 bg-slate-950/80 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">{application.candidateName || 'Candidate'}</p>
                          <p className="text-xs text-slate-500">{application.job?.title || 'Role'}</p>
                        </div>
                        <span className="rounded-full bg-slate-800/90 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">{application.status || 'New'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800/70 bg-slate-900/70 p-6 shadow-2xl shadow-black/20">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Trend</p>
              <h3 className="mt-1 text-xl font-semibold text-white">Application momentum</h3>
              <div className="mt-5 overflow-hidden rounded-[1.5rem] bg-slate-950/80 p-4">
                <Sparkline apps={applications} className="h-28 w-full" />
              </div>
            </div>
          </aside>
        </div>

        <section className="space-y-6">
          <SectionHeader
            eyebrow="Smart modules"
            title="Rapid access to your hiring toolkit"
            description="Build your process from a flexible module library, then move quickly between role setup, application intake, and review workflows."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topModules.map((module) => {
              const Icon = getModuleIcon(module.icon);
              return (
                <button
                  key={module.id}
                  onClick={() => navigate(`/tool/${module.id}`)}
                  className="group overflow-hidden rounded-[2rem] border border-slate-800/70 bg-slate-950/80 p-6 text-left shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:bg-slate-900/90"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={`rounded-[1.4rem] bg-gradient-to-br ${moduleAccent[module.accent] || 'from-slate-500 to-slate-700'} p-4 shadow-lg shadow-black/30`}>
                      <Icon className="text-white" size={26} />
                    </div>
                    <span className="text-sm font-semibold text-slate-400">{module.badge}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white transition group-hover:text-cyan-200">{module.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{module.summary}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition group-hover:text-cyan-200">
                    Explore
                    <ArrowRight size={16} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
