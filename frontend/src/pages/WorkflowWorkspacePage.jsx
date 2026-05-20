import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import WorkflowModuleExplorer from '../components/WorkflowModuleExplorer';
import { workflowModules } from '../data/workflowModules';

const WorkflowWorkspacePage = () => {
  const navigate = useNavigate();
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
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 pt-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-500/40 hover:text-cyan-300"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </button>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Full-page workspace</p>
          <h1 className="mt-2 text-lg font-semibold text-white sm:text-2xl">Workflow module details</h1>
        </div>
      </div>

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
    </div>
  );
};

export default WorkflowWorkspacePage;