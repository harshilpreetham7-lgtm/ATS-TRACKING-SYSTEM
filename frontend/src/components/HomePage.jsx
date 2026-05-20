import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, LayoutDashboard, Lock, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const HomePage = () => {
  const navigate = useNavigate();
  const token = useAppStore((state) => state.token);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.25rem] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl shadow-slate-950/40">
          <div className="grid gap-10 px-6 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-14">
            <section>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300">
                <Sparkles size={14} />
                ATS home screen
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                A polished recruitment experience from landing page to final offer.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                Start with a professional home page, sign in securely, then move into a modern ATS workspace with role cards, hiring stages, and full-page workflow modules.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-sky-400"
                >
                  Go to login
                  <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => navigate(token ? '/dashboard' : '/login')}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-200 transition hover:border-cyan-500/40 hover:text-cyan-300"
                >
                  {token ? 'Open dashboard' : 'Secure access'}
                  <Lock size={16} />
                </button>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { title: 'Home', text: 'Clear entry with product-first messaging.' },
                  { title: 'Login', text: 'Simple secure sign-in with recruiter or candidate access.' },
                  { title: 'Dashboard', text: 'Live hiring data and module-based workflows.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-[1.5rem] border border-slate-800 bg-slate-950/80 p-5 ring-1 ring-white/5">
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">{item.title}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <aside className="grid gap-4 rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 ring-1 ring-white/5">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Why this layout works</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Presentation-first, workspace-ready</h2>
              </div>
              <div className="space-y-4">
                {[
                  'Professional dark theme with cyan highlights',
                  'Home page, login page, and main dashboard separation',
                  'Full-page module drill-down for every role type',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-3xl bg-slate-900/80 p-4 ring-1 ring-white/5">
                    <CheckCircle2 className="mt-0.5 text-emerald-400" size={18} />
                    <p className="text-sm leading-6 text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="mt-auto inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:border-cyan-500/40 hover:text-cyan-300"
              >
                Open ATS dashboard
                <LayoutDashboard size={16} />
              </button>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;