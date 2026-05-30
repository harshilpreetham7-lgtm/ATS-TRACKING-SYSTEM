import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register, user, error, loading, token } = useAppStore();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'candidate' });

  useEffect(() => {
    if (token && user) {
      navigate('/dashboard');
    }
  }, [token, user, navigate]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      email: form.email,
      password: form.password,
      name: form.name,
      role: form.role,
      company: form.role === 'recruiter' ? form.company || 'ATS Team' : undefined,
    };
    const success = mode === 'login' ? await login(payload) : await register(payload);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-[1440px] grid-cols-1 items-center gap-8 px-4 py-4 sm:px-6 lg:grid-cols-[1.35fr_0.9fr] lg:py-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/90 p-7 shadow-2xl shadow-slate-950/40 backdrop-blur-lg lg:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-600/10 blur-3xl animate-float" />
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
            <CheckCircle2 size={14} />
            Built for recruiter demos and HR review
          </div>
          <div className="inline-flex rounded-full bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-300 ring-1 ring-indigo-500/20">
            Built for modern recruiting teams
          </div>
          <h1 className="mt-7 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Real-time hiring intelligence that recruiters love.
          </h1>
          <p className="mt-6 max-w-xl text-slate-400 sm:text-lg">
            Manage pipelines, move candidates instantly, and surface the right hires with a premium ATS experience designed to impress HR teams.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-lg shadow-slate-950/20">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Live Collaboration</p>
              <p className="mt-3 text-lg font-semibold text-white">Instant status updates across your team.</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-lg shadow-slate-950/20">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Smart Pipeline</p>
              <p className="mt-3 text-lg font-semibold text-white">AI-ready workflow with easy drag-and-drop actions.</p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-slate-800/80 p-5 ring-1 ring-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">Why this ATS stands out</p>
            <ul className="mt-5 space-y-3 text-slate-400">
              <li>• Visual hiring pipeline for every role.</li>
              <li>• Real-time candidate updates and notifications.</li>
              <li>• Clean recruiter-first dashboard and job insights.</li>
            </ul>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ['Fast', 'Launch in one click'],
              ['Clear', 'Stages and actions are obvious'],
              ['Professional', 'Looks presentation-ready'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-left ring-1 ring-white/5">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">{title}</p>
                <p className="mt-2 text-sm text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative rounded-[2rem] border border-slate-800 bg-slate-900/95 p-7 shadow-2xl shadow-slate-950/40 backdrop-blur-lg lg:p-9">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">{mode === 'login' ? 'Sign in to your team portal' : 'Create a recruiter account'}</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">{mode === 'login' ? 'Welcome back' : 'Get started'}</h2>
            </div>
            <div className="rounded-3xl bg-slate-950/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-indigo-300 ring-1 ring-indigo-500/20">
              {mode === 'login' ? 'Secure login' : 'Fast onboarding'}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-sm font-medium text-slate-300">Full name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-slate-300">Email address</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                required
                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Password</label>
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                required
                className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
              />
            </div>
            {mode === 'register' && (
              <div>
                <label className="text-sm font-medium text-slate-300">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
                >
                  <option value="candidate">Candidate</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              </div>
            )}
            {error && <p className="text-sm text-rose-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-3xl bg-gradient-to-r from-rose-500 to-amber-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-50 shadow-xl shadow-rose-500/25 transition hover:from-rose-400 hover:to-amber-400 hover:shadow-rose-500/35"
            >
              {loading ? 'Working...' : mode === 'login' ? 'Login' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-800 pt-5 text-center text-sm text-slate-500">
            <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="font-semibold text-white hover:text-indigo-300">
              {mode === 'login' ? 'Create a recruiter account' : 'Already have an account? Login'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
