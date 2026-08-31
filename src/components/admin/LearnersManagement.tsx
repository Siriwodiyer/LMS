import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Award,
  BookOpen,
  Clock,
  TrendingUp,
  Download,
  X,
  ChevronRight
} from 'lucide-react';

interface LearnersManagementProps {
  onViewLearner: (userId: string) => void;
  onViewMentor: (userId: string) => void;
}

export const LearnersManagement: React.FC<LearnersManagementProps> = ({
  onViewLearner
}) => {
  const { users, toggleUserStatus, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'quiz' | 'hours' | 'courses'>('name');

  // Filter only learners
  const learners = useMemo(() => {
    return users.filter(
      u => u.role === 'student' || u.role === 'learner' || u.role === 'ROLE_LEARNER'
    );
  }, [users]);

  // Filtered & sorted learners
  const filteredLearners = useMemo(() => {
    return learners
      .filter(learner => {
        const matchesSearch =
          learner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          learner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (learner.assignedMentorName && learner.assignedMentorName.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus =
          statusFilter === 'all' || learner.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'quiz') return (b.quizAverage || 0) - (a.quizAverage || 0);
        if (sortBy === 'hours') return (b.totalLearningHours || 0) - (a.totalLearningHours || 0);
        if (sortBy === 'courses') return (b.enrolledCourseIds?.length || 0) - (a.enrolledCourseIds?.length || 0);
        return a.name.localeCompare(b.name);
      });
  }, [learners, searchQuery, statusFilter, sortBy]);

  // Aggregate Metrics
  const totalLearners = learners.length;
  const activeLearners = learners.filter(l => l.status === 'active').length;
  const avgQuizAccuracy =
    totalLearners > 0
      ? Math.round(learners.reduce((sum, l) => sum + (l.quizAverage || 85), 0) / totalLearners)
      : 85;

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Learner Name,Email,Status,Assigned Mentor,Enrolled Courses,Quiz Accuracy %,Study Hours,Badges Earned']
        .concat(
          filteredLearners.map(
            l =>
              `"${l.name}","${l.email}","${l.status}","${l.assignedMentorName || 'None'}",${l.enrolledCourseIds?.length || 0},${l.quizAverage || 85}%,${l.totalLearningHours || 0},${l.badges?.length || 0}`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `learners_roster_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Learners roster exported successfully.', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Top Page Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Student Body</span>
            <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-semibold border border-blue-200 dark:border-blue-800">
              Active Roster
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display mt-1">Learners Directory</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            Inspect learner milestones, monitor quiz assessment telemetry, and manage student account statuses.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-200 dark:border-slate-700 shadow-xs transition-all self-start md:self-auto cursor-pointer"
        >
          <Download size={15} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">Total Registered Learners</span>
          <strong className="text-2xl font-bold text-slate-900 dark:text-white font-mono block mt-1">{totalLearners}</strong>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 block">{activeLearners} Active Students</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">Average Quiz Accuracy</span>
          <strong className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono block mt-1">{avgQuizAccuracy}%</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Across all reels & milestone quizzes</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">Learning Activity</span>
          <strong className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono block mt-1">100%</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Platform operational</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search learners by name or email..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All ({learners.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800'
            }`}
          >
            Active ({activeLearners})
          </button>
        </div>
      </div>

      {/* Learners Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Learner</th>
                <th className="p-4">Status</th>
                <th className="p-4">Courses Enrolled</th>
                <th className="p-4">Quiz Score</th>
                <th className="p-4">Badges</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLearners.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No learners match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLearners.map(learner => (
                  <tr key={learner.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
                        {learner.name.charAt(0)}
                      </div>
                      <div>
                        <strong className="text-slate-900 dark:text-white font-bold block">{learner.name}</strong>
                        <span className="text-[11px] text-slate-400">{learner.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleUserStatus(learner.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border cursor-pointer ${
                          learner.status === 'active'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        {learner.status === 'active' ? 'Active' : 'Suspended'}
                      </button>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{learner.enrolledCourseIds?.length || 0} Courses</span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{learner.quizAverage || 85}%</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-amber-600 dark:text-amber-400">{learner.badges?.length || 0} Badges</span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onViewLearner(learner.id)}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Inspect</span>
                        <ChevronRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
