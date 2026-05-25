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
    <div className="sticky top-0 z-30 border-b border-slate-800/50 bg-gradient-to-r from-slate-950/98 via-slate-950/95 to-slate-950/98 shadow-sm shadow-slate-950/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse shadow-lg shadow-indigo-500/50" />
            <p className="text-xs uppercase tracking-[0.24em] text-indigo-300 font-semibold">Recruitment Command Center</p>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">ATS Real-Time Dashboard</h1>
          <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
            <p>{user?.role === 'recruiter' ? '👨‍💼 Recruiter Dashboard' : '📊 Hiring Pipeline'}</p>
            <span className="text-slate-600">•</span>
            <p className="flex items-center gap-1">👤 <span className="text-slate-300">{user?.name || 'Guest'}</span></p>
            {isOnline && <span className="flex items-center gap-1 text-indigo-400"><Activity size={12} /> Connected</span>}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition ${active ? 'bg-indigo-500 text-slate-950' : 'bg-slate-900/80 text-slate-300 ring-1 ring-white/10 hover:bg-slate-800 hover:text-indigo-300'}`}
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
            className={`rounded-full bg-gradient-to-r from-indigo-600/20 to-purple-600/20 px-4 py-2 text-sm font-medium text-indigo-200 ring-1 ring-indigo-500/40 transition duration-300 ${isSyncing ? 'opacity-50 cursor-not-allowed' : 'hover:from-indigo-600/30 hover:to-purple-600/30 hover:ring-indigo-500/60 hover:shadow-lg hover:shadow-indigo-500/20'}`}
          >
            <div className="flex items-center gap-2">
              <Zap size={14} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Syncing...' : 'Live Sync'}
            </div>
          </button>
          <button 
            onClick={onLogout} 
            className="rounded-full bg-slate-900/80 border border-slate-700 hover:border-red-500/40 px-4 py-2 text-sm font-semibold text-slate-200 transition duration-300 hover:bg-slate-800 hover:text-red-300 hover:shadow-lg hover:shadow-red-500/10"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
