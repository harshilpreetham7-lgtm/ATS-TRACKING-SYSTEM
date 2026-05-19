import React from 'react';
import { ChevronRight, CheckCircle2, Clock, FileText, Briefcase, Users, PenTool, BadgeCheck, XCircle } from 'lucide-react';

const iconMap = {
  role: Briefcase,
  data: FileText,
  review: CheckCircle2,
  shortlist: Users,
  interview: PenTool,
  offer: BadgeCheck,
  rejection: XCircle,
  timeline: Clock,
};

const accentMap = {
  cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200 ring-cyan-500/20',
  sky: 'border-sky-500/30 bg-sky-500/10 text-sky-200 ring-sky-500/20',
  emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200 ring-emerald-500/20',
  violet: 'border-violet-500/30 bg-violet-500/10 text-violet-200 ring-violet-500/20',
  rose: 'border-rose-500/30 bg-rose-500/10 text-rose-200 ring-rose-500/20',
  amber: 'border-amber-500/30 bg-amber-500/10 text-amber-200 ring-amber-500/20',
};

const WorkflowModuleExplorer = ({ modules, activeModuleId, onSelectModule, selectedRoleType, onSelectRoleType, selectedRole, onSelectRole }) => {
  const activeModule = modules.find((module) => module.id === activeModuleId) || modules[0];
  const ActiveIcon = iconMap[activeModule.icon] || Briefcase;

  return (
    <div className="rounded-[2rem] border border-slate-800 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Workflow modules</p>
          <h2 className="mt-3 text-3xl font-bold text-white">Click a module to see exactly what data, steps, and conditions it needs.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">
            Use these modules to define roles, review candidates, shortlist for interviews, issue offers, and close rejections with a professional hiring process.
          </p>
        </div>
        <div className="rounded-full bg-slate-900/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300 ring-1 ring-white/10">
          Same dark system, modular workflow
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          {modules.map((module) => {
            const ModuleIcon = iconMap[module.icon] || Briefcase;
            const isActive = module.id === activeModule.id;
            return (
              <button
                key={module.id}
                type="button"
                onClick={() => onSelectModule(module.id)}
                className={`group w-full rounded-[1.5rem] border p-4 text-left transition ${isActive ? `${accentMap[module.accent]} ring-1` : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`rounded-2xl p-3 ${isActive ? 'bg-white/5' : 'bg-slate-950/60'} ring-1 ring-white/5`}>
                    <ModuleIcon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">{module.title}</p>
                      <ChevronRight size={16} className={`${isActive ? 'text-cyan-300' : 'text-slate-500'} transition group-hover:translate-x-1`} />
                    </div>
                    <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">{module.subtitle}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{module.summary}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/80 p-5">
          <div className={`rounded-[1.5rem] border p-4 ${accentMap[activeModule.accent]}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                  <ActiveIcon size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Active module</p>
                  <h3 className="mt-1 text-2xl font-semibold text-white">{activeModule.title}</h3>
                </div>
              </div>
              <span className="rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300 ring-1 ring-white/10">
                {activeModule.badge}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-100/90">{activeModule.description}</p>
          </div>

          {activeModule.id === 'role-selection' ? (
            <div className="mt-5 space-y-5">
              <div className="rounded-[1.5rem] bg-slate-950/80 p-4 ring-1 ring-white/5">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Engagement type</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {activeModule.engagements.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectRoleType(item.id)}
                      className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition ${selectedRoleType === item.id ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {activeModule.engagements.map((item) => (
                    <div key={item.id} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[1.5rem] bg-slate-950/80 p-4 ring-1 ring-white/5">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Role families</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {activeModule.roles
                    .filter((role) => selectedRoleType === 'all' || role.engagement.toLowerCase().includes(selectedRoleType))
                    .map((role) => {
                      const selected = selectedRole?.id === role.id;
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => onSelectRole(role)}
                          className={`rounded-[1.25rem] border p-4 text-left transition ${selected ? 'border-cyan-500/60 bg-cyan-500/10 ring-1 ring-cyan-500/20' : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'}`}
                        >
                          <p className="text-sm font-semibold text-white">{role.label}</p>
                          <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">{role.level} • {role.engagement}</p>
                          <p className="mt-3 text-sm leading-6 text-slate-400">{role.summary}</p>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5 space-y-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {(activeModule.requirements || []).map((item) => (
                  <div key={item} className="rounded-3xl bg-slate-950/80 p-4 ring-1 ring-white/5">
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Required</p>
                    <p className="mt-3 text-sm text-slate-200">{item}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-[1.5rem] bg-slate-950/80 p-4 ring-1 ring-white/5">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">How it works</p>
                <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                  {activeModule.steps.map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-xs font-semibold text-cyan-300 ring-1 ring-cyan-500/20">{index + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rounded-[1.5rem] bg-slate-950/80 p-4 ring-1 ring-white/5">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Decision rules</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {(activeModule.rules || []).map((rule) => (
                    <div key={rule} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-sm text-slate-300">{rule}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowModuleExplorer;
