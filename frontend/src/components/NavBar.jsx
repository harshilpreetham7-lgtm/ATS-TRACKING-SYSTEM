import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Activity, Zap } from 'lucide-react';

const NavBar = ({ user, onLogout, onSync }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const navItems = [
    { label: 'Overview', path: '/dashboard' },
    { label: 'Roles', path: '/roles' },
    { label: 'Pipeline', path: '/pipeline' },
    { label: 'Workflow', path: '/workflow' },
  ];

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await onSync();
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/95 shadow-xl shadow-slate-950/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">

          <div className="flex items-center gap-3 rounded-3xl bg-slate-900/80 px-4 py-3 ring-1 ring-white/5 shadow-sm shadow-slate-950/20">
            <Zap size={18} className="text-cyan-300" />
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Recruitment command center</p>
              <h1 className="text-xl font-semibold text-white">ATS Workspace</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span>{user?.role === 'recruiter' ? '👨‍💼 Recruiter view' : '📊 Hiring workflow'}</span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1">👤 <span className="text-slate-300">{user?.name || 'Guest'}</span></span>
            {isOnline && <span className="flex items-center gap-1 text-emerald-300"><Activity size={12} /> Connected</span>}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 justify-start sm:justify-end">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className={`rounded-full bg-gradient-to-r from-cyan-500/20 to-sky-500/20 px-5 py-2 text-sm font-semibold text-cyan-100 ring-1 ring-cyan-400/40 transition duration-300 ${isSyncing ? 'opacity-50 cursor-not-allowed' : 'hover:from-cyan-500/30 hover:to-sky-500/30 hover:ring-cyan-400/80 hover:shadow-lg hover:shadow-cyan-500/20'}`}
          >
            <div className="flex items-center gap-2">
              <Zap size={14} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Syncing...' : 'Refresh workspace'}
            </div>
          </button>
          <button
            onClick={onLogout}
            className="rounded-full border border-slate-700 bg-slate-900/90 px-5 py-2 text-sm font-semibold text-white transition duration-300 hover:border-rose-500/40 hover:bg-slate-800 hover:text-rose-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
