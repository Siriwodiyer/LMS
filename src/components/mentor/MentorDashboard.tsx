import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CourseCreator } from './CourseCreator';
import {
  DollarSign,
  BookOpen,
  Users,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Edit,
  Eye,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Bell,
  User,
  GraduationCap,
  TrendingUp
} from 'lucide-react';

interface MentorDashboardProps {
  onNavigateToCourses?: () => void;
  onNavigateToCreateCourse?: () => void;
  onNavigateToStudents?: () => void;
  onNavigateToNotifications?: () => void;
  onNavigateToProfile?: () => void;
}

export const MentorDashboard: React.FC<MentorDashboardProps> = ({
  onNavigateToCourses,
  onNavigateToCreateCourse,
  onNavigateToStudents,
  onNavigateToNotifications,
  onNavigateToProfile
}) => {
  const { currentUser, courses, enrolledStudents, approvalQueue, notifications, showToast } = useApp();
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  // Filter courses created by current mentor
  const myCourses = courses.filter(
    c => c.instructorId === currentUser.id || currentUser.role === 'admin' || currentUser.role === 'mentor'
  );

  const totalCourses = myCourses.length;
  const publishedCoursesCount = myCourses.filter(c => c.status === 'published' || c.status === 'approved').length;
  const pendingCoursesCount = myCourses.filter(c => c.status === 'submitted' || c.status === 'under_review').length;
  const changesRequestedCount = myCourses.filter(c => c.status === 'changes_requested' || c.status === 'rejected').length;
  const totalStudentsCount = myCourses.reduce((sum, c) => sum + (c.studentsCount || 0), 0);
  const totalEarnings = myCourses.reduce((sum, c) => sum + (c.price * (c.studentsCount || 0)), 0);
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
      case 'approved':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
            Published
          </span>
        );
      case 'submitted':
      case 'under_review':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold uppercase tracking-wider">
            Under Review
          </span>
        );
      case 'changes_requested':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 text-[10px] font-bold uppercase tracking-wider">
            Changes Needed
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold uppercase tracking-wider">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold uppercase tracking-wider">
            Draft
          </span>
        );
    }
  };

  const handleCreateCourseClick = () => {
    if (onNavigateToCreateCourse) {
      onNavigateToCreateCourse();
    } else {
      setIsCreatorOpen(true);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pb-24 animate-in fade-in duration-200">
      {/* Mentor Hero Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center shadow-sm shrink-0">
            {currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Mentor Overview</span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                Verified Instructor
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-display mt-1">{currentUser.name}</h1>
            <p className="text-xs text-slate-600 mt-1 max-w-md">{currentUser.bio || 'Tech educator and course author.'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {onNavigateToProfile && (
            <button
              onClick={onNavigateToProfile}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition-all shadow-sm"
            >
              <User size={15} />
              <span>Edit Profile</span>
            </button>
          )}

          <button
            onClick={handleCreateCourseClick}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus size={16} />
            <span>Create New Course</span>
          </button>
        </div>
      </div>

      {/* Summary Statistic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <div
          onClick={onNavigateToCourses}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Courses</span>
            <BookOpen size={14} className="text-emerald-600" />
          </div>
          <strong className="text-2xl font-bold text-slate-900 font-mono block mt-1">{totalCourses}</strong>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
            Manage Catalog →
          </span>
        </div>

        <div
          onClick={onNavigateToCourses}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Published</span>
            <CheckCircle2 size={14} className="text-emerald-600" />
          </div>
          <strong className="text-2xl font-bold text-emerald-600 font-mono block mt-1">{publishedCoursesCount}</strong>
          <span className="text-[10px] text-slate-400 mt-1 block">Live in store</span>
        </div>

        <div
          onClick={onNavigateToCourses}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-amber-300 hover:shadow-md cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Pending Review</span>
            <Clock size={14} className="text-amber-600" />
          </div>
          <strong className="text-2xl font-bold text-amber-600 font-mono block mt-1">{pendingCoursesCount}</strong>
          <span className="text-[10px] text-slate-400 mt-1 block">Awaiting admin</span>
        </div>

        <div
          onClick={onNavigateToStudents}
          className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Students</span>
            <Users size={14} className="text-blue-600" />
          </div>
          <strong className="text-2xl font-bold text-blue-600 font-mono block mt-1">{totalStudentsCount}</strong>
          <span className="text-[10px] text-blue-600 font-semibold mt-1 flex items-center gap-0.5">
            View Roster →
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Earnings</span>
            <DollarSign size={14} className="text-emerald-600" />
          </div>
          <strong className="text-2xl font-bold text-slate-900 font-mono block mt-1">
            ${totalEarnings.toLocaleString()}
          </strong>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Gross sales</span>
        </div>
      </div>

      {/* Quick Access Navigation Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
          Mentor Quick Navigation
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div
            onClick={onNavigateToCourses}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 flex items-center gap-1">
                <span>My Courses Catalog</span>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Browse, edit curriculum, and check review status</p>
            </div>
          </div>

          <div
            onClick={handleCreateCourseClick}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Plus size={20} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 flex items-center gap-1">
                <span>Create New Course</span>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Build modules, set pricing, and use AI assistant</p>
            </div>
          </div>

          <div
            onClick={onNavigateToStudents}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users size={20} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 group-hover:text-blue-700 flex items-center gap-1">
                <span>Enrolled Students</span>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Track learning progress & send feedback notes</p>
            </div>
          </div>

          <div
            onClick={onNavigateToNotifications}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors relative">
              <Bell size={20} />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadNotifsCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 group-hover:text-purple-700 flex items-center gap-1">
                <span>Alerts & Notifications</span>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Admin approval updates & enrollment alerts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Review Alert Banner (if courses need changes) */}
      {changesRequestedCount > 0 && (
        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-orange-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-orange-600 shrink-0" />
            <div>
              <strong className="font-bold text-xs">Action Required on Courses:</strong>
              <p className="text-xs text-orange-800">
                You have {changesRequestedCount} course(s) with feedback requested by the administration team.
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToCourses}
            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shrink-0 shadow-sm"
          >
            Review Feedback
          </button>
        </div>
      )}

      {/* Recent Courses Preview Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen size={18} className="text-emerald-600" />
            <span>Course Catalog Overview</span>
          </h2>
          {onNavigateToCourses && (
            <button
              onClick={onNavigateToCourses}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>View Full Course Catalog ({myCourses.length})</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        <div className="overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-3.5 font-bold">Course Name</th>
                <th className="p-3.5 font-bold">Category</th>
                <th className="p-3.5 font-bold">Students</th>
                <th className="p-3.5 font-bold">Price</th>
                <th className="p-3.5 font-bold">Status</th>
                <th className="p-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {myCourses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No courses created yet. Click "Create New Course" to get started!
                  </td>
                </tr>
              ) : (
                myCourses.slice(0, 4).map(course => (
                  <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <strong className="text-slate-900 block font-bold">{course.title}</strong>
                          <span className="text-[11px] text-slate-500">{course.level}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-medium">{course.category}</td>
                    <td className="p-3.5 font-mono font-bold text-blue-600">{course.studentsCount || 0}</td>
                    <td className="p-3.5 font-mono font-bold text-slate-900">${course.price}</td>
                    <td className="p-3.5">{getStatusBadge(course.status)}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={onNavigateToCourses}
                        className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course Creator Modal fallback */}
      {isCreatorOpen && <CourseCreator onClose={() => setIsCreatorOpen(false)} />}
    </div>
  );
};
