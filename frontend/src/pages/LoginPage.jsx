import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register, user, error, loading, token } = useAppStore();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'recruiter' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (token && user) {
      navigate('/dashboard');
    }
  }, [token, user, navigate]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setFormError('');
  };

  const validateForm = () => {
    if (!form.email || !form.password) {
      setFormError('Email and password are required');
      return false;
    }
    if (mode === 'register') {
      if (!form.name) {
        setFormError('Name is required');
        return false;
      }
      if (form.password.length < 6) {
        setFormError('Password must be at least 6 characters');
        return false;
      }
      if (form.password !== form.confirmPassword) {
        setFormError('Passwords do not match');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    
    if (!validateForm()) {
      return;
    }

    const payload = {
      email: form.email,
      password: form.password,
      ...(mode === 'register' && { name: form.name, role: form.role }),
    };
    
    mode === 'login' ? await login(payload) : await register(payload);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-[1440px] grid-cols-1 items-center gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1.45fr_0.85fr] lg:py-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-[0_30px_100px_rgba(15,23,42,0.45)] backdrop-blur-lg lg:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gradient-to-br from-sky-500/15 to-violet-500/10 blur-3xl animate-float" />
          <div className="pointer-events-none absolute -left-16 bottom-12 h-64 w-64 rounded-full bg-gradient-to-tr from-rose-500/10 to-amber-400/5 blur-3xl" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
              <CheckCircle2 size={14} />
              Built for recruiter demos and HR review
            </div>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">
              HR-grade hiring intelligence in a premium presentation-ready interface.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Clean recruiter onboarding, crisp candidate flow, and polished pipeline controls designed to impress your team and your audience.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-lg shadow-slate-950/20 transition hover:border-cyan-500/30">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Live collaboration</p>
                <p className="mt-3 text-lg font-semibold text-white">Team updates appear instantly.</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-lg shadow-slate-950/20 transition hover:border-indigo-500/30">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Smooth pipeline</p>
                <p className="mt-3 text-lg font-semibold text-white">Clear stages, cleaner reviews.</p>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-800/80 p-6 ring-1 ring-white/10">
              <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">Why this ATS feels premium</p>
              <ul className="mt-4 grid gap-3 text-slate-400 sm:grid-cols-2">
                <li>• Polished layouts that look demo-ready.</li>
                <li>• Crisp team and role workflows.</li>
                <li>• Modern gradients and subtle motion.</li>
                <li>• A recruiter-first experience with clarity.</li>
              </ul>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ['Fast', 'Launch in one click'],
                ['Clear', 'Stages and actions are obvious'],
                ['Professional', 'Looks polished and confident'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 ring-1 ring-white/5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">{title}</p>
                  <p className="mt-2 text-sm text-slate-400">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-[0_30px_100px_rgba(15,23,42,0.45)] backdrop-blur-lg lg:p-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">{mode === 'login' ? 'Sign in to the ATS workspace' : 'Create your recruiter profile'}</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">{mode === 'login' ? 'Welcome back' : 'Get started'}</h2>
            </div>
            <div className="rounded-3xl bg-slate-950/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-300 ring-1 ring-indigo-500/20">
              {mode === 'login' ? 'Secure access' : 'Fast onboarding'}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
            {mode === 'register' && (
              <div>
                <label className="text-sm font-semibold text-slate-300">Full name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="mt-3 w-full rounded-[1.2rem] border border-slate-700 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-semibold text-slate-300">Email address</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder="you@example.com"
                required
                className="mt-3 w-full rounded-[1.2rem] border border-slate-700 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-300">Password</label>
              <div className="relative mt-3">
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-[1.2rem] border border-slate-700 bg-slate-950/80 px-4 py-3 pr-12 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {mode === 'register' && (
              <>
                <div>
                  <label className="text-sm font-semibold text-slate-300">Confirm password</label>
                  <div className="relative mt-3">
                    <input
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      required
                      className="w-full rounded-[1.2rem] border border-slate-700 bg-slate-950/80 px-4 py-3 pr-12 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-300">Choose your role</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="mt-3 w-full rounded-[1.2rem] border border-slate-700 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                  >
                    <option value="recruiter">Recruiter</option>
                    <option value="candidate">Candidate</option>
                  </select>
                </div>
              </>
            )}
            {(formError || error) && (
              <div className="flex items-start gap-3 rounded-[1.2rem] border border-rose-500/30 bg-rose-500/10 p-4">
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-rose-400" />
                <p className="text-sm text-rose-200">{formError || error}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-[1.2rem] bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-xl shadow-indigo-600/40 transition duration-300 hover:from-indigo-500 hover:to-indigo-600 hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : mode === 'login' ? (
                'Sign in to Dashboard'
              ) : (
                'Create my recruiter account'
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-slate-800 pt-6">
            <p className="text-center text-sm text-slate-500">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setFormError('');
                  setForm({ name: '', email: '', password: '', confirmPassword: '', role: 'recruiter' });
                }}
                className="font-semibold text-cyan-300 transition hover:text-cyan-200"
              >
                {mode === 'login' ? 'Create a recruiter account' : 'Sign in instead'}
              </button>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
