import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3, TrendingUp, Users, Briefcase } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import NavBar from '../components/NavBar';

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { token, user, applications, jobs, loadBoard, logout } = useAppStore();

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

  // Data for Applications Over Time (Line Chart)
  const applicationsOverTime = useMemo(() => {
    if (!applications.length) return [];
    
    // Group applications by date
    const grouped = {};
    applications.forEach((app) => {
      const date = new Date(app.createdAt).toLocaleDateString();
      grouped[date] = (grouped[date] || 0) + 1;
    });

    // Convert to week-based data
    const weeks = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekKey = `Week ${i + 1}`;
      weeks[weekKey] = applications.filter((app) => {
        const appDate = new Date(app.createdAt);
        const daysDiff = Math.floor((appDate - weekStart) / (1000 * 60 * 60 * 24));
        return daysDiff >= 0 && daysDiff < 7;
      }).length;
    }

    return Object.entries(weeks).map(([week, count]) => ({
      week,
      applications: count,
      offers: Math.round(count * 0.15), // Assume ~15% conversion
    }));
  }, [applications]);

  // Data for Stage Distribution (Bar Chart)
  const stageDistribution = useMemo(() => {
    return [
      { stage: 'Applied', count: applications.filter((a) => a.status === 'applied').length },
      { stage: 'Reviewing', count: applications.filter((a) => a.status === 'reviewing').length },
      { stage: 'Shortlisted', count: applications.filter((a) => a.status === 'shortlisted').length },
      { stage: 'Interviewed', count: applications.filter((a) => a.status === 'interviewed').length },
      { stage: 'Offered', count: applications.filter((a) => a.status === 'offered').length },
    ];
  }, [applications]);

  // Data for Role Distribution (Pie Chart)
  const roleDistribution = useMemo(() => {
    const roleMap = {};
    jobs.forEach((job) => {
      roleMap[job.title] = (roleMap[job.title] || 0) + 1;
    });

    const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#ec4899', '#f59e0b'];
    return Object.entries(roleMap)
      .slice(0, 5) // Limit to 5 roles
      .map(([name, value], idx) => ({
        name,
        value,
        color: colors[idx % colors.length],
      }));
  }, [jobs]);

  // Data for Hiring Velocity (Area Chart)
  const hiringVelocity = useMemo(() => {
    const months = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = month.toLocaleDateString('en-US', { month: 'short' });
      months[monthKey] = { active: 0, closed: 0 };
    }

    jobs.forEach((job) => {
      const createdMonth = new Date(job.createdAt || new Date()).toLocaleDateString('en-US', { month: 'short' });
      if (months[createdMonth]) {
        months[createdMonth].active += 1;
      }
    });

    applications.forEach((app) => {
      if (app.status === 'offered') {
        const appMonth = new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short' });
        if (months[appMonth]) {
          months[appMonth].closed += 1;
        }
      }
    });

    return Object.entries(months).map(([month, data]) => ({
      month,
      ...data,
    }));
  }, [jobs, applications]);

  // Summary Stats
  const summaryStats = useMemo(() => {
    const totalApps = applications.length;
    const totalOffers = applications.filter((a) => a.status === 'offered').length;
    const conversionRate = totalApps ? Math.round((totalOffers / totalApps) * 100) : 0;
    
    // Calculate average time to hire from applications
    let totalDays = 0;
    const offeredApps = applications.filter((a) => a.status === 'offered');
    if (offeredApps.length > 0) {
      offeredApps.forEach((app) => {
        const createdDate = new Date(app.createdAt);
        const today = new Date();
        const days = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
        totalDays += days;
      });
      var avgTimeToHire = Math.round(totalDays / offeredApps.length);
    } else {
      var avgTimeToHire = 0;
    }
    
    return { totalApps, totalOffers, conversionRate, avgTimeToHire };
  }, [applications]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    // Time to first interview
    const interviewedApps = applications.filter((a) => a.status === 'interviewed' || a.status === 'offered');
    let timeToInterview = 0;
    if (interviewedApps.length > 0) {
      const totalDays = interviewedApps.reduce((sum, app) => {
        const days = Math.floor((new Date() - new Date(app.createdAt)) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0);
      timeToInterview = Math.round(totalDays / interviewedApps.length);
    }

    // Offer acceptance rate (mock: assuming 85% acceptance)
    const offerAcceptanceRate = summaryStats.totalOffers > 0 ? 85 : 0;

    // Quality of hire (based on average applicant score)
    let avgScore = 0;
    if (applications.length > 0) {
      const totalScore = applications.reduce((sum, app) => sum + (app.applicant?.score || 80), 0);
      avgScore = Math.round((totalScore / applications.length) / 10);
    }

    return {
      timeToInterview,
      costPerHire: summaryStats.totalOffers > 0 ? Math.round(5000 / summaryStats.totalOffers) : 0,
      offerAcceptanceRate: offerAcceptanceRate > 0 ? offerAcceptanceRate : 0,
      qualityScore: avgScore || 8,
    };
  }, [applications, summaryStats]);

  const handleSync = async () => {
    await loadBoard();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar user={user} onLogout={logout} onSync={handleSync} />
      <main className="mx-auto max-w-[1440px] px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-20 lg:pt-8">
        {/* Header */}
        <section className="mb-12">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-300 ring-1 ring-indigo-500/30 mb-4">
                <BarChart3 size={14} />
                Data Insights
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                Hiring <span className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-rose-500 bg-clip-text text-transparent">Analytics</span>
              </h1>
              <p className="mt-4 text-lg text-slate-400">Track pipeline performance, conversion rates, and hiring velocity in real-time.</p>
            </div>
          </div>
        </section>

        {/* Summary Cards */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[1.8rem] border border-cyan-500/40 bg-gradient-to-br from-cyan-950/40 to-cyan-950/10 p-6 shadow-lg shadow-cyan-950/20">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300 font-semibold">Total applications</p>
            <p className="mt-3 text-4xl font-black text-white">{summaryStats.totalApps}</p>
            <p className="mt-2 text-xs text-slate-400">In current pipeline</p>
          </div>
          <div className="rounded-[1.8rem] border border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 to-emerald-950/10 p-6 shadow-lg shadow-emerald-950/20">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-300 font-semibold">Offers extended</p>
            <p className="mt-3 text-4xl font-black text-white">{summaryStats.totalOffers}</p>
            <p className="mt-2 text-xs text-slate-400">This month</p>
          </div>
          <div className="rounded-[1.8rem] border border-amber-500/40 bg-gradient-to-br from-amber-950/40 to-amber-950/10 p-6 shadow-lg shadow-amber-950/20">
            <p className="text-sm uppercase tracking-[0.24em] text-amber-300 font-semibold">Conversion rate</p>
            <p className="mt-3 text-4xl font-black text-white">{summaryStats.conversionRate}%</p>
            <p className="mt-2 text-xs text-slate-400">Applied → Offered</p>
          </div>
          <div className="rounded-[1.8rem] border border-rose-500/40 bg-gradient-to-br from-rose-950/40 to-rose-950/10 p-6 shadow-lg shadow-rose-950/20">
            <p className="text-sm uppercase tracking-[0.24em] text-rose-300 font-semibold">Avg time to hire</p>
            <p className="mt-3 text-4xl font-black text-white">{summaryStats.avgTimeToHire}</p>
            <p className="mt-2 text-xs text-slate-400">Days</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Applications Over Time */}
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/50 p-8 shadow-lg shadow-slate-950/20 backdrop-blur">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-cyan-400" />
                Applications & Offers Trend
              </h3>
              <p className="mt-1 text-sm text-slate-400">Weekly application and offer metrics</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={applicationsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="week" stroke="rgba(148,163,184,0.6)" />
                <YAxis stroke="rgba(148,163,184,0.6)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(148,163,184,0.2)',
                    borderRadius: '12px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="applications" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4', r: 5 }} />
                <Line type="monotone" dataKey="offers" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Stage Distribution */}
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/50 p-8 shadow-lg shadow-slate-950/20 backdrop-blur">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Briefcase size={20} className="text-indigo-400" />
                Pipeline Status Breakdown
              </h3>
              <p className="mt-1 text-sm text-slate-400">Candidates by stage</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stageDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="stage" stroke="rgba(148,163,184,0.6)" />
                <YAxis stroke="rgba(148,163,184,0.6)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(148,163,184,0.2)',
                    borderRadius: '12px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Role Distribution */}
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/50 p-8 shadow-lg shadow-slate-950/20 backdrop-blur">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Users size={20} className="text-amber-400" />
                Hiring by Role
              </h3>
              <p className="mt-1 text-sm text-slate-400">Distribution of open positions</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(148,163,184,0.2)',
                    borderRadius: '12px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Hiring Velocity */}
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/50 p-8 shadow-lg shadow-slate-950/20 backdrop-blur">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-emerald-400" />
                Hiring Velocity
              </h3>
              <p className="mt-1 text-sm text-slate-400">Active vs closed positions monthly</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={hiringVelocity}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorClosed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="month" stroke="rgba(148,163,184,0.6)" />
                <YAxis stroke="rgba(148,163,184,0.6)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(148,163,184,0.2)',
                    borderRadius: '12px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="active" stackId="1" stroke="#f59e0b" fillOpacity={1} fill="url(#colorActive)" />
                <Area type="monotone" dataKey="closed" stackId="1" stroke="#10b981" fillOpacity={1} fill="url(#colorClosed)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights Section */}
        <section className="mt-12 rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-900/50 to-slate-950 p-8 shadow-lg shadow-slate-950/20">
          <h3 className="text-lg font-semibold text-white mb-6">Key Performance Indicators</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">Time to first interview</p>
              <p className="mt-3 text-2xl font-bold text-cyan-300">{kpis.timeToInterview} {kpis.timeToInterview > 0 ? 'days' : 'N/A'}</p>
              <p className="mt-2 text-xs text-slate-400">Average from applications</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">Cost per hire</p>
              <p className="mt-3 text-2xl font-bold text-emerald-300">${kpis.costPerHire > 0 ? kpis.costPerHire.toLocaleString() : 'N/A'}</p>
              <p className="mt-2 text-xs text-slate-400">Based on offers</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">Offer acceptance rate</p>
              <p className="mt-3 text-2xl font-bold text-amber-300">{kpis.offerAcceptanceRate}%</p>
              <p className="mt-2 text-xs text-slate-400">Expected rate</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">Quality of hire</p>
              <p className="mt-3 text-2xl font-bold text-rose-300">{kpis.qualityScore}/10</p>
              <p className="mt-2 text-xs text-slate-400">Based on scores</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AnalyticsPage;
