import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Sparkles,
  Flame,
  Award,
  Bell,
  CheckCircle,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  User,
  Zap,
  PlaySquare,
  BookOpen,
  BarChart2,
  Eye,
  ArrowLeft,
  FileCheck,
  Users,
  MessageSquare,
  Compass,
  PlusCircle,
  CheckSquare
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  viewMode: 'desktop' | 'mobile-sim' | 'tablet-sim';
  setViewMode: (mode: 'desktop' | 'mobile-sim' | 'tablet-sim') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, viewMode, setViewMode }) => {
  const {
    currentUser,
    logoutUser,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    reelsWatchedCount,
    adminSettings,
    openAssessment,
    isViewAsLearner,
    setViewAsLearner,
    isViewAsMentor,
    setViewAsMentor,
    canAccessAdminPortal
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const currentRole = currentUser.role.toLowerCase().replace('role_', '');
  const isLearner = currentRole === 'student' || currentRole === 'learner';
  const isMentor = currentRole === 'mentor' || currentRole === 'seller';
  const isAdmin = currentRole === 'admin';

  const roleLabels: Record<string, { label: string; icon: React.ReactNode; color: string; badge: string }> = {
    student: { label: 'Learner', icon: <GraduationCap size={15} />, color: 'bg-blue-50 text-blue-700 border-blue-200', badge: 'Learner' },
    learner: { label: 'Learner', icon: <GraduationCap size={15} />, color: 'bg-blue-50 text-blue-700 border-blue-200', badge: 'Learner' },
    mentor: { label: 'Mentor', icon: <UserCheck size={15} />, color: 'bg-emerald-50 text-emerald-700 border-emerald-200', badge: 'Mentor' },
    seller: { label: 'Mentor', icon: <UserCheck size={15} />, color: 'bg-emerald-50 text-emerald-700 border-emerald-200', badge: 'Mentor' },
    admin: { label: 'Admin', icon: <ShieldCheck size={15} />, color: 'bg-purple-50 text-purple-700 border-purple-200', badge: 'Admin' },
  };

  const currentRoleConfig = roleLabels[currentRole] || roleLabels.student;
  const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  // Helper for active tab button class
  const getTabClass = (tabName: string) => {
    const isActive = activeTab === tabName;
    return `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
      isActive
        ? 'bg-blue-600 text-white shadow-sm'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm">
      {/* "View as Learner" Alert Banner for Admin */}
      {isViewAsLearner && canAccessAdminPortal() && (
        <div className="w-full bg-blue-50 px-4 py-2 flex items-center justify-between text-xs text-blue-900 border-b border-blue-200">
          <div className="flex items-center gap-2">
            <Eye size={15} className="text-blue-600 animate-pulse" />
            <span>
              <strong className="font-bold">Viewing as Learner Mode</strong> — Previewing student interface.
            </span>
          </div>
          <button
            onClick={() => setViewAsLearner(false)}
            className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
          >
            <ArrowLeft size={13} />
            <span>Return to Admin Portal</span>
          </button>
        </div>
      )}

      {/* "View as Mentor" Alert Banner for Admin */}
      {isViewAsMentor && canAccessAdminPortal() && (
        <div className="w-full bg-emerald-50 px-4 py-2 flex items-center justify-between text-xs text-emerald-900 border-b border-emerald-200">
          <div className="flex items-center gap-2">
            <Eye size={15} className="text-emerald-600 animate-pulse" />
            <span>
              <strong className="font-bold">Viewing as Mentor Mode</strong> — Previewing mentor interface.
            </span>
          </div>
          <button
            onClick={() => setViewAsMentor(false)}
            className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
          >
            <ArrowLeft size={13} />
            <span>Return to Admin Portal</span>
          </button>
        </div>
      )}

      {/* Main Header Container */}
      <div className="px-4 lg:px-8 py-2.5 flex items-center justify-between">
        {/* LMS Brand Logo */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab(isMentor ? 'mentor-dashboard' : isAdmin ? 'admin-dashboard' : 'home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
              <span className="text-lg font-black text-white font-display">L</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-slate-900 font-display">LMS</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {isAdmin ? 'ADMIN' : isMentor ? 'MENTOR' : 'LEARNER'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Center Navigation Tabs Based on Logged-in User Role */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {/* 1. USER / LEARNER ROLE NAV */}
          {(isLearner || (isViewAsLearner && isAdmin)) && (
            <>
              <button onClick={() => setActiveTab('home')} className={getTabClass('home')}>
                <LayoutDashboard size={14} />
                <span>Home</span>
              </button>
              <button onClick={() => setActiveTab('learn')} className={getTabClass('learn')}>
                <PlaySquare size={14} />
                <span>Learn</span>
              </button>
              <button onClick={() => setActiveTab('courses')} className={getTabClass('courses')}>
                <BookOpen size={14} />
                <span>Courses</span>
              </button>
              <button onClick={() => setActiveTab('assessments')} className={getTabClass('assessments')}>
                <CheckSquare size={14} />
                <span>Assessments</span>
              </button>
              <button onClick={() => setActiveTab('rewards')} className={getTabClass('rewards')}>
                <Award size={14} />
                <span>Rewards</span>
              </button>
              <button onClick={() => setActiveTab('profile')} className={getTabClass('profile')}>
                <User size={14} />
                <span>Profile</span>
              </button>
            </>
          )}

          {/* 2. MENTOR ROLE NAV */}
          {((isMentor && !isViewAsLearner) || (isViewAsMentor && isAdmin)) && (
            <>
              <button onClick={() => setActiveTab('mentor-dashboard')} className={getTabClass('mentor-dashboard')}>
                <LayoutDashboard size={14} />
                <span>Dashboard</span>
              </button>
              <button onClick={() => setActiveTab('mentor-courses')} className={getTabClass('mentor-courses')}>
                <BookOpen size={14} />
                <span>My Courses</span>
              </button>
              <button onClick={() => setActiveTab('mentor-create-course')} className={getTabClass('mentor-create-course')}>
                <PlusCircle size={14} />
                <span>Create Course</span>
              </button>
              <button onClick={() => setActiveTab('mentor-students')} className={getTabClass('mentor-students')}>
                <Users size={14} />
                <span>Students</span>
              </button>
              <button onClick={() => setActiveTab('mentor-notifications')} className={getTabClass('mentor-notifications')}>
                <Bell size={14} />
                <span>Notifications</span>
              </button>
              <button onClick={() => setActiveTab('mentor-profile')} className={getTabClass('mentor-profile')}>
                <User size={14} />
                <span>Profile</span>
              </button>
            </>
          )}

          {/* 3. ADMIN ROLE NAV */}
          {isAdmin && !isViewAsLearner && !isViewAsMentor && (
            <>
              <button onClick={() => setActiveTab('admin-dashboard')} className={getTabClass('admin-dashboard')}>
                <LayoutDashboard size={14} />
                <span>Dashboard</span>
              </button>
              <button onClick={() => setActiveTab('admin-users')} className={getTabClass('admin-users')}>
                <Users size={14} />
                <span>Users</span>
              </button>
              <button onClick={() => setActiveTab('admin-mentors')} className={getTabClass('admin-mentors')}>
                <UserCheck size={14} />
                <span>Mentors</span>
              </button>
              <button onClick={() => setActiveTab('admin-content')} className={getTabClass('admin-content')}>
                <PlaySquare size={14} />
                <span>Content</span>
              </button>
              <button onClick={() => setActiveTab('admin-assessments')} className={getTabClass('admin-assessments')}>
                <CheckSquare size={14} />
                <span>Assessments</span>
              </button>
              <button onClick={() => setActiveTab('admin-courses')} className={getTabClass('admin-courses')}>
                <BookOpen size={14} />
                <span>Courses</span>
              </button>
              <button onClick={() => setActiveTab('admin-rewards')} className={getTabClass('admin-rewards')}>
                <Award size={14} />
                <span>Rewards</span>
              </button>
              <button onClick={() => setActiveTab('admin-feedback')} className={getTabClass('admin-feedback')}>
                <MessageSquare size={14} />
                <span>Feedback</span>
              </button>
              <button onClick={() => setActiveTab('admin-analytics')} className={getTabClass('admin-analytics')}>
                <BarChart2 size={14} />
                <span>Analytics</span>
              </button>
            </>
          )}
        </nav>

        {/* Right Section: Reel Counter, Notifications & Profile Menu */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Reel Watch Counter (Learners only) */}
          {(isLearner || isViewAsLearner) && (
            <div
              onClick={openAssessment}
              title="Click to launch assessment quiz"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 hover:border-blue-300 cursor-pointer transition-all text-xs text-slate-700"
            >
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>
                Watched: <strong className="text-slate-900 font-mono">{reelsWatchedCount}/{adminSettings.reelsPerAssessment}</strong>
              </span>
            </div>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white shadow-xl p-4 z-50 border border-slate-200 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <Bell size={16} className="text-blue-600" />
                    <span className="font-bold text-sm text-slate-900">Notifications</span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">No notifications.</p>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                          notif.read ? 'bg-slate-50 border-slate-100 opacity-70' : 'bg-blue-50/60 border-blue-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <strong className="text-slate-900 font-semibold">{notif.title}</strong>
                          {!notif.read && <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />}
                        </div>
                        <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown with Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${currentRoleConfig.color} hover:bg-slate-100 shadow-sm`}
            >
              <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                {initials}
              </div>
              <span className="hidden sm:inline font-bold text-slate-900">{currentUser.name.split(' ')[0]}</span>
              <span className="px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[10px] font-bold uppercase">
                {currentRoleConfig.badge}
              </span>
              <ChevronDown size={14} className="text-slate-500" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-xl p-4 z-50 border border-slate-200 animate-in fade-in slide-in-from-top-2 space-y-3">
                {/* User Info Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                    {initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{currentUser.name}</h4>
                    <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-200">
                      Role: {currentRoleConfig.badge}
                    </span>
                  </div>
                </div>

                {/* View Mode Switcher (Admin only — admins can preview any dashboard) */}
                {isAdmin && (
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                      View As
                    </span>
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setViewAsLearner(false);
                          setViewAsMentor(false);
                          setActiveTab('admin-dashboard');
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-all ${
                          !isViewAsLearner && !isViewAsMentor ? 'bg-purple-600 text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={15} />
                          <span>Admin Dashboard</span>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setViewAsLearner(true);
                          setViewAsMentor(false);
                          setActiveTab('home');
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-all ${
                          isViewAsLearner ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <GraduationCap size={15} />
                          <span>Learner Dashboard</span>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setViewAsMentor(true);
                          setViewAsLearner(false);
                          setActiveTab('mentor-dashboard');
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-all ${
                          isViewAsMentor ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <UserCheck size={15} />
                          <span>Mentor Dashboard</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Profile & Logout */}
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logoutUser();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

