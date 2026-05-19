import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import { useAppStore } from '../store/useAppStore';
import { connectSocket, disconnectSocket } from '../socket';
import { TrendingUp, Clock, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import NavBar from '../components/NavBar';
import KanbanBoard from '../components/KanbanBoard';
import SummaryCard from '../components/SummaryCard';
import SectionHeader from '../components/SectionHeader';
import JobPreviewCard from '../components/JobPreviewCard';
import PipelineStageTabs from '../components/PipelineStageTabs';
import NotificationCenter from '../components/NotificationCenter';
import SearchFilter from '../components/SearchFilter';

const statusColumns = [
  { id: 'applied', title: 'Applied' },
  { id: 'reviewing', title: 'Reviewing' },
  { id: 'shortlisted', title: 'Shortlisted' },
  { id: 'interviewed', title: 'Interviewed' },
  { id: 'offered', title: 'Offered' },
  { id: 'rejected', title: 'Rejected' },
];

const stageDefinitions = [
  { id: 'applied', title: 'Applied', description: 'New candidates join the pipeline. Review their resumes and move top talent forward.' },
  { id: 'reviewing', title: 'Reviewing', description: 'Assess candidate fit, collect feedback, and narrow down the best profiles.' },
  { id: 'shortlisted', title: 'Shortlisted', description: 'Highlight the strongest candidates and prepare them for interviews.' },
  { id: 'interviewed', title: 'Interviewed', description: 'Capture interview feedback and progress candidates toward offers.' },
  { id: 'offered', title: 'Offered', description: 'Track offer acceptance and close the strongest hires quickly.' },
  { id: 'rejected', title: 'Rejected', description: 'Decline candidates gracefully while keeping the pipeline clean and organized.' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { token, user, loadBoard, applications, updateApplicationStatus, logout, jobs } = useAppStore();
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedStage, setSelectedStage] = useState('applied');
  const [showOpenRoles, setShowOpenRoles] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({ newToday: 0, movedToday: 0, offersToday: 0 });

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
        setNotifications((prev) => [
          {
            title: 'New application',
            message: `${application.applicant?.name || 'Someone'} applied to ${application.job?.title || 'a role'}`,
            type: 'info',
          },
          ...prev,
        ].slice(0, 6));
        setStats((s) => ({ ...s, newToday: (s.newToday || 0) + 1 }));
      });
      socket.on('applicationStatusChanged', (updated) => {
        useAppStore.setState((state) => ({
          applications: state.applications.map((item) => (item._id === updated._id ? updated : item)),
        }));
        setNotifications((prev) => [
          {
            title: 'Application moved',
            message: `${updated.applicant?.name || 'Candidate'} moved to ${updated.status}`,
            type: 'info',
          },
          ...prev,
        ].slice(0, 6));
        setStats((s) => ({ ...s, movedToday: (s.movedToday || 0) + 1 }));
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

  const filteredApplications = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return applications.filter((app) => {
      if (selectedStatuses.length && !selectedStatuses.includes(app.status)) return false;
      if (!term) return true;
      const name = (app.applicant?.name || '').toLowerCase();
      const email = (app.applicant?.email || '').toLowerCase();
      const jobTitle = (app.job?.title || '').toLowerCase();
      return name.includes(term) || email.includes(term) || jobTitle.includes(term);
    });
  }, [applications, searchTerm, selectedStatuses]);
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
  const recentApplications = filteredApplications.slice(0, 5);

  const columns = statusColumns.map((column) => ({
    ...column,
    items: filteredApplications.filter((app) => app.status === column.id),
  }));

  const handleSync = async () => {
    await loadBoard();
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId;
    await updateApplicationStatus(draggableId, newStatus);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar user={user} onLogout={logout} onSync={handleSync} />
      <main className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-8 shadow-2xl shadow-slate-950/30 ring-1 ring-white/5">
          <SectionHeader
            eyebrow="Live hiring intelligence"
            title="A premium ATS experience that looks modern and moves fast."
            description="Review pipeline health, highlight top roles, and keep every hiring stakeholder aligned with every move."
            badge="Real-time overview"
          />
          <div className="mt-8 grid gap-5 xl:grid-cols-[1.2fr_0.9fr]">
            <div className="grid gap-5 sm:grid-cols-2">
              <SummaryCard
                title="Open roles"
                value={totalJobs}
                subtitle="Click to reveal every available role in the current hiring pipeline."
                onClick={() => {
                  setSelectedJob(jobs[0] || null);
                  setShowOpenRoles(true);
                }}
                active={showOpenRoles}
              />
              <SummaryCard
                title="Live pipeline"
                value={totalApplications}
                subtitle="Track candidate movement instantly and surface the current hiring momentum."
                onClick={() => {
                  setSelectedStage('applied');
                  setShowOpenRoles(false);
                }}
                active={selectedStage === 'applied' && !showOpenRoles}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <SummaryCard
                title="Offer conversion"
                value={`${conversionRate}%`}
                subtitle="Shows the ratio of offers made from the current pipeline."
              />
              <SummaryCard
                title="Shortlisted"
                value={statusCount.shortlisted}
                subtitle="Highlight the most promising candidates moving toward interviews."
              />
            </div>
          </div>
          {showOpenRoles && (
            <div className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/20">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Open roles</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Available roles in the hiring pipeline</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowOpenRoles(false)}
                  className="rounded-full bg-slate-950/80 px-4 py-2 text-sm text-slate-300 ring-1 ring-white/10 transition hover:bg-slate-900"
                >
                  Hide roles
                </button>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {jobs.length ? jobs.map((job) => (
                  <div key={job._id} className="rounded-[1.75rem] bg-slate-950/80 p-5 ring-1 ring-white/5 transition hover:bg-slate-900">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">{job.type || 'Full-time'}</p>
                        <h4 className="mt-3 text-lg font-semibold text-white">{job.title}</h4>
                      </div>
                      <span className="rounded-3xl bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                        {job.location || 'Remote'}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-400">{job.company || 'Top-tier team'}</p>
                    <p className="mt-4 text-sm leading-6 text-slate-400">{job.description ? `${job.description.slice(0, 95)}...` : 'No description available yet.'}</p>
                  </div>
                )) : (
                  <div className="rounded-[1.75rem] bg-slate-950/80 p-6 text-slate-400">No roles available yet. Add a job to make this panel show your active positions.</div>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/20">
          <div className="grid gap-6">
            <SearchFilter
              onSearch={(term) => setSearchTerm(term)}
              onStatusFilter={(statuses) => setSelectedStatuses(statuses)}
            />
            <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
              <JobPreviewCard job={selectedJob} />
              <PipelineStageTabs stages={stageDefinitions} selectedStage={selectedStage} onSelect={setSelectedStage} />
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <section className="space-y-6">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/20">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Open jobs</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Recruiter favorites</h2>
                </div>
                <div className="rounded-full bg-slate-950/80 px-4 py-2 text-sm text-slate-300 ring-1 ring-white/10">
                  {totalJobs} Active roles
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
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

            <aside className="space-y-6">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/20">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Pipeline board</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Candidate flow</h2>
                <div className="mt-6">
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <KanbanBoard columns={columns} />
                  </DragDropContext>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/20">
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
