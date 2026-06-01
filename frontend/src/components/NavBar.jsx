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
    <div className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/90 shadow-sm shadow-slate-950/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/40" />
            <p className="text-xs uppercase tracking-[0.24em] text-slate-300 font-semibold">Recruitment workspace</p>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-white">ATS Dashboard</h1>
          <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
            <p>{user?.role === 'recruiter' ? 'Recruiter dashboard' : 'Hiring pipeline'}</p>
            <span className="text-slate-600">•</span>
            <p className="flex items-center gap-1">User <span className="text-slate-300">{user?.name || 'Guest'}</span></p>
            {isOnline && <span className="flex items-center gap-1 text-emerald-300"><Activity size={12} /> Connected</span>}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition ${active ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25' : 'bg-slate-900/70 text-slate-300 ring-1 ring-white/5 hover:bg-slate-800 hover:text-cyan-300 hover:ring-cyan-400/30'}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className={`rounded-full bg-slate-900/80 px-4 py-2 text-sm font-medium text-slate-200 ring-1 ring-slate-700 transition duration-300 ${isSyncing ? 'opacity-50 cursor-not-allowed' : 'hover:border-cyan-500/40 hover:text-cyan-300 hover:ring-cyan-500/30'}`}
          >
            <div className="flex items-center gap-2">
              <Zap size={14} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Syncing...' : 'Live Sync'}
            </div>
          </button>
          <button 
            onClick={onLogout} 
            className="rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-slate-200 transition duration-300 hover:border-slate-500 hover:bg-slate-800 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
