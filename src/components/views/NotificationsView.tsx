import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Check, Trash2, Pill, Calendar, FileText, AlertCircle, ShieldAlert } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, setNotifications } = useApp();

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return <Pill className="w-4 h-4 text-secondary" />;
      case 'appointment':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'report':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'emergency':
        return <ShieldAlert className="w-4 h-4 text-error" />;
      default:
        return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-secondary-container text-secondary">
              <Bell className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-on-surface">Notification Center</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Health reminders, upcoming appointment notifications, and report analysis alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high font-semibold text-xs text-on-surface"
          >
            Mark All Read
          </button>
          <button
            onClick={clearAll}
            className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high font-semibold text-xs text-error"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-xs space-y-3">
        {notifications.length === 0 ? (
          <p className="text-xs text-on-surface-variant py-8 text-center">No notifications available.</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                !n.isRead
                  ? 'bg-secondary-container/30 border-secondary/30'
                  : 'bg-surface-container-low border-outline-variant/20'
              }`}
            >
              <div className="p-2 rounded-xl bg-surface shrink-0 mt-0.5">{getIcon(n.type)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-on-surface">{n.title}</h3>
                  <span className="text-[11px] text-on-surface-variant">{n.timestamp}</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
