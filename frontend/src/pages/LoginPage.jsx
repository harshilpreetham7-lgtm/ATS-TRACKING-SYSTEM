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
      <div className="relative mx-auto grid min-h-screen max-w-[1440px] grid-cols-1 items-center gap-8 overflow-hidden px-4 py-8 sm:px-6 lg:grid-cols-[1.5fr_0.95fr] lg:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.18),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.16),_transparent_28%)]" />
        <section className="relative z-10 overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-900/95 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.45)] backdrop-blur-xl lg:p-12">
          <div className="absolute -right-16 top-8 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute left-8 bottom-10 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-emerald-300 shadow-sm shadow-emerald-500/10">
              <CheckCircle2 size={15} />
              Designed for modern recruiting teams
            </div>
            <div className="max-w-2xl space-y-5">
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">A polished hiring workspace for recruiters who want impact and speed.</h1>
              <p className="text-base leading-8 text-slate-400 sm:text-lg">
                Clean onboarding, strong role clarity, and pipeline analytics in a premium interface built for demos and real recruiting workflows.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.8rem] border border-slate-800/90 bg-slate-950/80 p-5 shadow-lg shadow-slate-950/20 transition hover:border-cyan-500/40">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Instant visibility</p>
                <p className="mt-3 text-lg font-semibold text-white">Keep every candidate stage clear.</p>
              </div>
              <div className="rounded-[1.8rem] border border-slate-800/90 bg-slate-950/80 p-5 shadow-lg shadow-slate-950/20 transition hover:border-violet-500/40">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Team velocity</p>
                <p className="mt-3 text-lg font-semibold text-white">Coordinate faster decisions with confidence.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                ['Fast', 'Launch the dashboard without delay'],
                ['Clear', 'Structured stages and modern layout'],
                ['Confident', 'Looks great for presentations'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-[1.8rem] border border-slate-800/90 bg-slate-950/75 p-4 text-sm text-slate-300 transition hover:border-indigo-500/40 hover:bg-slate-900/90">
                  <p className="font-semibold uppercase tracking-[0.28em] text-cyan-300">{title}</p>
                  <p className="mt-3 leading-6">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-10 rounded-[2rem] border border-slate-800/80 bg-slate-900/95 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.45)] backdrop-blur-xl lg:p-10">
          <div className="absolute inset-x-4 top-4 h-2 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 opacity-30" />
          <div className="relative z-10 space-y-7">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">{mode === 'login' ? 'Secure sign in' : 'Create your access'}</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">{mode === 'login' ? 'Welcome back' : 'Join the ATS workspace'}</h2>
              </div>
              <span className="rounded-full bg-slate-950/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-300 ring-1 ring-indigo-500/20">
                {mode === 'login' ? 'Recruiter login' : 'Registration'}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'register' && (
                <div>
                  <label className="text-sm font-semibold text-slate-300">Full name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jane Foster"
                    required
                    className="mt-3 w-full rounded-[1.25rem] border border-slate-700 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
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
                  className="mt-3 w-full rounded-[1.25rem] border border-slate-700 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
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
                    className="w-full rounded-[1.25rem] border border-slate-700 bg-slate-950/80 px-4 py-3 pr-12 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
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
                        className="w-full rounded-[1.25rem] border border-slate-700 bg-slate-950/80 px-4 py-3 pr-12 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
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
                      className="mt-3 w-full rounded-[1.25rem] border border-slate-700 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                    >
                      <option value="recruiter">Recruiter</option>
                      <option value="candidate">Candidate</option>
                    </select>
                  </div>
                </>
              )}
              {(formError || error) && (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 rounded-[1.25rem] border border-rose-500/30 bg-rose-500/10 p-4">
                    <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-rose-400" />
                    <p className="text-sm text-rose-200">{formError || error}</p>
                  </div>
                  {error && error.includes('Unable to connect') && (
                    <p className="text-xs text-slate-400">
                      Check that the mock backend is running at{' '}
                      <span className="font-semibold text-slate-100">http://localhost:5004</span>.
                    </p>
                  )}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-[1.25rem] bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-xl shadow-cyan-500/30 transition duration-300 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2 text-slate-950">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                    {mode === 'login' ? 'Signing in...' : 'Registering...'}
                  </span>
                ) : mode === 'login' ? (
                  'Sign in to Dashboard'
                ) : (
                  'Create my recruiter account'
                )}
              </button>
            </form>

            <div className="mt-8 border-t border-slate-800/80 pt-6 text-center">
              <p className="text-sm text-slate-500">
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
                  {mode === 'login' ? 'Create an account' : 'Sign in instead'}
                </button>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
