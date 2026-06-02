import { useNavigate } from 'react-router-dom';
import { ArrowRight, BadgeCheck, CheckCircle2, LayoutDashboard, Lock, Sparkles, Star, Smartphone, ShieldCheck, Workflow } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const HomePage = () => {
  const navigate = useNavigate();
  const token = useAppStore((state) => state.token);

  const highlights = [
    { title: 'Live hiring', description: 'Real-time pipeline updates and clean candidate flow.' },
    { title: 'Role catalogs', description: 'Browse roles like featured apps with focused details.' },
    { title: 'Workflow pages', description: 'Open module-specific screens for deeper actions.' },
  ];

  const featureCards = [
    {
      title: 'Recruitment Command Center',
      text: 'A polished app shell designed to feel like something people want to open every day.',
      icon: Smartphone,
    },
    {
      title: 'Secure and simple',
      text: 'Login, register, and move into the ATS without clutter or confusing steps.',
      icon: ShieldCheck,
    },
    {
      title: 'Module-driven flow',
      text: 'Roles, pipeline, and workflow pages are separated like an actual product suite.',
      icon: Workflow,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <div className="overflow-hidden rounded-[2.25rem] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl shadow-slate-950/40">
          <div className="grid gap-8 px-5 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-10">
            <section className="space-y-8">
              <p className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-indigo-300">
                <Sparkles size={14} />
                Featured ATS
              </p>

              <div className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Ready for HR demo review
              </div>

              <div>
                <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Open the ATS like a premium hiring product, not a form page.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                  Built with a polished opener, app-like sections, and distinct pages for roles, pipeline, and workflows so the product feels complete at first glance.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {highlights.map((item) => (
                  <div key={item.title} className="rounded-[1.5rem] border border-slate-800 bg-slate-950/80 p-5 ring-1 ring-white/5">
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">{item.title}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-50 shadow-lg shadow-indigo-500/30 transition hover:from-indigo-400 hover:to-cyan-400 hover:shadow-indigo-500/40"
                >
                  Launch app
                  <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => navigate(token ? '/dashboard' : '/login')}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-200 transition hover:border-indigo-500/40 hover:text-indigo-300"
                >
                  {token ? 'Open dashboard' : 'Secure access'}
                  <Lock size={16} />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { title: 'Home', text: 'A clean app launch screen with a premium look.' },
                  { title: 'Login', text: 'Secure sign-in with recruiter or candidate access.' },
                  { title: 'Workspace', text: 'Roles, pipeline, and workflow pages stay separate.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-[1.5rem] border border-slate-800 bg-slate-950/80 p-5 ring-1 ring-white/5">
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">{item.title}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ['Polished UI', 'Dark gradients, soft depth, and sharp spacing.'],
                  ['Workflow clarity', 'Recruiter actions are separated by stage.'],
                  ['Review ready', 'Screens are structured for live presentation.'],
                ].map(([label, detail]) => (
                  <div key={label} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 ring-1 ring-white/5">
                    <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">{label}</p>
                    <p className="mt-2 text-sm text-slate-400">{detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <aside className="space-y-4 rounded-[2rem] border border-slate-800 bg-slate-950/80 p-5 ring-1 ring-white/5 lg:p-6">
              <div className="rounded-[1.75rem] border border-slate-800 bg-gradient-to-br from-indigo-500/10 via-slate-950 to-purple-500/10 p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-indigo-300">App preview</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Designed like a store listing</h2>
                <p className="mt-4 text-sm leading-6 text-slate-400">
                  Strong opener, clear benefits, and a path that feels natural on first open.
                </p>
              </div>

              <div className="grid gap-4">
                {featureCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div key={card.title} className="flex items-start gap-4 rounded-3xl bg-slate-900/80 p-4 ring-1 ring-white/5">
                      <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-300 ring-1 ring-indigo-500/20">
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{card.title}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{card.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => navigate('/roles')}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:border-cyan-500/40 hover:text-cyan-300"
                >
                  Browse roles
                  <Workflow size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:border-cyan-500/40 hover:text-cyan-300"
                >
                  Open dashboard
                  <LayoutDashboard size={16} />
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;