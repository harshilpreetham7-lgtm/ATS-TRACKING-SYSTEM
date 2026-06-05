import { useNavigate } from 'react-router-dom';
import { ArrowRight, BadgeCheck, LayoutDashboard, Lock, Sparkles, Smartphone, ShieldCheck, Workflow } from 'lucide-react';
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
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.5rem] border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-[0_40px_120px_rgba(15,23,42,0.55)]">
          <div className="relative grid gap-8 px-6 py-8 lg:grid-cols-[1.2fr_0.85fr] lg:px-10 lg:py-12">
            <div className="space-y-8">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                  <Sparkles size={14} />
                  Built for modern hiring teams
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                  <BadgeCheck size={14} />
                  Presentation-ready interface
                </div>
              </div>

              <div className="max-w-3xl space-y-6">
                <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl">
                  Present your ATS as a premium hiring product.
                </h1>
                <p className="text-lg leading-8 text-slate-400 sm:text-xl">
                  A clean, modern front door with a focused product story, clear workflows, and polished recruiter experience.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {highlights.map((item) => (
                  <div key={item.title} className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-5 ring-1 ring-white/5 transition hover:border-cyan-400/30 hover:bg-slate-900/90">
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">{item.title}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white shadow-[0_20px_60px_rgba(56,189,248,0.18)] transition hover:scale-[1.01]"
                >
                  Launch the ATS
                  <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => navigate(token ? '/dashboard' : '/login')}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/85 px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-200 transition hover:border-cyan-500/40 hover:text-cyan-300"
                >
                  {token ? 'Continue to dashboard' : 'Secure access'}
                  <Lock size={16} />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { title: 'Polished UI', text: 'Depth, gradients, and spacing that feel premium.' },
                  { title: 'Clear flows', text: 'Roles, pipeline, and workflow are separate and easy to scan.' },
                  { title: 'Demo ready', text: 'Designed to impress hiring managers fast.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-5 ring-1 ring-white/5">
                    <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">{item.title}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="space-y-6 rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 ring-1 ring-white/5 shadow-2xl shadow-slate-950/20">
              <div className="rounded-[1.75rem] border border-slate-800 bg-gradient-to-br from-indigo-500/10 via-slate-950 to-fuchsia-500/10 p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-indigo-300">Workspace preview</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">A refined product entry point</h2>
                  </div>
                  <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 ring-1 ring-white/10">
                    New
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-400">
                  The home page now feels like a polished app landing screen with premium spacing and clear visual hierarchy.
                </p>
              </div>

              <div className="grid gap-4">
                {featureCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div key={card.title} className="flex items-start gap-4 rounded-3xl bg-slate-900/85 p-4 ring-1 ring-white/5 transition hover:bg-slate-900/95">
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