import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, ApprovalStatus } from '../../types';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Clock,
  Users,
  DollarSign,
  Star,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  PlayCircle,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowRight,
  X,
  Check
} from 'lucide-react';

interface MentorCoursesViewProps {
  onNavigateToCreateCourse?: () => void;
}

export const MentorCoursesView: React.FC<MentorCoursesViewProps> = ({
  onNavigateToCreateCourse
}) => {
  const { currentUser, courses, deleteCourse, updateCourse, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ApprovalStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewLayout, setViewLayout] = useState<'grid' | 'table'>('grid');

  // Modals state
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<Course | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  // Filter courses owned by or assigned to current mentor
  const mentorCourses = useMemo(() => {
    return courses.filter(
      c => c.instructorId === currentUser.id || currentUser.role === 'admin' || currentUser.role === 'mentor'
    );
  }, [courses, currentUser]);

  // Filtered courses based on search and filters
  const filteredCourses = useMemo(() => {
    return mentorCourses.filter(c => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.subtitle && c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === 'all' ||
        c.status === statusFilter ||
        (statusFilter === 'published' && c.status === 'approved') ||
        (statusFilter === 'under_review' && c.status === 'submitted');

      const matchesCategory =
        categoryFilter === 'all' || c.category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [mentorCourses, searchQuery, statusFilter, categoryFilter]);

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set(mentorCourses.map(c => c.category));
    return Array.from(set);
  }, [mentorCourses]);

  // Statistics
  const totalCourses = mentorCourses.length;
  const publishedCount = mentorCourses.filter(c => c.status === 'published' || c.status === 'approved').length;
  const pendingCount = mentorCourses.filter(c => c.status === 'submitted' || c.status === 'under_review').length;
  const changesCount = mentorCourses.filter(c => c.status === 'changes_requested' || c.status === 'rejected').length;
  const totalStudents = mentorCourses.reduce((sum, c) => sum + (c.studentsCount || 0), 0);
  const totalEarnings = mentorCourses.reduce((sum, c) => sum + (c.price * (c.studentsCount || 0)), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold uppercase tracking-wider">
            <CheckCircle2 size={12} /> Published
          </span>
        );
      case 'submitted':
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold uppercase tracking-wider">
            <Clock size={12} /> Under Review
          </span>
        );
      case 'changes_requested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 text-[11px] font-bold uppercase tracking-wider">
            <AlertTriangle size={12} /> Changes Needed
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-[11px] font-bold uppercase tracking-wider">
            <XCircle size={12} /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold uppercase tracking-wider">
            <HelpCircle size={12} /> Draft
          </span>
        );
    }
  };

  const handleSaveEditCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    updateCourse(editingCourse.id, {
      title: editingCourse.title,
      subtitle: editingCourse.subtitle,
      description: editingCourse.description,
      price: Number(editingCourse.price),
      discountedPrice: editingCourse.discountedPrice ? Number(editingCourse.discountedPrice) : undefined,
      category: editingCourse.category,
      level: editingCourse.level,
      status: 'submitted', // re-submit for review upon major edits
      submittedAt: new Date().toISOString()
    });

    showToast(`Course "${editingCourse.title}" updated and submitted for review!`, 'success');
    setEditingCourse(null);
  };

  const handleConfirmDelete = () => {
    if (!courseToDelete) return;
    deleteCourse(courseToDelete.id);
    showToast(`Course "${courseToDelete.title}" removed.`, 'info');
    setCourseToDelete(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24 animate-in fade-in duration-200">
      {/* Top Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
              <BookOpen size={13} /> Course Management
            </span>
            <span className="text-xs text-slate-500">• {totalCourses} Total Courses</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-2">
            My Courses & Curriculum
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Manage your educational courses, track review status, update lessons and review feedback from the administration team.
          </p>
        </div>

        <button
          onClick={onNavigateToCreateCourse}
          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm hover:shadow transition-all shrink-0"
        >
          <Plus size={18} />
          <span>Create New Course</span>
        </button>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total</span>
          <strong className="text-xl sm:text-2xl font-bold text-slate-900 font-mono block mt-1">{totalCourses}</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Active catalog</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block">Published</span>
          <strong className="text-xl sm:text-2xl font-bold text-emerald-600 font-mono block mt-1">{publishedCount}</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Live in store</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider block">In Review</span>
          <strong className="text-xl sm:text-2xl font-bold text-amber-600 font-mono block mt-1">{pendingCount}</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Pending admin</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-orange-600 uppercase tracking-wider block">Action Req.</span>
          <strong className="text-xl sm:text-2xl font-bold text-orange-600 font-mono block mt-1">{changesCount}</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Changes needed</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">Students</span>
          <strong className="text-xl sm:text-2xl font-bold text-blue-600 font-mono block mt-1">{totalStudents}</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Total enrolled</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider block">Earnings</span>
          <strong className="text-xl sm:text-2xl font-bold text-slate-900 font-mono block mt-1">${totalEarnings.toLocaleString()}</strong>
          <span className="text-[10px] text-emerald-600 mt-0.5 block font-semibold">Gross sales</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by course title, category or keyword..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({mentorCourses.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'published'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            Published ({publishedCount})
          </button>
          <button
            onClick={() => setStatusFilter('under_review')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'under_review'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            Under Review ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('changes_requested')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'changes_requested'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
            }`}
          >
            Changes Req. ({changesCount})
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-end md:self-auto">
          <button
            onClick={() => setViewLayout('grid')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
              viewLayout === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Cards
          </button>
          <button
            onClick={() => setViewLayout('table')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
              viewLayout === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Courses Display */}
      {filteredCourses.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <BookOpen size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-900">No courses match your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or status filters, or create a brand new course curriculum.
          </p>
          <button
            onClick={onNavigateToCreateCourse}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm"
          >
            <Plus size={15} /> Create Course
          </button>
        </div>
      ) : viewLayout === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map(course => {
            const hasAdminFeedback = Boolean(course.rejectionFeedback);
            return (
              <div
                key={course.id}
                className="rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group"
              >
                {/* Thumbnail & Badges */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {getStatusBadge(course.status)}
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold border border-white/20">
                      {course.level}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm text-[11px]">
                      {course.category}
                    </span>
                    <span className="font-bold font-mono text-sm bg-emerald-600/90 px-2 py-0.5 rounded backdrop-blur-sm">
                      ${course.price}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {course.subtitle || course.description}
                    </p>
                  </div>

                  {/* Modules & Stats Row */}
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Modules</span>
                      <strong className="text-slate-800 font-mono font-bold block mt-0.5">
                        {course.modules?.length || 1}
                      </strong>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Students</span>
                      <strong className="text-blue-600 font-mono font-bold block mt-0.5">
                        {course.studentsCount || 0}
                      </strong>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Rating</span>
                      <div className="flex items-center justify-center gap-1 mt-0.5">
                        <Star size={11} className="text-amber-500 fill-amber-500" />
                        <strong className="text-slate-800 font-mono font-bold text-[11px]">
                          {course.rating ? course.rating.toFixed(1) : '5.0'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Admin Feedback Box (if any) */}
                  {hasAdminFeedback && (
                    <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-orange-950">
                        <AlertTriangle size={13} className="text-orange-600" />
                        <span>Admin Review Feedback:</span>
                      </div>
                      <p className="text-[11px] text-orange-800 leading-relaxed bg-white/70 p-2 rounded border border-orange-200/60">
                        {course.rejectionFeedback}
                      </p>
                      <button
                        onClick={() => setEditingCourse(course)}
                        className="text-[11px] font-bold text-orange-900 hover:text-orange-950 underline flex items-center gap-1 mt-1"
                      >
                        <Edit size={11} /> Edit & Resubmit to Review Queue
                      </button>
                    </div>
                  )}

                  {/* Action Buttons Footer */}
                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedCourseForDetails(course)}
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Eye size={13} />
                      <span>Curriculum</span>
                    </button>

                    <button
                      onClick={() => setEditingCourse(course)}
                      className="px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-200 transition-all"
                      title="Edit Course"
                    >
                      <Edit size={13} />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => setCourseToDelete(course)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                      title="Delete Course"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-4 font-bold">Course Title & Info</th>
                <th className="p-4 font-bold">Category</th>
                <th className="p-4 font-bold">Level</th>
                <th className="p-4 font-bold">Price</th>
                <th className="p-4 font-bold">Enrolled</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCourses.map(course => (
                <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <strong className="text-slate-900 block font-bold text-xs">{course.title}</strong>
                        <span className="text-[11px] text-slate-500">{course.modules?.length || 1} modules</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium">{course.category}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                      {course.level}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-900">${course.price}</td>
                  <td className="p-4 font-mono font-bold text-blue-600">{course.studentsCount || 0}</td>
                  <td className="p-4">{getStatusBadge(course.status)}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedCourseForDetails(course)}
                        className="px-2.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px]"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => setEditingCourse(course)}
                        className="p-1.5 rounded hover:bg-emerald-50 text-emerald-700"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => setCourseToDelete(course)}
                        className="p-1.5 rounded hover:bg-rose-50 text-rose-600"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 1. Course Details / Curriculum Modal */}
      {selectedCourseForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCourseForDetails.thumbnailUrl}
                  alt={selectedCourseForDetails.title}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-base text-slate-900">{selectedCourseForDetails.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    {getStatusBadge(selectedCourseForDetails.status)}
                    <span className="text-xs text-slate-500 font-mono">• ${selectedCourseForDetails.price}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCourseForDetails(null)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Course Overview & Description</h4>
                <p className="text-slate-600 leading-relaxed">{selectedCourseForDetails.description}</p>
              </div>

              {/* Learning Outcomes */}
              {selectedCourseForDetails.learningOutcomes && selectedCourseForDetails.learningOutcomes.length > 0 && (
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                  <h4 className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                    <Sparkles size={14} className="text-emerald-600" />
                    <span>Key Learning Outcomes</span>
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedCourseForDetails.learningOutcomes.map((outcome, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[11px] text-slate-700">
                        <Check size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Modules List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Layers size={16} className="text-emerald-600" />
                    <span>Curriculum Modules ({selectedCourseForDetails.modules?.length || 0})</span>
                  </h4>
                </div>

                <div className="space-y-2">
                  {selectedCourseForDetails.modules?.map((mod, idx) => (
                    <div
                      key={mod.id || idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div>
                          <strong className="text-slate-900 block font-semibold text-xs">{mod.title}</strong>
                          <p className="text-slate-500 text-[11px] mt-0.5">{mod.description}</p>
                          {mod.videoUrl && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 font-semibold mt-1">
                              <PlayCircle size={12} /> Video Lecture ({mod.durationMinutes || 25} min)
                            </span>
                          )}
                        </div>
                      </div>

                      {mod.isFreePreview && (
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold shrink-0">
                          Free Preview
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedCourseForDetails(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const toEdit = selectedCourseForDetails;
                  setSelectedCourseForDetails(null);
                  setEditingCourse(toEdit);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Edit size={13} /> Edit Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Quick Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Edit size={18} className="text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">Edit Course Details</h3>
              </div>
              <button
                onClick={() => setEditingCourse(null)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditCourse} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={editingCourse.title}
                  onChange={e => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={editingCourse.subtitle || ''}
                  onChange={e => setEditingCourse({ ...editingCourse, subtitle: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <input
                    type="text"
                    value={editingCourse.category}
                    onChange={e => setEditingCourse({ ...editingCourse, category: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Skill Level</label>
                  <select
                    value={editingCourse.level}
                    onChange={e => setEditingCourse({ ...editingCourse, level: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-slate-900 bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingCourse.price}
                    onChange={e => setEditingCourse({ ...editingCourse, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Discount Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingCourse.discountedPrice || ''}
                    onChange={e => setEditingCourse({ ...editingCourse, discountedPrice: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows={4}
                  value={editingCourse.description}
                  onChange={e => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-slate-900 resize-none"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                <strong>Note:</strong> Updating this course will automatically resubmit it to the admin approval queue to ensure content quality.
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                >
                  Save & Resubmit Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Delete Confirmation Dialog */}
      {courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 size={22} />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-slate-900 text-base">Delete Course</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete <strong className="text-slate-800">"{courseToDelete.title}"</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setCourseToDelete(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
