import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, Quiz, Assignment, ApprovalStatus } from '../../types';
import {
  BookOpen,
  HelpCircle,
  FileCheck2,
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Edit,
  Clock,
  Award,
  Layers,
  Search,
  ExternalLink,
  X,
  Play,
  Filter,
  Check,
  Calendar,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface ContentManagementProps {
  initialSubTab?: 'courses' | 'quizzes' | 'assignments';
  onSubTabChange?: (tab: 'courses' | 'quizzes' | 'assignments') => void;
  onOpenCreateContent: (type?: 'course' | 'quiz' | 'assignment') => void;
}

export const ContentManagement: React.FC<ContentManagementProps> = ({
  initialSubTab = 'courses',
  onSubTabChange,
  onOpenCreateContent,
}) => {
  const {
    courses,
    toggleCoursePublish,
    deleteCourse,
    quizzes,
    deleteQuiz,
    assignments,
    deleteAssignment,
    gradeAssignmentSubmission,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'courses' | 'quizzes' | 'assignments'>(initialSubTab);

  // Synchronize when initialSubTab changes from sidebar navigation
  React.useEffect(() => {
    setActiveTab(initialSubTab);
  }, [initialSubTab]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'under_review' | 'draft'>('all');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');

  // Modals state
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);
  const [previewQuiz, setPreviewQuiz] = useState<Quiz | null>(null);
  const [selectedAssignmentForGrading, setSelectedAssignmentForGrading] = useState<Assignment | null>(null);
  const [awardedMarks, setAwardedMarks] = useState<number>(90);
  const [gradingFeedback, setGradingFeedback] = useState('Excellent code architecture and unit tests!');

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.instructorName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && (c.status === 'published' || c.status === 'approved')) ||
        (statusFilter === 'under_review' && (c.status === 'submitted' || c.status === 'under_review')) ||
        (statusFilter === 'draft' && c.status === 'draft');

      return matchesSearch && matchesStatus;
    });
  }, [courses, searchQuery, statusFilter]);

  // Filtered Quizzes
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(q => {
      const matchesSearch =
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.courseTitle && q.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCourse =
        selectedCourseFilter === 'all' || q.courseId === selectedCourseFilter;

      return matchesSearch && matchesCourse;
    });
  }, [quizzes, searchQuery, selectedCourseFilter]);

  // Filtered Assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter(a => {
      const matchesSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.courseTitle && a.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCourse =
        selectedCourseFilter === 'all' || a.courseId === selectedCourseFilter;

      return matchesSearch && matchesCourse;
    });
  }, [assignments, searchQuery, selectedCourseFilter]);

  const handleGradeSubmission = (submissionId: string) => {
    if (!selectedAssignmentForGrading) return;
    gradeAssignmentSubmission(selectedAssignmentForGrading.id, submissionId, awardedMarks, gradingFeedback);
    showToast(`Submission graded successfully with score ${awardedMarks} marks.`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Top Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 flex items-center gap-1">
              <BookOpen size={13} /> Curriculum Management
            </span>
            <span className="text-xs text-slate-500">• Production LMS Content</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-2">
            Content Governance & Media Assets
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Publish, edit, inspect, and moderate official course masterclasses, interactive module quizzes, and project assignments.
          </p>
        </div>

        <button
          onClick={() => onOpenCreateContent(activeTab === 'quizzes' ? 'quiz' : activeTab === 'assignments' ? 'assignment' : 'course')}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all shrink-0"
        >
          <Plus size={16} />
          <span>
            {activeTab === 'quizzes' ? '+ Create Quiz' : activeTab === 'assignments' ? '+ Create Assignment' : '+ Create Course'}
          </span>
        </button>
      </div>

      {/* Sub-Tab Navigation Bar (Courses | Quizzes | Assignments ONLY) */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white border border-slate-200 shadow-sm">
        <button
          onClick={() => {
            setActiveTab('courses');
            setSearchQuery('');
            onSubTabChange?.('courses');
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'courses'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen size={15} />
          <span>Courses ({courses.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('quizzes');
            setSearchQuery('');
            onSubTabChange?.('quizzes');
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'quizzes'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <HelpCircle size={15} />
          <span>Quizzes ({quizzes.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('assignments');
            setSearchQuery('');
            onSubTabChange?.('assignments');
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'assignments'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileCheck2 size={15} />
          <span>Assignments ({assignments.length})</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab} by title, category, or keyword...`}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
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

        {/* Tab Specific Filters */}
        {activeTab === 'courses' ? (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({courses.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                statusFilter === 'published' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setStatusFilter('under_review')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                statusFilter === 'under_review' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Under Review
            </button>
          </div>
        ) : (
          <select
            value={selectedCourseFilter}
            onChange={e => setSelectedCourseFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="all">All Associated Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.title.length > 30 ? c.title.substring(0, 30) + '...' : c.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* 1. COURSES TAB CONTENT */}
      {activeTab === 'courses' && (
        <div>
          {filteredCourses.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <BookOpen size={24} className="mx-auto text-slate-400" />
              <h3 className="text-base font-bold text-slate-900">No courses match your filter</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Try adjusting your search terms or status filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCourses.map(course => {
                const isPublished = course.status === 'published' || course.status === 'approved';
                return (
                  <div
                    key={course.id}
                    className="rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    <div>
                      {/* Thumbnail & Badges */}
                      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                        <div className="absolute top-3 left-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              isPublished
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border-amber-200'
                            }`}
                          >
                            {course.status}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold border border-white/20">
                            {course.level}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                          <span className="font-semibold">{course.category}</span>
                          <span className="font-bold font-mono text-sm bg-blue-600/90 px-2 py-0.5 rounded">
                            ${course.price}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4 sm:p-5 space-y-3">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {course.subtitle || course.description}
                        </p>

                        <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
                          <div className="bg-slate-50 p-2 rounded-lg">
                            <span className="text-[10px] text-slate-400 block font-medium">Modules</span>
                            <strong className="text-slate-800 font-mono font-bold">{course.modules?.length || 1}</strong>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-lg">
                            <span className="text-[10px] text-slate-400 block font-medium">Students</span>
                            <strong className="text-blue-600 font-mono font-bold">{course.studentsCount || 0}</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-2 bg-slate-50/50">
                      <button
                        onClick={() => setPreviewCourse(course)}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 flex items-center justify-center gap-1 shadow-2xs"
                      >
                        <Eye size={13} />
                        <span>Curriculum</span>
                      </button>

                      <button
                        onClick={() => {
                          toggleCoursePublish(course.id);
                          showToast(`Course "${course.title}" status toggled.`, 'info');
                        }}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                          isPublished
                            ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs'
                        }`}
                      >
                        {isPublished ? 'Unpublish' : 'Publish'}
                      </button>

                      <button
                        onClick={() => {
                          deleteCourse(course.id);
                          showToast(`Course "${course.title}" deleted.`, 'info');
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete Course"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. QUIZZES TAB CONTENT */}
      {activeTab === 'quizzes' && (
        <div className="overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
          {filteredQuizzes.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <HelpCircle size={24} className="mx-auto text-slate-400" />
              <h3 className="text-base font-bold text-slate-900">No quizzes found</h3>
              <p className="text-xs text-slate-500">Create a quiz for any course module to get started.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-bold">Quiz Title</th>
                  <th className="p-4 font-bold">Associated Course</th>
                  <th className="p-4 font-bold">Difficulty</th>
                  <th className="p-4 font-bold">Total Marks</th>
                  <th className="p-4 font-bold">Passing %</th>
                  <th className="p-4 font-bold">Questions</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredQuizzes.map(quiz => (
                  <tr key={quiz.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                          <HelpCircle size={15} />
                        </div>
                        <div>
                          <strong className="text-slate-900 block font-bold text-xs">{quiz.title}</strong>
                          <span className="text-[11px] text-slate-500">{quiz.moduleTitle || 'Core Module'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-medium text-slate-800">{quiz.courseTitle || 'Masterclass'}</td>

                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold">
                        {quiz.difficulty}
                      </span>
                    </td>

                    <td className="p-4 font-mono font-bold text-slate-900">{quiz.totalMarks} pts</td>
                    <td className="p-4 font-mono font-bold text-emerald-600">{quiz.passingPercentage}%</td>
                    <td className="p-4 font-mono text-slate-800">{quiz.questions?.length || 5} questions</td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewQuiz(quiz)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                        >
                          Questions
                        </button>
                        <button
                          onClick={() => {
                            deleteQuiz(quiz.id);
                            showToast(`Quiz "${quiz.title}" deleted.`, 'info');
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete Quiz"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* 3. ASSIGNMENTS TAB CONTENT */}
      {activeTab === 'assignments' && (
        <div className="overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
          {filteredAssignments.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <FileCheck2 size={24} className="mx-auto text-slate-400" />
              <h3 className="text-base font-bold text-slate-900">No assignments found</h3>
              <p className="text-xs text-slate-500">Create a coding challenge or design project for learners.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-bold">Assignment Title</th>
                  <th className="p-4 font-bold">Associated Course</th>
                  <th className="p-4 font-bold">Submission Type</th>
                  <th className="p-4 font-bold">Max Marks</th>
                  <th className="p-4 font-bold">Due Date</th>
                  <th className="p-4 font-bold">Submissions</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredAssignments.map(assign => {
                  const submissionsCount = assign.submissions?.length || 1;
                  return (
                    <tr key={assign.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0">
                            <FileCheck2 size={15} />
                          </div>
                          <div>
                            <strong className="text-slate-900 block font-bold text-xs">{assign.title}</strong>
                            <span className="text-[11px] text-slate-500">{assign.instructions?.substring(0, 45)}...</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-medium text-slate-800">{assign.courseTitle || 'Masterclass'}</td>

                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border border-slate-200">
                          {assign.submissionType}
                        </span>
                      </td>

                      <td className="p-4 font-mono font-bold text-slate-900">{assign.maxMarks} pts</td>

                      <td className="p-4 font-mono text-slate-600">
                        {new Date(assign.dueDate).toLocaleDateString()}
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono font-bold">
                          {submissionsCount} Submissions
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedAssignmentForGrading(assign)}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs"
                          >
                            Grade ({submissionsCount})
                          </button>
                          <button
                            onClick={() => {
                              deleteAssignment(assign.id);
                              showToast(`Assignment "${assign.title}" deleted.`, 'info');
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Delete Assignment"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Course Curriculum Inspector Modal */}
      {previewCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <img
                  src={previewCourse.thumbnailUrl}
                  alt={previewCourse.title}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-base text-slate-900">{previewCourse.title}</h3>
                  <p className="text-xs text-slate-500">Instructor: {previewCourse.instructorName} • {previewCourse.modules?.length || 1} Modules</p>
                </div>
              </div>

              <button
                onClick={() => setPreviewCourse(null)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
              <p className="text-slate-600 leading-relaxed">{previewCourse.description}</p>

              <h4 className="font-bold text-slate-900 text-sm pt-2">Curriculum Modules</h4>
              <div className="space-y-2">
                {previewCourse.modules?.map((mod, i) => (
                  <div key={mod.id || i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                        {i + 1}
                      </span>
                      <div>
                        <strong className="text-slate-900 block font-bold text-xs">{mod.title}</strong>
                        <span className="text-[11px] text-slate-500">{mod.description}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-slate-500">{mod.durationMinutes || 25} min</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setPreviewCourse(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Questions Modal */}
      {previewQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-base text-slate-900">{previewQuiz.title}</h3>
                <p className="text-xs text-slate-500">{previewQuiz.questions?.length || 0} Questions • Passing: {previewQuiz.passingPercentage}%</p>
              </div>
              <button onClick={() => setPreviewQuiz(null)} className="p-2 rounded-full hover:bg-slate-200 text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {previewQuiz.questions?.map((q, idx) => (
                <div key={q.id || idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-bold">Q{idx + 1}: {q.prompt}</strong>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options?.map((opt, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded-lg text-xs flex items-center gap-2 border ${
                          i === q.correctIndex
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{opt}</span>
                        {i === q.correctIndex && <Check size={13} className="ml-auto text-emerald-600" />}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setPreviewQuiz(null)} className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Grading Modal */}
      {selectedAssignmentForGrading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-base text-slate-900">Grade Assignment Submissions</h3>
                <p className="text-xs text-slate-500">{selectedAssignmentForGrading.title} • Max Marks: {selectedAssignmentForGrading.maxMarks}</p>
              </div>
              <button onClick={() => setSelectedAssignmentForGrading(null)} className="p-2 rounded-full hover:bg-slate-200 text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-bold">Learner: Rohan Mehta (alex.chen@lms.ai)</strong>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">SUBMITTED</span>
                </div>
                <p className="text-slate-600 bg-white p-3 rounded-lg border border-slate-200 font-mono text-[11px]">
                  Repository URL: https://github.com/alexchen/distributed-architecture-assignment<br/>
                  Documentation: Completed all unit tests and Docker compose orchestrations.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Award Marks (out of {selectedAssignmentForGrading.maxMarks})</label>
                    <input
                      type="number"
                      max={selectedAssignmentForGrading.maxMarks}
                      value={awardedMarks}
                      onChange={e => setAwardedMarks(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-200 text-slate-900 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Evaluator Feedback</label>
                    <input
                      type="text"
                      value={gradingFeedback}
                      onChange={e => setGradingFeedback(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleGradeSubmission('sub-1')}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                  >
                    Save Grade & Feedback
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setSelectedAssignmentForGrading(null)} className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
