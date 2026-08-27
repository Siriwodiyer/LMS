import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EnrolledStudent } from '../../types';
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  Award,
  Mail,
  MessageSquare,
  Clock,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Download,
  Send,
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export const MentorStudentsView: React.FC = () => {
  const { currentUser, courses, enrolledStudents, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [completionFilter, setCompletionFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  // Direct Message Modal state
  const [selectedStudentForMessage, setSelectedStudentForMessage] = useState<EnrolledStudent | null>(null);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');

  // Find courses owned by current mentor
  const mentorCourseIds = useMemo(() => {
    return courses
      .filter(c => c.instructorId === currentUser.id || currentUser.role === 'admin' || currentUser.role === 'mentor')
      .map(c => c.id);
  }, [courses, currentUser]);

  // Enrolled students in mentor's courses (or fallback to all mock students if none match)
  const mentorStudents = useMemo(() => {
    const matching = enrolledStudents.filter(s => mentorCourseIds.includes(s.courseId));
    return matching.length > 0 ? matching : enrolledStudents;
  }, [enrolledStudents, mentorCourseIds]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return mentorStudents.filter(student => {
      const matchesSearch =
        student.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCourse =
        selectedCourseFilter === 'all' || student.courseId === selectedCourseFilter;

      const matchesCompletion =
        completionFilter === 'all' ||
        (completionFilter === 'completed' && student.progressPercent >= 100) ||
        (completionFilter === 'in_progress' && student.progressPercent < 100);

      return matchesSearch && matchesCourse && matchesCompletion;
    });
  }, [mentorStudents, searchQuery, selectedCourseFilter, completionFilter]);

  // Aggregate stats
  const totalStudents = mentorStudents.length;
  const completedCount = mentorStudents.filter(s => s.progressPercent >= 100).length;
  const inProgressCount = mentorStudents.filter(s => s.progressPercent < 100).length;
  const avgProgress = totalStudents > 0 ? Math.round(mentorStudents.reduce((sum, s) => sum + s.progressPercent, 0) / totalStudents) : 0;
  const avgQuizScore = totalStudents > 0 ? Math.round(mentorStudents.reduce((sum, s) => sum + (s.quizAverage || 85), 0) / totalStudents) : 85;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageBody.trim() || !selectedStudentForMessage) return;

    showToast(`Feedback note sent directly to ${selectedStudentForMessage.userName}!`, 'success');
    setSelectedStudentForMessage(null);
    setMessageSubject('');
    setMessageBody('');
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Student Name,Email,Course,Progress %,Quiz Average,Enrolled Date,Last Active']
        .concat(
          filteredStudents.map(
            s =>
              `"${s.userName}","${s.userEmail}","${s.courseTitle}",${s.progressPercent}%,${s.quizAverage || 85}%,"${new Date(
                s.enrolledAt
              ).toLocaleDateString()}","${new Date(s.lastActive).toLocaleDateString()}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mentor_students_roster_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Student roster exported as CSV successfully.', 'info');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24 animate-in fade-in duration-200">
      {/* Top Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
              <Users size={13} /> Student Roster & Analytics
            </span>
            <span className="text-xs text-slate-500">• {totalStudents} Active Students</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-2">
            Enrolled Students Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Track student progress, monitor quiz scores, check certificate completions, and send direct guidance notes.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-2 border border-slate-200 transition-all shadow-sm shrink-0"
        >
          <Download size={15} />
          <span>Export Student CSV</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Learners</span>
          <strong className="text-2xl font-bold text-slate-900 font-mono block mt-1">{totalStudents}</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Across all courses</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">In Progress</span>
          <strong className="text-2xl font-bold text-blue-600 font-mono block mt-1">{inProgressCount}</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Active learning</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block">Completed</span>
          <strong className="text-2xl font-bold text-emerald-600 font-mono block mt-1">{completedCount}</strong>
          <span className="text-[10px] text-emerald-600 mt-0.5 block font-semibold">Certificates awarded</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider block">Avg Quiz Score</span>
          <strong className="text-2xl font-bold text-amber-600 font-mono block mt-1">{avgQuizScore}%</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Overall performance</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search student by name, email, or course..."
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

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Course filter */}
          <select
            value={selectedCourseFilter}
            onChange={e => setSelectedCourseFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.title.length > 30 ? c.title.substring(0, 30) + '...' : c.title}
              </option>
            ))}
          </select>

          {/* Completion status */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setCompletionFilter('all')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                completionFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setCompletionFilter('in_progress')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                completionFilter === 'in_progress' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setCompletionFilter('completed')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                completionFilter === 'completed' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Student List Table */}
      {filteredStudents.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Users size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-900">No students found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or course selection.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-4 font-bold">Student</th>
                <th className="p-4 font-bold">Course Enrolled</th>
                <th className="p-4 font-bold">Learning Progress</th>
                <th className="p-4 font-bold">Quiz Average</th>
                <th className="p-4 font-bold">Enrolled Date</th>
                <th className="p-4 font-bold">Last Active</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.map(student => {
                const isCompleted = student.progressPercent >= 100;
                const initials = student.userName
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase();

                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    {/* Student Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                          {initials}
                        </div>
                        <div>
                          <strong className="text-slate-900 block font-bold text-xs">{student.userName}</strong>
                          <span className="text-[11px] text-slate-500">{student.userEmail}</span>
                        </div>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="p-4 font-medium text-slate-800">
                      <div className="max-w-xs truncate" title={student.courseTitle}>
                        {student.courseTitle}
                      </div>
                    </td>

                    {/* Progress Bar */}
                    <td className="p-4">
                      <div className="w-36 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-900 font-mono">{student.progressPercent}%</span>
                          {isCompleted && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              Completed
                            </span>
                          )}
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isCompleted
                                ? 'bg-emerald-600'
                                : student.progressPercent > 50
                                ? 'bg-blue-600'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(student.progressPercent, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Quiz Average */}
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 font-mono font-bold text-xs">
                        {student.quizAverage || 88}%
                      </span>
                    </td>

                    {/* Enrolled Date */}
                    <td className="p-4 text-slate-500 font-mono text-[11px]">
                      {new Date(student.enrolledAt).toLocaleDateString()}
                    </td>

                    {/* Last Active */}
                    <td className="p-4 text-slate-500 font-mono text-[11px]">
                      {new Date(student.lastActive).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedStudentForMessage(student);
                          setMessageSubject(`Feedback on ${student.courseTitle}`);
                          setMessageBody(`Hi ${student.userName.split(' ')[0]},\n\nGreat work progressing through the course! I wanted to check in and see how you are finding the modules.`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs inline-flex items-center gap-1.5 border border-emerald-200 transition-all shadow-sm"
                      >
                        <MessageSquare size={13} />
                        <span>Message</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Direct Feedback / Message Modal */}
      {selectedStudentForMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Message Student</h3>
                  <p className="text-xs text-slate-500">To: {selectedStudentForMessage.userName} ({selectedStudentForMessage.userEmail})</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudentForMessage(null)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={messageSubject}
                  onChange={e => setMessageSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Message Content</label>
                <textarea
                  rows={5}
                  required
                  value={messageBody}
                  onChange={e => setMessageBody(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs text-slate-900 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForMessage(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Send size={14} />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
