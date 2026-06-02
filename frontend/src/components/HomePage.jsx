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
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">
                ATS Platform
              </p>

              <div>
                <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-5xl">
                  Manage your recruiting workflow simply and professionally.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                  A clean, professional interface for roles, candidates, pipeline tracking, and hiring workflows.
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
                  className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-100 transition hover:bg-slate-700"
                >
                  Launch App
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {highlights.map((item) => (
                  <div key={item.title} className="rounded-[1.5rem] border border-slate-800 bg-slate-950/80 p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{item.title}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <aside className="space-y-4 rounded-[2rem] border border-slate-800 bg-slate-950/80 p-5 lg:p-6">
              <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Getting started</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Recruitment workspace</h2>
                <p className="mt-4 text-sm leading-6 text-slate-400">
                  Simple, professional interface for managing your hiring workflow.
                </p>
              </div>

              <div className="grid gap-4">
                {featureCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div key={card.title} className="flex items-start gap-4 rounded-3xl bg-slate-900/80 p-4">
                      <div className="rounded-2xl bg-slate-900/80 p-3 text-slate-400">
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
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-300 transition hover:bg-slate-800"
                >
                  Browse roles
                  <Workflow size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => navigate(token ? '/dashboard' : '/login')}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-300 transition hover:bg-slate-800"
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