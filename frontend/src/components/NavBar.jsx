import React, { useState, useEffect } from 'react';
import { Activity, Zap } from 'lucide-react';

const NavBar = ({ user, onLogout, onSync }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

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
    <div className="sticky top-0 z-30 border-b border-slate-800/50 bg-gradient-to-r from-slate-950/95 via-slate-950/90 to-slate-950/95 shadow-sm shadow-slate-950/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300 font-semibold">Recruitment Command Center</p>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">ATS Real-Time Dashboard</h1>
          <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
            <p>{user?.role === 'recruiter' ? '👨‍💼 Recruiter Dashboard' : '📊 Hiring Pipeline'}</p>
            <span className="text-slate-600">•</span>
            <p className="flex items-center gap-1">👤 <span className="text-slate-300">{user?.name || 'Guest'}</span></p>
            {isOnline && <span className="flex items-center gap-1 text-green-400"><Activity size={12} /> Connected</span>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className={`rounded-full bg-gradient-to-r from-cyan-600/20 to-sky-600/20 px-4 py-2 text-sm font-medium text-cyan-200 ring-1 ring-cyan-500/40 transition duration-300 ${isSyncing ? 'opacity-50 cursor-not-allowed' : 'hover:from-cyan-600/30 hover:to-sky-600/30 hover:ring-cyan-500/60 hover:shadow-lg hover:shadow-cyan-500/20'}`}
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
