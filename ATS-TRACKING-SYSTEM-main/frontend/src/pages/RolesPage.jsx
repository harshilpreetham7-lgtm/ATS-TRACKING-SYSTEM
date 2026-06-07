import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Briefcase, CheckCircle2, ListChecks, ShieldCheck, Sparkles, SlidersHorizontal, Star } from 'lucide-react';
import NavBar from '../components/NavBar';
import BackButton from '../components/BackButton';
import { useAppStore } from '../store/useAppStore';
import { workflowModules } from '../data/workflowModules';

const roleModule = workflowModules.find((module) => module.id === 'role-selection');
const featuredRoleIds = ['frontend', 'backend', 'product', 'mobile'];

const RolesPage = () => {
  const navigate = useNavigate();
  const { user, logout, loadBoard } = useAppStore();
  const [selectedRoleId, setSelectedRoleId] = useState(roleModule?.roles?.[0]?.id || '');
  const [roleFilter, setRoleFilter] = useState('all');

  const selectedRole = useMemo(() => roleModule?.roles?.find((role) => role.id === selectedRoleId) || roleModule?.roles?.[0], [selectedRoleId]);

  const featuredRoles = useMemo(
    () => roleModule?.roles?.filter((role) => featuredRoleIds.includes(role.id)) || [],
    []
  );

  const displayedRoles = useMemo(() => {
    const roles = roleModule?.roles || [];
    if (roleFilter === 'all') return roles;
    if (roleFilter === 'featured') return featuredRoles;
    return roles.filter((role) => role.engagement.toLowerCase().includes(roleFilter));
  }, [roleFilter, featuredRoles]);

  const recommendedRoles = useMemo(() => {
    const roles = displayedRoles.length ? displayedRoles : roleModule?.roles || [];
    return roles.slice(0, 3);
  }, [displayedRoles]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar user={user} onLogout={logout} onSync={loadBoard} />
      <main className="mx-auto max-w-[1440px] px-4 pb-10 pt-4 sm:px-6 lg:px-8 lg:pb-12 lg:pt-5">
        <div className="mb-4 flex items-center justify-start">
          <BackButton to="/dashboard" />
        </div>
        <section className="rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-2xl shadow-slate-950/30 lg:p-7">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-indigo-300">
                <Sparkles size={14} />
                Role catalog
              </p>
              <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Browse roles like a modern app store.</h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">
                Featured roles appear first, filters keep the grid clean, and every card opens a detail view with the exact fields the candidate must provide.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {[
                  { icon: BadgeCheck, label: 'Verified roles' },
                  { icon: ShieldCheck, label: 'Clean workflow' },
                  { icon: Star, label: 'Review-ready experience' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                      <Icon size={14} className="text-emerald-300" />
                      {item.label}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/80 p-4 shadow-lg shadow-slate-950/20 ring-1 ring-white/5">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Candidate confidence</p>
              <p className="mt-3 text-sm text-slate-300">Clear role cards, a detailed preview panel, and one-click workflow access make the platform feel ready for real hiring reviews.</p>
              <button
                type="button"
                onClick={() => navigate('/workflow?module=role-selection&role=' + selectedRole?.id)}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-50 shadow-lg shadow-emerald-500/35 transition hover:from-emerald-400 hover:to-teal-400 hover:shadow-emerald-500/45"
              >
                Open workflow form
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Featured roles', value: featuredRoles.length },
              { label: 'All roles', value: roleModule?.roles?.length || 0 },
              { label: 'Open workflow pages', value: '1 click' },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.5rem] border border-slate-800 bg-slate-950/90 p-5 shadow-lg shadow-slate-950/20 ring-1 ring-white/5">
                <p className="text-xs uppercase tracking-[0.26em] text-indigo-300">{item.label}</p>
                <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {[
              {
                title: 'Trust signal',
                text: 'Candidates see role details, required fields, and next steps immediately so the platform feels structured and real.',
              },
              {
                title: 'Selection clarity',
                text: 'Featured roles, filters, and a fixed detail preview reduce uncertainty when choosing what to apply for.',
              },
              {
                title: 'Professional finish',
                text: 'Dark gradients, compact cards, and deliberate spacing give the product a polished hiring-suite look.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[1.5rem] border border-slate-800 bg-slate-950/80 p-5 ring-1 ring-white/5">
                <p className="text-xs uppercase tracking-[0.26em] text-emerald-300">{item.title}</p>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-5 shadow-2xl shadow-slate-950/24 lg:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">Featured roles</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">Best starting points</h2>
                  </div>
                  <p className="text-sm text-slate-400">Four highlighted cards</p>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'featured', label: 'Featured' },
                    { id: 'full-time', label: 'Full-time' },
                    { id: 'part-time', label: 'Part-time' },
                  ].map((item) => {
                    const active = roleFilter === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setRoleFilter(item.id)}
                        className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition ${active ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-slate-50 shadow-lg shadow-rose-500/40' : 'bg-slate-900/60 text-slate-300 ring-1 ring-white/5 hover:bg-slate-800/80 hover:text-rose-300 hover:ring-rose-400/50'}`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {featuredRoles.map((role) => {
                    const active = selectedRole?.id === role.id;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRoleId(role.id)}
                        className={`group relative overflow-hidden rounded-[1.6rem] border p-4 text-left shadow-lg shadow-slate-950/15 transition hover:-translate-y-1 ${active ? 'border-emerald-500/60 bg-emerald-500/10 ring-1 ring-emerald-500/20' : 'border-slate-800 bg-slate-950/90 hover:border-emerald-500/30 hover:bg-slate-900 hover:shadow-emerald-500/10'}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 transition group-hover:opacity-100" />
                        <div className="flex items-start justify-between gap-3">
                          <Briefcase className={active ? 'text-emerald-300' : 'text-slate-500'} size={18} />
                          {active && <CheckCircle2 className="text-emerald-400" size={16} />}
                        </div>
                        <div className="relative z-10">
                          <h3 className="mt-4 text-lg font-semibold text-white">{role.label}</h3>
                          <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-400">{role.level} • {role.engagement}</p>
                          <p className="mt-3 text-sm leading-6 text-slate-300">{role.summary}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className="rounded-full bg-slate-900/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300 ring-1 ring-white/5">Open role</span>
                            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300 ring-1 ring-emerald-500/20">Trusted fit</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-5 shadow-2xl shadow-slate-950/24 lg:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">All roles</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">Complete role library</h2>
                  </div>
                  <p className="text-sm text-slate-400">{roleModule?.roles?.length || 0} roles</p>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {displayedRoles.map((role) => {
                    const active = selectedRole?.id === role.id;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRoleId(role.id)}
                        className={`group relative overflow-hidden rounded-[1.6rem] border p-4 text-left shadow-lg shadow-slate-950/15 transition hover:-translate-y-1 ${active ? 'border-emerald-500/60 bg-emerald-500/10 ring-1 ring-emerald-500/20' : 'border-slate-800 bg-slate-950/90 hover:border-emerald-500/30 hover:bg-slate-900 hover:shadow-emerald-500/10'}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 transition group-hover:opacity-100" />
                        <div className="flex items-start justify-between gap-3">
                          <Briefcase className={active ? 'text-emerald-300' : 'text-slate-500'} size={18} />
                          {active && <CheckCircle2 className="text-emerald-400" size={16} />}
                        </div>
                        <div className="relative z-10">
                          <h3 className="mt-4 text-lg font-semibold text-white">{role.label}</h3>
                          <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-400">{role.level} • {role.engagement}</p>
                          <p className="mt-3 text-sm leading-6 text-slate-300">{role.summary}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className="rounded-full bg-slate-900/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300 ring-1 ring-white/5">Open role</span>
                            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300 ring-1 ring-emerald-500/20">Trusted fit</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="sticky top-6 self-start rounded-[2rem] border border-slate-800 bg-slate-900/90 p-5 shadow-2xl shadow-slate-950/20 lg:p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">Role detail</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{selectedRole?.label}</h2>
              <p className="mt-4 text-sm leading-6 text-slate-400">{selectedRole?.summary}</p>

              <div className="mt-6 grid gap-3 rounded-[1.5rem] bg-slate-950/80 p-4 ring-1 ring-white/5">
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-900/80 p-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Level</p>
                    <p className="mt-1 font-semibold text-white">{selectedRole?.level}</p>
                  </div>
                  <CheckCircle2 className="text-emerald-400" size={16} />
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-900/80 p-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Engagement</p>
                    <p className="mt-1 font-semibold text-white">{selectedRole?.engagement}</p>
                  </div>
                  <CheckCircle2 className="text-emerald-400" size={16} />
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-900/80 p-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Department</p>
                    <p className="mt-1 font-semibold text-white">Product Engineering</p>
                  </div>
                  <CheckCircle2 className="text-emerald-400" size={16} />
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] bg-slate-950/80 p-4 ring-1 ring-white/5">
                <p className="text-xs uppercase tracking-[0.24em] text-indigo-300">Required fields</p>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  {(roleModule?.fields || []).map((field) => {
                    let helperText = field.placeholder || 'Enter the required value for this field.';
                    if (field.name === 'roleTitle') helperText = selectedRole?.label || helperText;
                    if (field.name === 'department') helperText = 'Product Engineering';
                    if (field.name === 'engagement') helperText = selectedRole?.engagement || helperText;
                    if (field.name === 'level') helperText = selectedRole?.level || helperText;
                    if (field.name === 'summary') helperText = selectedRole?.summary || helperText;

                    return (
                      <div key={field.name} className="flex items-start gap-3 rounded-2xl bg-slate-900/80 p-3">
                        <ListChecks className="mt-0.5 text-indigo-300" size={16} />
                        <div>
                          <p className="font-semibold text-white">{field.label}</p>
                          <p className="text-slate-400">{helperText}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-emerald-500/20 bg-emerald-500/5 p-4 ring-1 ring-emerald-500/10">
                <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">Why this role fits</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {selectedRole?.summary} The platform makes this role feel credible by showing the level, engagement type, expected submission fields, and the full workflow before the candidate applies.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/workflow?module=role-selection&role=${selectedRole.id}`)}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-50 shadow-lg shadow-emerald-500/35 transition hover:from-emerald-400 hover:to-teal-400 hover:shadow-emerald-500/45"
                >
                  Open workflow form
                  <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setRoleFilter('all')}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/80 px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200 transition hover:border-indigo-500/40 hover:text-indigo-300"
                >
                  <SlidersHorizontal size={16} />
                  Reset filters
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/24 ring-1 ring-white/5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Recommended roles</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">A cleaner starting point for candidates</h2>
              </div>
              <p className="text-sm text-slate-400">Roles shown based on the current filter</p>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {recommendedRoles.map((role, index) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRoleId(role.id)}
                  className="group rounded-[1.5rem] border border-slate-800 bg-slate-950/90 p-5 text-left transition hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">0{index + 1}</p>
                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300 ring-1 ring-cyan-500/20">
                      Recommended
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{role.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{role.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.22em] text-slate-300">
                    <span className="rounded-full bg-slate-900 px-3 py-1 ring-1 ring-white/5">{role.level}</span>
                    <span className="rounded-full bg-slate-900 px-3 py-1 ring-1 ring-white/5">{role.engagement}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RolesPage;