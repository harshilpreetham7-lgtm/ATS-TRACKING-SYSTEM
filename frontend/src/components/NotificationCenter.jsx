import { useEffect, useState } from 'react';
import { X, Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const NotificationCenter = () => {
  const notifications = useAppStore((state) => state.notifications);
  const dismissNotification = useAppStore((state) => state.dismissNotification);
  const [displayedNotifications, setDisplayedNotifications] = useState([]);

  useEffect(() => {
    setDisplayedNotifications(notifications);
  }, [notifications]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-rose-400" />;
      case 'info':
        return <Info className="h-5 w-5 text-sky-400" />;
      default:
        return <Bell className="h-5 w-5 text-cyan-400" />;
    }
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500/10 border-emerald-500/30';
      case 'error':
        return 'bg-rose-500/10 border-rose-500/30';
      case 'info':
        return 'bg-sky-500/10 border-sky-500/30';
      default:
        return 'bg-cyan-500/10 border-cyan-500/30';
    }
  };

  const getTextColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-emerald-100';
      case 'error':
        return 'text-rose-100';
      case 'info':
        return 'text-sky-100';
      default:
        return 'text-cyan-100';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-md">
      {displayedNotifications.map((notif) => (
        <div
          key={notif.id}
          className={`animate-slide-in rounded-[1.5rem] border p-4 backdrop-blur-lg shadow-2xl shadow-slate-950/30 ${getBackgroundColor(
            notif.type
          )} ${getTextColor(notif.type)} flex items-center gap-4 group`}
        >
          <div className="flex-shrink-0">{getIcon(notif.type)}</div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{notif.title}</p>
            {notif.message && <p className="text-xs opacity-90 mt-1">{notif.message}</p>}
          </div>
          <button
            type="button"
            className="flex-shrink-0 opacity-50 hover:opacity-100 transition"
            onClick={() => dismissNotification(notif.id)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationCenter;
