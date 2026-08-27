import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  GraduationCap,
  BookOpen,
  FileCheck2,
  HelpCircle,
  TrendingUp,
  Award,
  ShieldCheck,
  Plus,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronRight,
  Eye,
  CheckSquare,
  DollarSign,
  ArrowRight,
  Activity
} from 'lucide-react';

interface AdminOverviewProps {
  onNavigateTab: (tab: string) => void;
  onOpenCreateContent: (type?: 'course' | 'quiz' | 'assignment') => void;
  onViewLearner: (userId: string) => void;
  onViewMentor: (userId: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  onNavigateTab,
  onOpenCreateContent,
  onViewLearner,
  onViewMentor,
}) => {
  const {
    platformStats,
    approvalQueue,
    users,
    courses,
    quizzes,
    assignments,
    approveContent,
    requestChangesContent,
    showToast
  } = useApp();

  const learners = users.filter(u => u.role === 'student' || u.role === 'learner' || u.role === 'ROLE_LEARNER');
  const mentors = users.filter(u => u.role === 'mentor' || u.role === 'seller' || u.role === 'ROLE_MENTOR');

  const pendingApprovals = approvalQueue.filter(item => item.status === 'submitted' || item.status === 'under_review');
  const pendingCourseApprovals = courses.filter(c => c.status === 'submitted' || c.status === 'under_review');
  const totalMarketplaceRevenue = courses.reduce((sum, c) => sum + (c.price * (c.studentsCount || 0)), 0);

  const statCards = [
    {
      title: 'Total Users',
      value: users.length,
      subtitle: `${learners.length} Learners • ${mentors.length} Mentors`,
      icon: <Users size={18} className="text-blue-600" />,
      onClick: () => onNavigateTab('learners')
    },
    {
      title: 'Active Faculty',
      value: mentors.length,
      subtitle: '100% Verified Mentors',
      icon: <ShieldCheck size={18} className="text-emerald-600" />,
      onClick: () => onNavigateTab('mentors')
    },
    {
      title: 'Courses Catalog',
      value: courses.length,
      subtitle: `${courses.filter(c => c.status === 'published' || c.status === 'approved').length} Published`,
      icon: <BookOpen size={18} className="text-indigo-600" />,
      onClick: () => onNavigateTab('content-courses')
    },
    {
      title: 'Active Quizzes',
      value: quizzes.length,
      subtitle: 'Knowledge Checkpoints',
      icon: <HelpCircle size={18} className="text-cyan-600" />,
      onClick: () => onNavigateTab('content-quizzes')
    },
    {
      title: 'Course Assignments',
      value: assignments.length,
      subtitle: 'Hands-on Projects',
      icon: <FileCheck2 size={18} className="text-teal-600" />,
      onClick: () => onNavigateTab('content-assignments')
    },
    {
      title: 'Gross Platform Sales',
      value: `$${totalMarketplaceRevenue.toLocaleString()}`,
      subtitle: 'Course Marketplace Volume',
      icon: <DollarSign size={18} className="text-purple-600" />,
      onClick: () => onNavigateTab('analytics')
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 flex items-center gap-1">
              <ShieldCheck size={13} /> Platform Executive Overview
            </span>
            <span className="text-xs text-slate-500">• Production Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-2">
            Enterprise LMS Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Real-time platform metrics, faculty governance, curriculum quality assurance, and user operations.
          </p>
        </div>

        {/* Quick Create Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => onOpenCreateContent('course')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus size={15} />
            <span>New Course</span>
          </button>
          <button
            onClick={() => onOpenCreateContent('quiz')}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition-all shadow-sm"
          >
            <Plus size={15} />
            <span>New Quiz</span>
          </button>
          <button
            onClick={() => onOpenCreateContent('assignment')}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition-all shadow-sm"
          >
            <Plus size={15} />
            <span>New Assignment</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            onClick={card.onClick}
            className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">{card.title}</span>
              <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-blue-50 transition-colors">
                {card.icon}
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">
              {card.value}
            </div>
            <span className="text-[10px] text-slate-400 font-medium block">
              {card.subtitle}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Navigation Hub */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
          Management Portals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigateTab('learners')}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md cursor-pointer transition-all flex items-start gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <GraduationCap size={20} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 group-hover:text-blue-700 flex items-center gap-1">
                <span>Learner Management</span>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Directory, quiz accuracy, and study telemetry</p>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('mentors')}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md cursor-pointer transition-all flex items-start gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 flex items-center gap-1">
                <span>Mentor Dashboard</span>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Faculty directory, ratings, and course authorship</p>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('content-courses')}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all flex items-start gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 group-hover:text-indigo-700 flex items-center gap-1">
                <span>Content & Curriculum</span>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Courses, module quizzes, and project assignments</p>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('approval')}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-amber-300 hover:shadow-md cursor-pointer transition-all flex items-start gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors relative">
              <FileCheck2 size={20} />
              {pendingApprovals.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {pendingApprovals.length}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 group-hover:text-amber-700 flex items-center gap-1">
                <span>Quality Assurance Gateway</span>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Review faculty submissions before publishing</p>
            </div>
          </div>
        </div>
      </div>

      {/* PENDING APPROVALS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-600" />
              <span>Pending Action Items ({pendingApprovals.length + pendingCourseApprovals.length})</span>
            </h2>
            <p className="text-xs text-slate-500">Items submitted by faculty awaiting administrator approval</p>
          </div>

          <button
            onClick={() => onNavigateTab('approval')}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Open Review Gateway</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Action 1: Pending Courses */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen size={16} className="text-indigo-600" />
                <span>Courses Awaiting Approval ({pendingCourseApprovals.length})</span>
              </h3>
            </div>

            {pendingCourseApprovals.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No course approvals pending in queue.</p>
            ) : (
              <div className="space-y-3">
                {pendingCourseApprovals.map(course => (
                  <div key={course.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-bold text-slate-900">{course.title}</strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                        {course.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">Instructor: {course.instructorName || 'Dr. Meera Iyer'} • Price: ${course.price}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          approveContent(course.id, true);
                          showToast(`Course "${course.title}" approved and published!`, 'success');
                        }}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs"
                      >
                        Approve & Publish
                      </button>
                      <button
                        onClick={() => {
                          requestChangesContent(course.id, 'Please update module code examples.');
                        }}
                        className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold"
                      >
                        Request Changes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action 2: Mentor Applications & Quality Queue */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>Mentor Faculty Verifications</span>
              </h3>
              <button onClick={() => onNavigateTab('mentors')} className="text-xs font-bold text-blue-600 hover:underline">
                View Faculty
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <strong className="text-xs font-bold text-slate-900 block">Dr. Meera Iyer</strong>
                  <span className="text-[11px] text-slate-500">Full-Stack AI Architecture • Verified Faculty</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    VERIFIED
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <strong className="text-xs font-bold text-slate-900 block">Rakesh Verma</strong>
                  <span className="text-[11px] text-slate-500">Java Enterprise Architect • Verified Faculty</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    VERIFIED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
