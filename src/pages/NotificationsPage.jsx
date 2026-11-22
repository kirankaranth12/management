import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  AlertCircle, 
  Megaphone, 
  Calendar, 
  Sparkles, 
  Users, 
  ExternalLink,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function NotificationsPage() {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    navigate, 
    unreadNotifsCount 
  } = useApp();

  const [filterType, setFilterType] = useState('all');

  const filteredNotifications = notifications.filter(n => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !n.read;
    return n.type === filterType;
  });

  const typeConfig = {
    complaint: { icon: AlertCircle, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    announcement: { icon: Megaphone, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    appointment: { icon: Calendar, color: 'text-teal-600 bg-teal-50 border-teal-200' },
    cleaning: { icon: Sparkles, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    hr: { icon: Users, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    system: { icon: Bell, color: 'text-slate-600 bg-slate-50 border-slate-200' }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Bell className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Notification Center</h1>
              {unreadNotifsCount > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                  {unreadNotifsCount} Unread
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Live updates on complaint progression, departmental notifications, appointment confirmations, and campus alerts.
            </p>
          </div>
        </div>

        {unreadNotifsCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl overflow-x-auto">
        {[
          { id: 'all', label: `All Alerts (${notifications.length})` },
          { id: 'unread', label: `Unread (${unreadNotifsCount})` },
          { id: 'complaint', label: 'Complaints' },
          { id: 'announcement', label: 'Announcements' },
          { id: 'appointment', label: 'Counselling' },
          { id: 'cleaning', label: 'Cleaning Tasks' },
          { id: 'hr', label: 'HR & Leaves' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all shrink-0 ${
              filterType === tab.id ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification Items List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200/80">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No Notifications in this filter</h4>
            <p className="text-xs text-slate-400 mt-1">You are completely up to date.</p>
          </div>
        ) : (
          filteredNotifications.map((n) => {
            const conf = typeConfig[n.type] || typeConfig.system;
            const Icon = conf.icon;

            return (
              <div
                key={n.id}
                onClick={() => {
                  markNotificationRead(n.id);
                  if (n.link === 'student') navigate('student-portal', 'complaints-tracker');
                  else if (n.link === 'cleaning') navigate('cleaning');
                  else if (n.link === 'faculty') navigate('faculty-portal');
                  else if (n.link === 'counselling') navigate('counselling');
                  else if (n.link === 'hr') navigate('hr');
                  else if (n.link === 'student-leader') navigate('student-leader');
                  else navigate('home');
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  !n.read
                    ? 'bg-blue-50/50 border-blue-200 shadow-xs hover:bg-blue-50'
                    : 'bg-white border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 border ${conf.color}`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-xs font-bold truncate ${!n.read ? 'text-blue-950 font-black' : 'text-slate-900'}`}>
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                </div>

                <div className="shrink-0 flex items-center gap-2 self-center">
                  {!n.read && (
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" title="Unread" />
                  )}
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

