import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminOverview } from './AdminOverview';
import { LearnersManagement } from './LearnersManagement';
import { MentorsManagement } from './MentorsManagement';
import { ContentManagement } from './ContentManagement';
import { ContentApproval } from './ContentApproval';
import { AdminAnalyticsView } from './AdminAnalyticsView';
import { AdminRewardsBadges } from './AdminRewardsBadges';
import { AdminSettingsView } from './AdminSettingsView';
import { CreateContentModal } from './CreateContentModal';
import { LearnerInspectorModal } from './LearnerInspectorModal';
import { MentorInspectorModal } from './MentorInspectorModal';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  HelpCircle,
  FileCheck2,
  BarChart3,
  Award,
  Sliders,
  Plus,
  Eye,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Compass
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const {
    currentUser,
    users,
    courses,
    approvalQueue,
    setViewAsLearner,
    logoutUser,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem('lms_admin_active_tab') || 'dashboard';
  });

  useEffect(() => {
    localStorage.setItem('lms_admin_active_tab', activeTab);
  }, [activeTab]);

  const [isUsersOpen, setIsUsersOpen] = useState(true);
  const [isContentOpen, setIsContentOpen] = useState(true);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

  // Modals state
  const [isCreateContentOpen, setIsCreateContentOpen] = useState(false);
  const [defaultContentType, setDefaultContentType] = useState<'course' | 'quiz' | 'assignment'>('course');
  const [inspectedLearnerId, setInspectedLearnerId] = useState<string | null>(null);
  const [inspectedMentorId, setInspectedMentorId] = useState<string | null>(null);

  const inspectedLearner = users.find(u => u.id === inspectedLearnerId) || null;
  const inspectedMentor = users.find(u => u.id === inspectedMentorId) || null;

  const pendingApprovalsCount = approvalQueue.filter(a => a.status === 'submitted' || a.status === 'under_review').length;

  const handleOpenCreateWithType = (type: 'course' | 'quiz' | 'assignment' = 'course') => {
    setDefaultContentType(type);
    setIsCreateContentOpen(true);
  };

  // Breadcrumbs text helper
  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'learners':
        return 'Users / Learners Directory';
      case 'mentors':
        return 'Users / Mentor Faculty';
      case 'content-courses':
        return 'Content / Courses';
      case 'content-quizzes':
        return 'Content / Quizzes';
      case 'content-assignments':
        return 'Content / Assignments';
      case 'approval':
        return 'Quality Assurance & Approval Queue';
      case 'analytics':
        return 'Platform Analytics & Telemetry';
      case 'rewards':
        return 'Rewards & Badges';
      case 'settings':
        return 'Platform Settings';
      default:
        return 'Dashboard';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <AdminOverview
            onNavigateTab={tab => setActiveTab(tab)}
            onOpenCreateContent={type => handleOpenCreateWithType(type || 'course')}
            onViewLearner={id => setInspectedLearnerId(id)}
            onViewMentor={id => setInspectedMentorId(id)}
          />
        );
      case 'learners':
        return (
          <LearnersManagement
            onViewLearner={id => setInspectedLearnerId(id)}
            onViewMentor={id => setInspectedMentorId(id)}
          />
        );
      case 'mentors':
        return (
          <MentorsManagement
            onViewMentor={id => setInspectedMentorId(id)}
            onNavigateToCourses={() => setActiveTab('content-courses')}
            onNavigateToApproval={() => setActiveTab('approval')}
          />
        );
      case 'content-courses':
        return (
          <ContentManagement
            initialSubTab="courses"
            onSubTabChange={subTab => setActiveTab(`content-${subTab}`)}
            onOpenCreateContent={type => handleOpenCreateWithType(type || 'course')}
          />
        );
      case 'content-quizzes':
        return (
          <ContentManagement
            initialSubTab="quizzes"
            onSubTabChange={subTab => setActiveTab(`content-${subTab}`)}
            onOpenCreateContent={type => handleOpenCreateWithType(type || 'quiz')}
          />
        );
      case 'content-assignments':
        return (
          <ContentManagement
            initialSubTab="assignments"
            onSubTabChange={subTab => setActiveTab(`content-${subTab}`)}
            onOpenCreateContent={type => handleOpenCreateWithType(type || 'assignment')}
          />
        );
      case 'approval':
        return <ContentApproval />;
      case 'analytics':
        return <AdminAnalyticsView />;
      case 'rewards':
        return <AdminRewardsBadges />;
      case 'settings':
        return <AdminSettingsView />;
      default:
        return (
          <AdminOverview
            onNavigateTab={tab => setActiveTab(tab)}
            onOpenCreateContent={type => handleOpenCreateWithType(type || 'course')}
            onViewLearner={id => setInspectedLearnerId(id)}
            onViewMentor={id => setInspectedMentorId(id)}
          />
        );
    }
  };

  const navItemClass = (id: string) => {
    const isActive = activeTab === id;
    return `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
      isActive
        ? 'bg-blue-600 text-white shadow-sm'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;
  };

  const subNavItemClass = (id: string) => {
    const isActive = activeTab === id;
    return `w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
      isActive
        ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
    }`;
  };

  const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="flex min-h-[calc(100vh-65px)] bg-slate-50 text-slate-900 relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarMobileOpen && (
        <div
          onClick={() => setIsSidebarMobileOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* ADMIN SIDEBAR NAVIGATION */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[65px] h-screen lg:h-[calc(100vh-65px)] w-64 bg-white border-r border-slate-200 z-50 lg:z-10 flex flex-col justify-between p-4 overflow-y-auto custom-scrollbar transition-transform duration-300 ${
          isSidebarMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Top Brand & Portal Title */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-xs">
                LMS
              </div>
              <div>
                <h2 className="text-xs uppercase font-extrabold tracking-wider text-slate-900 font-display">
                  Admin Console
                </h2>
                <span className="text-[10px] text-slate-500 font-mono">Platform Governance</span>
              </div>
            </div>

            <button
              onClick={() => setIsSidebarMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800"
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation Tree */}
          <nav className="space-y-1 text-xs">
            {/* 1. Admin Dashboard */}
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setIsSidebarMobileOpen(false);
              }}
              className={navItemClass('dashboard')}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </div>
            </button>

            {/* 2. Users (Tree with Learners & Mentors) */}
            <div className="space-y-1 pt-1">
              <button
                onClick={() => setIsUsersOpen(!isUsersOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Users size={16} className="text-blue-600" />
                  <span>Users</span>
                </div>
                {isUsersOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {isUsersOpen && (
                <div className="pl-4 space-y-1 border-l-2 border-slate-200 ml-4 py-1">
                  <button
                    onClick={() => {
                      setActiveTab('learners');
                      setIsSidebarMobileOpen(false);
                    }}
                    className={subNavItemClass('learners')}
                  >
                    <GraduationCap size={14} className="text-blue-600" />
                    <span>Learners</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('mentors');
                      setIsSidebarMobileOpen(false);
                    }}
                    className={subNavItemClass('mentors')}
                  >
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>Mentors</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Content (Courses, Quizzes, Assignments ONLY) */}
            <div className="space-y-1 pt-1">
              <button
                onClick={() => setIsContentOpen(!isContentOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen size={16} className="text-indigo-600" />
                  <span>Content</span>
                </div>
                {isContentOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {isContentOpen && (
                <div className="pl-4 space-y-1 border-l-2 border-slate-200 ml-4 py-1">
                  <button
                    onClick={() => {
                      setActiveTab('content-courses');
                      setIsSidebarMobileOpen(false);
                    }}
                    className={subNavItemClass('content-courses')}
                  >
                    <BookOpen size={14} className="text-indigo-600" />
                    <span>Courses</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('content-quizzes');
                      setIsSidebarMobileOpen(false);
                    }}
                    className={subNavItemClass('content-quizzes')}
                  >
                    <HelpCircle size={14} className="text-cyan-600" />
                    <span>Quizzes</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('content-assignments');
                      setIsSidebarMobileOpen(false);
                    }}
                    className={subNavItemClass('content-assignments')}
                  >
                    <FileCheck2 size={14} className="text-teal-600" />
                    <span>Assignments</span>
                  </button>
                </div>
              )}
            </div>

            {/* 4. Content Approval */}
            <button
              onClick={() => {
                setActiveTab('approval');
                setIsSidebarMobileOpen(false);
              }}
              className={navItemClass('approval')}
            >
              <div className="flex items-center gap-2.5">
                <FileCheck2 size={16} className="text-amber-600" />
                <span>Approval Queue</span>
              </div>
              {pendingApprovalsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold text-[10px]">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>

            {/* 5. Platform Analytics */}
            <button
              onClick={() => {
                setActiveTab('analytics');
                setIsSidebarMobileOpen(false);
              }}
              className={navItemClass('analytics')}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 size={16} className="text-blue-600" />
                <span>Analytics</span>
              </div>
            </button>

            {/* 6. Rewards & Badges */}
            <button
              onClick={() => {
                setActiveTab('rewards');
                setIsSidebarMobileOpen(false);
              }}
              className={navItemClass('rewards')}
            >
              <div className="flex items-center gap-2.5">
                <Award size={16} className="text-amber-600" />
                <span>Rewards & Badges</span>
              </div>
            </button>

            {/* 7. Settings */}
            <button
              onClick={() => {
                setActiveTab('settings');
                setIsSidebarMobileOpen(false);
              }}
              className={navItemClass('settings')}
            >
              <div className="flex items-center gap-2.5">
                <Sliders size={16} className="text-slate-600" />
                <span>Settings</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          {/* View As Learner Action Button */}
          <button
            onClick={() => setViewAsLearner(true)}
            className="w-full py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs"
          >
            <Eye size={14} />
            <span>View as Learner</span>
          </button>

          {/* Active Admin Profile Box */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</h4>
                <span className="text-[10px] text-slate-500 font-mono block">ROLE_ADMIN</span>
              </div>
            </div>

            <button
              onClick={logoutUser}
              className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top Sticky Header */}
        <header className="sticky top-[65px] z-20 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <Menu size={18} />
            </button>

            {/* Breadcrumb Path */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-400">Admin Console</span>
              <span className="text-slate-300">/</span>
              <strong className="text-slate-900 font-bold">{getBreadcrumbTitle()}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenCreateWithType('course')}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Plus size={14} />
              <span>+ Create Content</span>
            </button>

            <button
              onClick={() => setViewAsLearner(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-all"
            >
              <Eye size={13} />
              <span>View as Learner</span>
            </button>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Create Content Modal (Courses, Quizzes, Assignments Only) */}
      {isCreateContentOpen && (
        <CreateContentModal
          onClose={() => setIsCreateContentOpen(false)}
          defaultContentType={defaultContentType}
        />
      )}

      {/* Learner Inspector Modal */}
      {inspectedLearnerId && (
        <LearnerInspectorModal
          learner={inspectedLearner}
          courses={courses}
          onClose={() => setInspectedLearnerId(null)}
        />
      )}

      {/* Mentor Inspector Modal */}
      {inspectedMentorId && (
        <MentorInspectorModal
          mentor={inspectedMentor}
          courses={courses}
          approvalQueue={approvalQueue}
          allUsers={users}
          onClose={() => setInspectedMentorId(null)}
        />
      )}
    </div>
  );
};
