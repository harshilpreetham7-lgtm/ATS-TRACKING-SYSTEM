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
    <div className="sticky top-0 z-30 border-b border-slate-800/50 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-slate-400" />
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold">Recruitment workspace</p>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">ATS Dashboard</h1>
          <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
            <p>Recruitment workspace</p>
            <span className="text-slate-600">•</span>
            <p className="flex items-center gap-1"><span className="text-slate-300">{user?.name || 'Guest'}</span></p>
            {isOnline && <span className="flex items-center gap-1 text-slate-400"><Activity size={12} /> Connected</span>}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition ${active ? 'bg-slate-800 text-slate-100 shadow-sm shadow-slate-600/20' : 'bg-slate-900/60 text-slate-400 ring-1 ring-slate-700/50 hover:bg-slate-800 hover:text-slate-200'}`}
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
            className={`rounded-full bg-slate-900/60 px-4 py-2 text-sm font-medium text-slate-300 ring-1 ring-slate-700/50 transition duration-300 ${isSyncing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <div className="flex items-center gap-2">
              <Zap size={14} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Syncing...' : 'Sync'}
            </div>
          </button>
          <button 
            onClick={onLogout} 
            className="rounded-full bg-slate-900/80 border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition duration-300 hover:bg-slate-800 hover:text-slate-100"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
