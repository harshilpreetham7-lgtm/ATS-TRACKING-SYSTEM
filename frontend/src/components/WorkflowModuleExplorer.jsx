import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, CheckCircle2, Clock, FileText, Briefcase, Users, PenTool, BadgeCheck, XCircle, MapPin, Save, CalendarDays } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

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

const locationSuggestions = [
  'Remote',
  'New York, NY',
  'Newark, NJ',
  'New Orleans, LA',
  'New Delhi, India',
  'Newcastle, UK',
  'San Francisco, CA',
  'San Jose, CA',
  'San Diego, CA',
  'Seattle, WA',
  'Salt Lake City, UT',
  'London, UK',
  'Los Angeles, CA',
  'Boston, MA',
  'Berlin, Germany',
  'Bangalore, India',
  'Austin, TX',
  'Chicago, IL',
  'Toronto, Canada',
  'Tokyo, Japan',
];

const WorkflowModuleExplorer = ({
  modules,
  activeModuleId,
  onSelectModule,
  selectedRoleType,
  onSelectRoleType,
  selectedRole,
  onSelectRole,
  mode = 'overlay',
}) => {
  const { savedWorkflowModules, saveWorkflowModuleDetails, clearWorkflowModuleDetails } = useAppStore();
  const [formValues, setFormValues] = useState({});
  const [activeSuggestionField, setActiveSuggestionField] = useState(null);
  const activeModule = modules.find((module) => module.id === activeModuleId) || modules[0];
  const ActiveIcon = iconMap[activeModule.icon] || Briefcase;
  const savedModule = savedWorkflowModules?.[activeModuleId] || null;

  useEffect(() => {
    const nextValues = {};
    (activeModule.fields || []).forEach((field) => {
      // Prefill from saved values, then selected role, then field default.
      let value = savedModule?.values?.[field.name] ?? field.defaultValue ?? '';
      if (selectedRole) {
        if (field.name === 'roleTitle') value = selectedRole.label || value;
        if (field.name === 'level') value = selectedRole.level || value;
        if (field.name === 'engagement') value = selectedRole.engagement || value;
        if (field.name === 'summary') value = selectedRole.summary || value;
      }
      nextValues[field.name] = value;
    });
    setFormValues(nextValues);
  }, [activeModuleId, selectedRole, savedModule]);

  const updateField = (name, value) => {
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const locationQuery = String(formValues.location || '').trim().toLowerCase();
  const matchedLocations = useMemo(() => {
    if (!locationQuery) return locationSuggestions.slice(0, 8);
    return locationSuggestions.filter((item) => item.toLowerCase().startsWith(locationQuery)).slice(0, 8);
  }, [locationQuery]);

  const handleSaveModuleDetails = () => {
    const roleLabel = selectedRole?.label || formValues.roleTitle || activeModule.title;
    saveWorkflowModuleDetails(activeModule.id, {
      title: activeModule.title,
      roleLabel,
      roleType: selectedRoleType,
      values: formValues,
    });
  };

  return (
    <div className={mode === 'page' ? 'relative overflow-y-auto bg-slate-950' : 'fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 backdrop-blur-xl'}>
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 py-6 sm:px-6 lg:px-8">
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
                const saved = savedWorkflowModules?.[module.id];
                const hasSavedDetails = Boolean(saved);
                const preview = saved ? (saved.roleLabel || saved.values?.location || Object.values(saved.values || {})[0] || '') : '';
                const previewShort = preview && preview.length > 20 ? preview.slice(0, 20) + '…' : preview;
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
                          <div className="flex items-center gap-3">
                            <p className="text-sm font-semibold text-white">{module.title}</p>
                            {hasSavedDetails && previewShort && (
                              <span className="text-xs text-slate-300">• {previewShort}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {hasSavedDetails && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (module.id !== activeModule.id) {
                                    onSelectModule(module.id);
                                  } else {
                                    // load saved values into the active form
                                    setFormValues(saved?.values || {});
                                  }
                                }}
                                className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-200 ring-1 ring-emerald-500/20 hover:bg-emerald-500/20 transition"
                              >
                                Saved
                              </button>
                            )}
                            <ChevronRight size={16} className={`${isActive ? 'text-cyan-300' : 'text-slate-500'} transition group-hover:translate-x-1`} />
                          </div>
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

                <div className="mt-5 rounded-[1.5rem] bg-slate-950/80 p-4 ring-1 ring-white/5">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">{activeModule.formTitle || 'Details required'}</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {(activeModule.fields || []).map((field) => (
                    <label key={field.name} className={`space-y-2 ${field.span === 2 ? 'md:col-span-2' : ''}`}>
                      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{field.label}</span>
                      {field.type === 'select' ? (
                        <select
                          value={formValues[field.name] || ''}
                          onChange={(event) => updateField(field.name, event.target.value)}
                          className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-500"
                        >
                          <option value="">Select one</option>
                          {field.options?.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          rows={field.rows || 4}
                          value={formValues[field.name] || ''}
                          onChange={(event) => updateField(field.name, event.target.value)}
                          placeholder={field.placeholder}
                          className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-500"
                        />
                      ) : field.name === 'location' ? (
                        <div className="relative">
                          <input
                            type={field.type || 'text'}
                            value={formValues[field.name] || ''}
                            onFocus={() => setActiveSuggestionField('location')}
                            onBlur={() => setTimeout(() => setActiveSuggestionField(null), 120)}
                            onChange={(event) => updateField(field.name, event.target.value)}
                            placeholder={field.placeholder}
                            className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 pl-11 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-500"
                          />
                          <MapPin size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          {activeSuggestionField === 'location' && matchedLocations.length > 0 && (
                            <div className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-3xl border border-slate-700 bg-slate-950 shadow-2xl shadow-slate-950/40">
                              {matchedLocations.map((item) => (
                                <button
                                  key={item}
                                  type="button"
                                  onMouseDown={(event) => event.preventDefault()}
                                  onClick={() => {
                                    updateField('location', item);
                                    setActiveSuggestionField(null);
                                  }}
                                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-900 hover:text-cyan-300"
                                >
                                  <MapPin size={14} className="text-cyan-400" />
                                  {item}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <input
                          type={field.type || 'text'}
                          value={formValues[field.name] || ''}
                          onChange={(event) => updateField(field.name, event.target.value)}
                          placeholder={field.placeholder}
                          className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-500"
                        />
                      )}
                    </label>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-slate-400">Fill these fields to complete the current module before moving the candidate forward.</p>
                  <button
                    type="button"
                    onClick={handleSaveModuleDetails}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-sky-400"
                  >
                    <Save size={14} />
                    Save module details
                  </button>
                </div>
              </div>

              <div className="mt-5 rounded-[1.5rem] bg-slate-950/80 p-4 ring-1 ring-white/5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Saved details</p>
                  {savedModule?.savedAt && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300 ring-1 ring-white/10">
                      <CalendarDays size={14} />
                      {new Date(savedModule.savedAt).toLocaleString()}
                    </span>
                  )}
                </div>

                {savedModule ? (
                  <div className="mt-4 space-y-3">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setFormValues(savedModule.values || {})}
                        className="rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200 transition hover:border-cyan-500/40 hover:text-cyan-300"
                      >
                        Load saved values
                      </button>
                      <button
                        type="button"
                        onClick={() => clearWorkflowModuleDetails(activeModule.id)}
                        className="rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-rose-200 transition hover:border-rose-400/60 hover:bg-rose-500/20"
                      >
                        Clear saved details
                      </button>
                    </div>
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
                      <p className="text-sm font-semibold text-white">{savedModule.roleLabel}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">{savedModule.title}</p>
                      <div className="mt-3 grid gap-2 text-sm text-slate-300">
                        {Object.entries(savedModule.values || {}).map(([key, value]) => (
                          <div key={key} className="flex items-start justify-between gap-3 rounded-2xl bg-slate-950/80 px-3 py-2">
                            <span className="capitalize text-slate-400">{key.replace(/([A-Z])/g, ' $1')}</span>
                            <span className="text-right text-slate-100">{String(value || '-')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-400">No saved details yet. Fill the fields above and save them to see them here.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowModuleExplorer;
