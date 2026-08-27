import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { NotificationItem } from '../../types';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Users,
  Award,
  DollarSign,
  Trash2,
  CheckCheck,
  Filter,
  ShieldCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface MentorNotificationsViewProps {
  onNavigateToCourses?: () => void;
  onNavigateToStudents?: () => void;
}

export const MentorNotificationsView: React.FC<MentorNotificationsViewProps> = ({
  onNavigateToCourses,
  onNavigateToStudents
}) => {
  const {
    notifications,
    markNotificationRead,
    clearAllNotifications,
    courses,
    approvalQueue,
    showToast
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'approval' | 'course' | 'student'>('all');

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      if (activeFilter === 'unread') return !notif.read;
      if (activeFilter === 'approval') return notif.type === 'approval' || notif.title.toLowerCase().includes('approval') || notif.title.toLowerCase().includes('review');
      if (activeFilter === 'course') return notif.type === 'course' || notif.title.toLowerCase().includes('course');
      if (activeFilter === 'student') return notif.type === 'mentor' || notif.type === 'assessment' || notif.title.toLowerCase().includes('student') || notif.title.toLowerCase().includes('enroll');
      return true;
    });
  }, [notifications, activeFilter]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (notif: NotificationItem) => {
    if (notif.type === 'approval' || notif.title.toLowerCase().includes('approved') || notif.title.toLowerCase().includes('review')) {
      return <ShieldCheck size={18} className="text-purple-600" />;
    }
    if (notif.type === 'course' || notif.title.toLowerCase().includes('course')) {
      return <BookOpen size={18} className="text-emerald-600" />;
    }
    if (notif.type === 'reward' || notif.title.toLowerCase().includes('payout') || notif.title.toLowerCase().includes('earning')) {
      return <DollarSign size={18} className="text-amber-600" />;
    }
    if (notif.type === 'mentor' || notif.title.toLowerCase().includes('student')) {
      return <Users size={18} className="text-blue-600" />;
    }
    return <Bell size={18} className="text-slate-600" />;
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24 animate-in fade-in duration-200">
      {/* Top Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
              <Bell size={13} /> Mentor Notification Center
            </span>
            <span className="text-xs text-slate-500">• {unreadCount} Unread</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-2">
            Alerts & Activity Updates
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Stay up to date on course curriculum approvals, admin feedback, new student enrollments, and platform notices.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {unreadCount > 0 && (
            <button
              onClick={() => {
                notifications.forEach(n => markNotificationRead(n.id));
                showToast('All notifications marked as read.', 'info');
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition-all shadow-sm"
            >
              <CheckCheck size={15} />
              <span>Mark All Read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={() => {
                clearAllNotifications();
                showToast('All notifications cleared.', 'info');
              }}
              className="p-2.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 transition-all"
              title="Clear All Notifications"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-white border border-slate-200 shadow-sm">
        {[
          { id: 'all', label: `All (${notifications.length})` },
          { id: 'unread', label: `Unread (${unreadCount})` },
          { id: 'approval', label: 'Admin Approvals' },
          { id: 'course', label: 'Course Updates' },
          { id: 'student', label: 'Student Enrollments' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeFilter === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Bell size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-900">No notifications in this view</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You're all caught up! When admins review your courses or new students enroll, updates will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                notif.read
                  ? 'bg-white border-slate-200 shadow-sm opacity-80 hover:opacity-100'
                  : 'bg-emerald-50/40 border-emerald-200 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                  {getNotificationIcon(notif)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs sm:text-sm font-bold text-slate-900">{notif.title}</strong>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons based on notification */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {notif.title.toLowerCase().includes('course') || notif.type === 'approval' ? (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      if (onNavigateToCourses) onNavigateToCourses();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                  >
                    <span>View Courses</span>
                    <ArrowRight size={13} />
                  </button>
                ) : (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      if (onNavigateToStudents) onNavigateToStudents();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1"
                  >
                    <span>View Students</span>
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
