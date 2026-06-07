import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import WorkflowModuleExplorer from '../components/WorkflowModuleExplorer';
import NavBar from '../components/NavBar';
import { useAppStore } from '../store/useAppStore';
import { workflowModules } from '../data/workflowModules';

const WorkflowWorkspacePage = () => {
  const navigate = useNavigate();
  const { user, logout, loadBoard } = useAppStore();
  const [selectedRoleType, setSelectedRoleType] = useState('all');
  const [activeModuleId, setActiveModuleId] = useState('role-selection');
  const [selectedRole, setSelectedRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const moduleParam = params.get('module');
    const roleParam = params.get('role');
    if (moduleParam) setActiveModuleId(moduleParam);
    if (roleParam) {
      const roleModule = workflowModules.find((m) => m.id === (moduleParam || 'role-selection'));
      const found = roleModule?.roles?.find((r) => r.id === roleParam) || null;
      if (found) setSelectedRole(found);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar user={user} onLogout={logout} onSync={loadBoard} />
      <main className="mx-auto max-w-[1440px] px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-12">
        <section className="rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-2xl shadow-slate-950/30 ring-1 ring-white/5 lg:p-7">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Workflow workspace</p>
              <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Structured hiring workflows that feel product-ready.</h1>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Every module is presented like a dedicated workspace so recruiters and hiring teams experience a polished workflow, not a raw form.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-indigo-500/40 hover:text-indigo-300"
              >
                <ArrowLeft size={16} />
                Back to dashboard
              </button>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-300 shadow-slate-950/20 ring-1 ring-white/5">
                <p className="font-semibold text-white">Live workflow mode</p>
                <p className="mt-1">Deep module details with a polished page layout.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <WorkflowModuleExplorer
            modules={workflowModules}
            activeModuleId={activeModuleId}
            onSelectModule={setActiveModuleId}
            selectedRoleType={selectedRoleType}
            onSelectRoleType={setSelectedRoleType}
            selectedRole={selectedRole}
            onSelectRole={setSelectedRole}
            mode="page"
          />
        </section>
      </main>
    </div>
  );
};

export default WorkflowWorkspacePage;