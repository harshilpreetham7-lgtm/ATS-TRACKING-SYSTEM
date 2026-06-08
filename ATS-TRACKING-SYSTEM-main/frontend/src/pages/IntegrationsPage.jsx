import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import NavBar from '../components/NavBar';
import BackButton from '../components/BackButton';
import { Zap, CalendarDays, Mail, Slack, Link, CheckCircle2, ArrowRight, Download, Cloud } from 'lucide-react';

const integrationsList = [
  {
    id: 'calendar',
    title: 'Calendar sync',
    description: 'Schedule interviews directly from your job workflow and sync availability with Google Calendar or Outlook.',
    supported: ['Google Calendar', 'Outlook', 'Microsoft 365'],
    icon: CalendarDays,
  },
  {
    id: 'email',
    title: 'Email outreach',
    description: 'Send interview reminders, candidate nurture sequences, and hiring updates from a shared inbox.',
    supported: ['Gmail', 'Outlook', 'SMTP'],
    icon: Mail,
  },
  {
    id: 'slack',
    title: 'Slack alerts',
    description: 'Notify your hiring team instantly when candidates move stages or interviews are booked.',
    supported: ['Slack'],
    icon: Slack,
  },
  {
    id: 'linkedin',
    title: 'LinkedIn sourcing',
    description: 'Enrich candidate profiles and import prospects from LinkedIn into your pipeline.',
    supported: ['LinkedIn'],
    icon: Link,
  },
  {
    id: 'api',
    title: 'API access',
    description: 'Integrate your ATS with custom tools, HRIS systems, or reporting dashboards via REST.',
    supported: ['API', 'Webhooks'],
    icon: Cloud,
  },
  {
    id: 'resume',
    title: 'Resume parsing',
    description: 'Automatically extract candidate skills and experience from uploaded resumes.',
    supported: ['PDF', 'DOCX', 'TXT'],
    icon: Download,
  },
];

const IntegrationsPage = () => {
  const navigate = useNavigate();
  const { token, user, logout, applications, jobs, loadBoard, pushNotification } = useAppStore();
  const [connected, setConnected] = useState({
    calendar: true,
    email: true,
    slack: false,
    linkedin: false,
    api: true,
    resume: true,
  });
  const [selectedIntegration, setSelectedIntegration] = useState('calendar');
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [appUpdates, setAppUpdates] = useState({});
  const [syntheticApps, setSyntheticApps] = useState([]);

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

  const dynamicStats = useMemo(() => {
    const allApplications = [...syntheticApps, ...applications];
    return {
      activeJobs: jobs.length,
      applicantSources: allApplications.reduce((acc, app) => {
        const source = app.source || (app.job?.title || 'Internal');
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {}),
      connectedCount: Object.values(connected).filter(Boolean).length,
      totalApplications: allApplications.length,
    };
  }, [applications, jobs, connected, syntheticApps]);

  const popularSource = useMemo(() => {
    const sources = dynamicStats.applicantSources;
    const top = Object.entries(sources).sort((a, b) => b[1] - a[1])[0];
    return top ? `${top[0]} (${top[1]})` : 'No sources yet';
  }, [dynamicStats.applicantSources]);

  const displayedApplications = useMemo(() => {
    const mergedApplications = applications.map((app) => ({
      ...app,
      ...(appUpdates[app._id] || {}),
    }));
    return [...syntheticApps, ...mergedApplications].slice(0, 5);
  }, [applications, appUpdates, syntheticApps]);

  const primaryJob = jobs[0]?.title || 'your next role';
  const primaryApp = displayedApplications[0]?.candidateName || 'a candidate';

  const toggleIntegration = (id) => {
    setConnected((prev) => {
      const nextConnected = { ...prev, [id]: !prev[id] };
      pushNotification({
        type: nextConnected[id] ? 'success' : 'info',
        title: `${integrationTitle(id)} ${nextConnected[id] ? 'connected' : 'disconnected'}`,
        message: nextConnected[id]
          ? `Your ${integrationTitle(id).toLowerCase()} connector is now live.`
          : `The ${integrationTitle(id).toLowerCase()} integration has been turned off.`,
      });
      return nextConnected;
    });
  };

  const integrationTitle = (id) => {
    const integration = integrationsList.find((item) => item.id === id);
    return integration?.title || 'Integration';
  };

  const notifyAction = (title, message) => {
    pushNotification({ type: 'success', title, message });
  };

  const addTimelineEvent = (summary, detail) => {
    setTimelineEvents((prev) => [
      { id: `event-${Date.now()}`, summary, detail },
      ...prev,
    ].slice(0, 6));
  };

  const recordAppUpdate = (applicationId, updates) => {
    setAppUpdates((prev) => ({
      ...prev,
      [applicationId]: {
        ...prev[applicationId],
        ...updates,
      },
    }));
  };

  const handleIntegrationAction = (id) => {
    if (!connected[id]) {
      toggleIntegration(id);
      return;
    }

    const candidate = displayedApplications[0];
    const jobTitle = candidate?.job?.title || primaryJob;
    const candidateName = candidate?.candidateName || primaryApp;

    switch (id) {
      case 'calendar':
        if (candidate) {
          recordAppUpdate(candidate._id, { stage: 'Interview scheduled' });
          addTimelineEvent('Interview scheduled', `Interview added for ${candidateName} in ${jobTitle}.`);
        }
        notifyAction('Interview scheduled', `A calendar event was created for ${jobTitle}.`);
        break;
      case 'email':
        if (candidate) {
          recordAppUpdate(candidate._id, { source: 'Email outreach' });
          addTimelineEvent('Email sent', `Reminder sent to ${candidateName} from connected email.`);
        }
        notifyAction('Email sent', `A reminder was sent to ${candidateName}.`);
        break;
      case 'slack':
        if (candidate) {
          recordAppUpdate(candidate._id, { stage: 'Team notified' });
          addTimelineEvent('Slack alert posted', `Hiring channel notified for ${jobTitle}.`);
        }
        notifyAction('Slack alert posted', `Your hiring channel received an update.`);
        break;
      case 'linkedin':
        const newCandidate = {
          _id: `linkedin-${Date.now()}`,
          candidateName: 'Avery Morgan',
          job: jobs[0] || { title: 'New role' },
          stage: 'Sourced',
          source: 'LinkedIn',
        };
        setSyntheticApps((prev) => [newCandidate, ...prev].slice(0, 5));
        addTimelineEvent('Candidate imported', `A LinkedIn prospect was added for ${newCandidate.job.title}.`);
        notifyAction('Profile imported', 'A new candidate was added from LinkedIn.');
        break;
      case 'api':
        addTimelineEvent('Webhook delivered', 'Your API endpoint received a fresh hiring update.');
        notifyAction('API ping succeeded', 'Your webhook delivered a payload to the connected endpoint.');
        break;
      case 'resume':
        if (candidate) {
          recordAppUpdate(candidate._id, { parsed: true });
          addTimelineEvent('Resume parsed', `Resume data extracted for ${candidateName}.`);
        }
        notifyAction('Resume parsed', 'Candidate credentials were extracted and saved.');
        break;
      default:
        addTimelineEvent('Action complete', 'Integration action completed successfully.');
        notifyAction('Action complete', 'Integration action completed successfully.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar user={user} onLogout={logout} />
      <main className="mx-auto max-w-[1200px] px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <BackButton to="/dashboard" />
          <div className="mt-6 flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-pink-500 to-fuchsia-500 p-3 shadow-lg">
              <Zap size={28} className="text-white" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-pink-300">Connected tools</p>
              <h1 className="text-4xl font-black text-white">Integrations</h1>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[1.8rem] border border-slate-800 bg-slate-900/50 p-6 shadow-lg shadow-slate-950/20">
            <p className="text-sm uppercase tracking-[0.24em] text-pink-300 font-semibold">Connected tools</p>
            <p className="mt-3 text-4xl font-black text-white">{dynamicStats.connectedCount}</p>
            <p className="mt-2 text-sm text-slate-400">Active connections in your workspace</p>
          </div>
          <div className="rounded-[1.8rem] border border-slate-800 bg-slate-900/50 p-6 shadow-lg shadow-slate-950/20">
            <p className="text-sm uppercase tracking-[0.24em] text-pink-300 font-semibold">Open positions</p>
            <p className="mt-3 text-4xl font-black text-white">{dynamicStats.activeJobs}</p>
            <p className="mt-2 text-sm text-slate-400">Jobs available to sync with calendars and outreach</p>
          </div>
          <div className="rounded-[1.8rem] border border-slate-800 bg-slate-900/50 p-6 shadow-lg shadow-slate-950/20">
            <p className="text-sm uppercase tracking-[0.24em] text-pink-300 font-semibold">Application sources</p>
            <p className="mt-3 text-4xl font-black text-white">{dynamicStats.totalApplications}</p>
            <p className="mt-2 text-sm text-slate-400">Most active source: {popularSource}</p>
          </div>
        </div>

        <section className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-900/50 p-8 shadow-lg shadow-slate-950/20">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-pink-300">What integrations can do</p>
              <h2 className="text-3xl font-semibold text-white">Build a connected hiring experience</h2>
            </div>
            <button
              onClick={() => navigate('/settings')}
              className="inline-flex items-center gap-2 rounded-full border border-pink-500/40 bg-pink-500/10 px-4 py-2 text-sm font-semibold text-pink-200 transition hover:border-pink-500/70 hover:bg-pink-500/15"
            >
              Manage connection settings
            </button>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Sync calendars</p>
              <h3 className="mt-3 text-xl font-semibold text-white">Interview scheduling</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Keep interview slots in sync with Google Calendar and Outlook so your hiring team never double-books.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Email automation</p>
              <h3 className="mt-3 text-xl font-semibold text-white">Candidate outreach</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Send offer letters, reminders, and follow-ups automatically from your connected email provider.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Team alerts</p>
              <h3 className="mt-3 text-xl font-semibold text-white">Slack notifications</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Notify reviewers instantly when candidates move stages, interviews are booked, or offers are sent.
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6 rounded-[2rem] border border-slate-800 bg-slate-900/50 p-8 shadow-lg shadow-slate-950/20">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-pink-300">Available integrations</p>
                <h2 className="text-2xl font-semibold text-white">Connected and ready</h2>
              </div>
              <span className="rounded-full bg-slate-950/70 px-3 py-2 text-xs uppercase tracking-[0.28em] text-slate-400">Real-time status</span>
            </div>
            <div className="grid gap-4">
              {integrationsList.map((integration) => {
                const Icon = integration.icon;
                const isSelected = selectedIntegration === integration.id;
                return (
                  <div
                    key={integration.id}
                    onClick={() => setSelectedIntegration(integration.id)}
                    className={`cursor-pointer rounded-[1.5rem] border p-6 transition ${isSelected ? 'border-pink-400/60 bg-slate-900/95 shadow-pink-500/15' : 'border-slate-800 bg-slate-950/80 hover:border-pink-400/40 hover:shadow-pink-500/10'}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-pink-500/10 p-3 text-pink-300">
                          <Icon size={22} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{integration.title}</h3>
                          <p className="mt-1 text-sm text-slate-400">{integration.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${connected[integration.id] ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-700/60 text-slate-300'}`}>
                          {connected[integration.id] ? 'Connected' : 'Not connected'}
                        </span>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleIntegration(integration.id);
                          }}
                          className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-pink-500/40"
                        >
                          {connected[integration.id] ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    </div>
                    <div className="mt-5 grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
                      {integration.supported.map((item) => (
                        <span key={item} className="rounded-2xl border border-slate-800 bg-slate-950/60 px-3 py-2">
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span className="text-xs uppercase tracking-[0.28em] text-slate-500">Click to explore</span>
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{isSelected ? 'Selected' : 'Preview'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="rounded-[2rem] border border-slate-800 bg-slate-900/50 p-8 shadow-lg shadow-slate-950/20">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-pink-300">Selected integration</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{integrationTitle(selectedIntegration)}</h2>
              </div>
              <span className="rounded-full bg-slate-950/70 px-3 py-2 text-xs uppercase tracking-[0.28em] text-slate-400">
                {connected[selectedIntegration] ? 'Live' : 'Disabled'}
              </span>
            </div>

            <p className="text-sm leading-6 text-slate-400">
              {selectedIntegration === 'calendar' && 'Schedule interviews and keep your hiring team aligned across Google Calendar and Outlook.'}
              {selectedIntegration === 'email' && 'Send reminders, follow-ups, and offer letters from your shared inbox to keep candidates engaged.'}
              {selectedIntegration === 'slack' && 'Alert your team instantly when candidates move stages, interviews are booked, or offers are sent.'}
              {selectedIntegration === 'linkedin' && 'Import candidates from LinkedIn, enrich profiles, and keep sourcing flowing without leaving the ATS.'}
              {selectedIntegration === 'api' && 'Use REST and webhooks to connect the ATS to HRIS, reporting dashboards, and custom workflows.'}
              {selectedIntegration === 'resume' && 'Parse resumes automatically to extract skills, experience, and contact details for faster review.'}
            </p>

            <div className="mt-6 space-y-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-5 text-sm text-slate-300">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">What it can do</p>
                <ul className="list-disc space-y-2 pl-5">
                  {selectedIntegration === 'calendar' && (
                    <>
                      <li>Book interviews directly from an active job.</li>
                      <li>Sync availability across your hiring team.</li>
                      <li>Prevent double-booking with calendar alerts.</li>
                    </>
                  )}
                  {selectedIntegration === 'email' && (
                    <>
                      <li>Send candidate outreach at scale.</li>
                      <li>Track open and response performance.</li>
                      <li>Automate reminders and follow-up sequences.</li>
                    </>
                  )}
                  {selectedIntegration === 'slack' && (
                    <>
                      <li>Notify reviewers instantly on candidate progress.</li>
                      <li>Pin urgent interviews to hiring channels.</li>
                      <li>Share feedback directly from the ATS.</li>
                    </>
                  )}
                  {selectedIntegration === 'linkedin' && (
                    <>
                      <li>Import targeted profiles from LinkedIn.</li>
                      <li>Auto-fill candidate details from social profiles.</li>
                      <li>Keep sourced prospects tagged and assigned.</li>
                    </>
                  )}
                  {selectedIntegration === 'api' && (
                    <>
                      <li>Send webhook events when candidates move stages.</li>
                      <li>Fetch custom analytics or inventory data.</li>
                      <li>Connect to your HRIS, payroll, or reporting tools.</li>
                    </>
                  )}
                  {selectedIntegration === 'resume' && (
                    <>
                      <li>Extract skills and experience from uploads.</li>
                      <li>Rank candidates automatically by match.</li>
                      <li>Store parsed resume data for faster review.</li>
                    </>
                  )}
                </ul>
              </div>
              <button
                onClick={() => handleIntegrationAction(selectedIntegration)}
                className="w-full rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              >
                {connected[selectedIntegration] ? `Use ${integrationTitle(selectedIntegration)}` : `Connect ${integrationTitle(selectedIntegration)}`}
              </button>
            </div>

            <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-950/80 p-5 text-sm text-slate-300">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Live application feed</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">Recent ATS events</h3>
                </div>
              </div>
              <div className="space-y-3">
                {timelineEvents.length === 0 ? (
                  <p className="text-slate-500">No integration actions yet. Click a button to trigger live updates and see the workflow change.</p>
                ) : (
                  timelineEvents.map((event) => (
                    <div key={event.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                      <p className="text-sm font-semibold text-white">{event.summary}</p>
                      <p className="mt-1 text-xs text-slate-500">{event.detail}</p>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-950/80 p-5 text-sm text-slate-300">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Application preview</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">Live candidate snapshots</h3>
                </div>
              </div>
              <div className="space-y-3">
                {displayedApplications.length === 0 ? (
                  <p className="text-slate-500">No application data available yet. Load the board or connect an integration to start.</p>
                ) : (
                  displayedApplications.map((app) => (
                    <div key={app._id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-white">{app.candidateName || 'Candidate'}</p>
                          <p className="text-xs text-slate-500">{app.job?.title || 'Open position'}</p>
                        </div>
                        <span className="rounded-full bg-slate-800 px-2 py-1 text-[11px] uppercase text-slate-300">
                          {app.stage || app.status || 'New'}
                        </span>
                      </div>
                      <p className="mt-3 text-xs text-slate-500">Source: {app.source || 'Internal'}</p>
                      {app.parsed && <p className="mt-2 text-xs text-emerald-300">Resume parsed and profile enriched</p>}
                    </div>
                  ))
                )}
              </div>
            </section>

            <div className="mt-6 text-sm leading-6 text-slate-400">
              <p>
                Today, {dynamicStats.connectedCount} integrations are active in this workspace, helping move {dynamicStats.totalApplications} applicants through the process.
              </p>
              <p className="mt-3 inline-flex items-center gap-2 text-slate-300">
                <ArrowRight size={16} /> Connect once, automate every hiring step.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default IntegrationsPage;
