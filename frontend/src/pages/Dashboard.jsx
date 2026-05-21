import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { connectSocket, disconnectSocket } from '../socket';
import { TrendingUp, Clock, CheckCircle, AlertCircle, Briefcase, GraduationCap, ShieldCheck, Users, Laptop, Code2, Workflow, ArrowRight } from 'lucide-react';
import NavBar from '../components/NavBar';
import SummaryCard from '../components/SummaryCard';
import SectionHeader from '../components/SectionHeader';
import { workflowModules } from '../data/workflowModules';

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

  const conversionRate = totalApplications ? Math.round((statusCount.offered / totalApplications) * 100) : 0;
  const activeJob = selectedJob || jobs[0] || null;

  const handleSync = async () => {
    await loadBoard();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar user={user} onLogout={logout} onSync={handleSync} />
      <main className="mx-auto max-w-[1440px] px-4 pb-10 pt-4 sm:px-6 lg:px-8 lg:pb-12 lg:pt-5">
        <section className="overflow-hidden rounded-[2rem] border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6 shadow-2xl shadow-slate-950/30 ring-1 ring-white/5 lg:p-7">
          <SectionHeader
            eyebrow="Live hiring intelligence"
            title="A premium ATS experience with separate pages for every workflow."
            description="Use the overview for quick actions, open the roles page for role details, and move into the pipeline or workflow pages when you need depth."
            badge="Real-time overview"
          />
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              <SummaryCard
                title="Open roles"
                value={totalJobs}
                subtitle="Browse the roles page for a cleaner catalog and detailed role requirements."
                onClick={() => navigate('/roles')}
                active={false}
              />
              <SummaryCard
                title="Live pipeline"
                value={totalApplications}
                subtitle="Move into the pipeline page to see each stage in a focused workspace."
                onClick={() => navigate('/pipeline')}
                active={false}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <SummaryCard title="Offer conversion" value={`${conversionRate}%`} subtitle="Shows the ratio of offers made from the current pipeline." />
              <SummaryCard title="Shortlisted" value={statusCount.shortlisted} subtitle="Highlight the most promising candidates moving toward interviews." />
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-5 shadow-2xl shadow-slate-950/24 ring-1 ring-white/5 lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Module library</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Four-up cards with direct page navigation</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Keep the overview clean here, then open the dedicated role, pipeline, or workflow pages when you need details.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/roles')}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:from-emerald-400 hover:to-cyan-400"
            >
              <ArrowRight size={16} />
              View all roles
            </button>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {workflowModules.map((module) => (
              <button
                key={module.id}
                type="button"
                onClick={() => navigate(module.id === 'role-selection' ? '/roles' : `/workflow?module=${module.id}`)}
                className="group rounded-[1.5rem] border border-slate-800 bg-slate-950/90 p-5 text-left shadow-lg shadow-slate-950/20 transition hover:-translate-y-1 hover:border-emerald-500/30 hover:bg-slate-900 hover:shadow-emerald-500/10"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">{module.badge}</p>
                <h3 className="mt-3 text-lg font-semibold text-white transition group-hover:text-emerald-200">{module.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{module.subtitle}</p>
                <p className="mt-4 text-sm leading-6 text-slate-400">{module.summary}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  Open page
                  <Workflow size={14} />
                </div>
              </button>
            ))}
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <section className="space-y-5">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-5 shadow-2xl shadow-slate-950/20 lg:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Open jobs</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Recruiter favorites</h2>
                </div>
                <div className="rounded-full bg-slate-950/80 px-4 py-2 text-sm text-slate-300 ring-1 ring-white/10">
                  {totalJobs} Active roles
                </div>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {jobs.length ? jobs.slice(0, 4).map((job) => (
                  <button
                    type="button"
                    key={job._id}
                    onClick={() => setSelectedJob(job)}
                    className={`group w-full text-left rounded-[1.75rem] bg-slate-950/80 p-5 ring-1 ring-white/5 transition hover:bg-slate-900 ${selectedJob?._id === job._id ? 'ring-2 ring-cyan-500 bg-slate-900' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-cyan-300">{job.type || 'Full-time'}</p>
                        <h3 className="mt-3 text-lg font-semibold text-white">{job.title}</h3>
                      </div>
                      <span className="rounded-3xl bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                        {job.location || 'Remote'}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-400 group-hover:text-slate-200">{job.description ? job.description.slice(0, 90) + '...' : job.company || 'Top-tier team'}</p>
                  </button>
                )) : (
                  <div className="rounded-[1.75rem] bg-slate-950/80 p-6 text-slate-400">No jobs available yet. Add a role to start filling pipelines.</div>
                )}
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-5 shadow-2xl shadow-slate-950/20 lg:p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Quick actions</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Jump to the clean pages</h2>
                <div className="mt-6 grid gap-3">
                  {[
                    { label: 'Open roles page', path: '/roles' },
                    { label: 'Open pipeline page', path: '/pipeline' },
                    { label: 'Open workflow workspace', path: '/workflow' },
                  ].map((item) => (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => navigate(item.path)}
                      className="flex items-center justify-between rounded-3xl bg-slate-950/80 px-4 py-4 text-left text-sm font-semibold text-slate-200 ring-1 ring-white/5 transition hover:bg-slate-900 hover:text-cyan-300"
                    >
                      <span>{item.label}</span>
                      <ArrowRight size={16} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-5 shadow-2xl shadow-slate-950/20 lg:p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Recent activity</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">What changed</h2>
                <div className="mt-6 space-y-4">
                  {recentApplications.length ? recentApplications.map((app) => (
                    <div key={app._id} className="rounded-3xl bg-slate-950/80 p-4 ring-1 ring-white/5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-white">{app.applicant?.name || 'Candidate'}</p>
                          <p className="mt-1 text-sm text-slate-400">{app.job?.title || 'Role'} • {app.status}</p>
                        </div>
                        <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Live</span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-400">Updated automatically with every status move in the hiring flow.</p>
                    </div>
                  )) : (
                    <div className="rounded-3xl bg-slate-950/80 p-4 text-slate-400">No recent activity yet — once candidates move through the pipeline, live updates will appear here.</div>
                  )}
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
