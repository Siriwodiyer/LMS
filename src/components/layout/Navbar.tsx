import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCircle,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  User,
  PlaySquare,
  BookOpen,
  BarChart2,
  Eye,
  ArrowLeft,
  Users,
  MessageSquare,
  PlusCircle,
  CheckSquare,
  Lock,
  Award,
  Zap
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
    watchedLearnReelIds,
    isAssessmentUnlocked,
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
  const isMentor = currentRole === 'mentor';
  const isAdmin = currentRole === 'admin';

  const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const learnReelCount = watchedLearnReelIds.length;

  const getTabClass = (tabName: string) => {
    const isActive = activeTab === tabName;
    return `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
      isActive
        ? 'bg-blue-600 text-white shadow-xs'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-xs">
      {/* "View as Learner" Alert Banner for Admin */}
      {isViewAsLearner && canAccessAdminPortal() && (
        <div className="w-full bg-blue-50 px-4 py-2 flex items-center justify-between text-xs text-blue-900 border-b border-blue-200">
          <div className="flex items-center gap-2">
            <Eye size={15} className="text-blue-600 animate-pulse" />
            <span>
              <strong className="font-bold">Viewing as Learner Mode</strong> — Previewing User interface.
            </span>
          </div>
          <button
            onClick={() => setViewAsLearner(false)}
            className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer"
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
              <strong className="font-bold">Viewing as Mentor Mode</strong> — Previewing Mentor interface.
            </span>
          </div>
          <button
            onClick={() => setViewAsMentor(false)}
            className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer"
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
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition-colors">
              <span className="text-lg font-black text-white font-display">L</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-slate-900 font-display">LMS</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {isAdmin ? 'ADMIN' : isMentor ? 'MENTOR' : 'USER'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Navigation Tabs (Role-tailored only) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {/* 1. USER ROLE NAV */}
          {(isLearner || (isViewAsLearner && isAdmin)) && (
            <>
              <button onClick={() => setActiveTab('home')} className={getTabClass('home')}>
                <LayoutDashboard size={14} />
                <span>Home</span>
              </button>
              <button onClick={() => setActiveTab('learn')} className={getTabClass('learn')}>
                <PlaySquare size={14} />
                <span>Learn (6 Reels)</span>
              </button>
              <button onClick={() => setActiveTab('courses')} className={getTabClass('courses')}>
                <BookOpen size={14} />
                <span>Courses</span>
              </button>
              <button onClick={() => setActiveTab('assessments')} className={getTabClass('assessments')}>
                {isAssessmentUnlocked ? <CheckSquare size={14} /> : <Lock size={14} className="text-amber-500" />}
                <span>Assessments</span>
                {!isAssessmentUnlocked && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-mono">
                    {learnReelCount}/6
                  </span>
                )}
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
                <span>Create Course (5 Reels)</span>
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
                <span>Content (6 Reels)</span>
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

        {/* Right Section: Learn Progress Indicator, Notifications, Profile Dropdown */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Learn Reels Completion Indicator for User */}
          {(isLearner || isViewAsLearner) && (
            <div
              onClick={() => {
                if (isAssessmentUnlocked) {
                  openAssessment();
                } else {
                  setActiveTab('learn');
                }
              }}
              title={isAssessmentUnlocked ? 'Assessment Unlocked! Click to start' : 'Complete all 6 Learn reels to unlock assessment'}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all ${
                isAssessmentUnlocked
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-300'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isAssessmentUnlocked ? 'bg-emerald-500 animate-ping' : 'bg-blue-600'}`} />
              <span>
                Learn Reels: <strong className="font-mono">{learnReelCount}/6</strong>
              </span>
              {isAssessmentUnlocked && (
                <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">
                  UNLOCKED
                </span>
              )}
            </div>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all cursor-pointer"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-xl p-4 z-50 border border-slate-200 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <Bell size={16} className="text-blue-600" />
                    <span className="font-bold text-sm text-slate-900">Notifications</span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No notifications</p>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                          n.read ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-blue-50/60 border-blue-200 text-slate-900 font-medium'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <strong className="text-xs font-bold text-slate-900">{n.title}</strong>
                          {!n.read && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1.5 pr-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {initials}
              </div>
              <span className="text-xs font-bold text-slate-900 hidden sm:inline">{currentUser.name}</span>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl p-2 z-50 border border-slate-200 animate-in fade-in">
                <div className="p-3 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{currentUser.email}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                    {isAdmin ? 'Administrator' : isMentor ? 'Verified Mentor' : 'User (Learner)'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setActiveTab(isMentor ? 'mentor-profile' : 'profile');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <User size={14} />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    logoutUser();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
