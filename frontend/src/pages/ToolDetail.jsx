import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { workflowModules } from '../data/workflowModules';

const toolContentMap = {
  roles: { title: 'Browse Roles', desc: 'Explore the role catalog and open detailed role pages.' },
  pipeline: { title: 'Pipeline Board', desc: 'Drag-and-drop candidates and manage stage transitions.' },
  'application-data': { title: 'Workflow: Application Data', desc: 'Define which fields candidates must submit and why they matter.' },
  analytics: { title: 'Analytics', desc: 'Track hiring metrics, conversion, and trends.' },
  activity: { title: 'Activity Stream', desc: 'View recent candidate and team activity for live demos.' },
  settings: { title: 'Settings', desc: 'Adjust workspace preferences, roles, and access.' },
  team: { title: 'Team Hub', desc: 'Manage teammates, reviewers, and interview panels.' },
  integrations: { title: 'Integrations', desc: 'Connect ATS with calendars, profiles, and tracking tools.' },
};

const ToolDetail = () => {
  const { toolId } = useParams();
  const navigate = useNavigate();

  const module = useMemo(() => workflowModules.find((m) => m.id === toolId), [toolId]);
  const fallback = toolContentMap[toolId] || { title: 'Tool', desc: 'Details about this tool will appear here.' };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <BackButton to="/dashboard" />
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">Tool detail</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">{module ? module.title : fallback.title}</h1>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/30 animate-fade-in">
          <h2 className="text-lg font-semibold text-white">{module ? module.summary : fallback.desc}</h2>
          <p className="mt-4 text-sm text-slate-400">
            {module ? module.description : fallback.desc}
          </p>

          {module && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border p-4 bg-slate-950/80">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Key steps</p>
                <ul className="mt-3 text-sm text-slate-400 list-disc list-inside">
                  {(module.steps || []).map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="rounded-2xl border p-4 bg-slate-950/80">
                <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">Rules & requirements</p>
                <ul className="mt-3 text-sm text-slate-400 list-disc list-inside">
                  {((module.requirements || module.rules) || []).map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button onClick={() => navigate('/dashboard')} className="rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">Open workspace</button>
            <button
              onClick={() => {
                if (toolId === 'roles') navigate('/roles');
                else if (toolId === 'pipeline') navigate('/pipeline');
                else if (toolId === 'analytics') navigate('/analytics');
                else if (toolId === 'settings') navigate('/settings');
                else if (toolId === 'team') navigate('/team');
                else if (toolId === 'integrations') navigate('/integrations');
                else navigate(`/workflow?module=${toolId}`);
              }}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200"
            >
              Open full page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetail;
