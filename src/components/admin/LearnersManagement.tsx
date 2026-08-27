import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import {
  GraduationCap,
  Search,
  Filter,
  Eye,
  Power,
  CheckCircle2,
  XCircle,
  Award,
  BookOpen,
  Clock,
  TrendingUp,
  UserCheck,
  Download,
  X,
  Mail,
  ShieldCheck
} from 'lucide-react';

interface LearnersManagementProps {
  onViewLearner: (userId: string) => void;
  onViewMentor: (userId: string) => void;
}

export const LearnersManagement: React.FC<LearnersManagementProps> = ({
  onViewLearner,
  onViewMentor
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
  const totalStudyHours = learners.reduce((sum, l) => sum + (l.totalLearningHours || 25), 0);

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
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 flex items-center gap-1">
              <GraduationCap size={13} /> Learner Directory
            </span>
            <span className="text-xs text-slate-500">• {totalLearners} Total Registered</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-2">
            Learner Management & Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Monitor student enrollment activity, inspect individual assessment performance, verify badge achievements, and manage account statuses.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-2 border border-slate-200 transition-all shadow-sm"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Learners</span>
          <strong className="text-2xl font-bold text-slate-900 font-mono block mt-1">{totalLearners}</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Registered accounts</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block">Active Status</span>
          <strong className="text-2xl font-bold text-emerald-600 font-mono block mt-1">{activeLearners}</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">{Math.round((activeLearners / (totalLearners || 1)) * 100)}% engagement</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">Avg Quiz Accuracy</span>
          <strong className="text-2xl font-bold text-blue-600 font-mono block mt-1">{avgQuizAccuracy}%</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Across assessments</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider block">Total Study Time</span>
          <strong className="text-2xl font-bold text-purple-600 font-mono block mt-1">{totalStudyHours.toFixed(1)} hrs</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Completed learning</span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search learner by name, email, or assigned mentor..."
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

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({learners.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                statusFilter === 'active'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Active ({activeLearners})
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                statusFilter === 'inactive'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Inactive ({totalLearners - activeLearners})
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="name">Sort by Name</option>
            <option value="quiz">Highest Quiz Score</option>
            <option value="hours">Most Study Hours</option>
            <option value="courses">Most Enrolled Courses</option>
          </select>
        </div>
      </div>

      {/* Learners Table */}
      {filteredLearners.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <GraduationCap size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-900">No learners found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or status filter.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-4 font-bold">Learner Info</th>
                <th className="p-4 font-bold">Assigned Mentor</th>
                <th className="p-4 font-bold">Enrolled Courses</th>
                <th className="p-4 font-bold">Quiz Accuracy</th>
                <th className="p-4 font-bold">Study Time</th>
                <th className="p-4 font-bold">Badges</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLearners.map(learner => {
                const initials = learner.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase();

                const quizScore = learner.quizAverage || 85;
                const quizScoreColor =
                  quizScore >= 90
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : quizScore >= 75
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-amber-100 text-amber-800 border-amber-200';

                return (
                  <tr key={learner.id} className="hover:bg-slate-50 transition-colors">
                    {/* Learner Identity */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                          {initials}
                        </div>
                        <div>
                          <strong className="text-slate-900 block font-bold text-xs">{learner.name}</strong>
                          <span className="text-[11px] text-slate-500 font-mono">{learner.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Assigned Mentor */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                        <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                        <span>{learner.assignedMentorName || 'Dr. Meera Iyer'}</span>
                      </div>
                    </td>

                    {/* Enrolled Courses */}
                    <td className="p-4 font-mono font-bold text-slate-900">
                      {learner.enrolledCourseIds?.length || 0} Courses
                    </td>

                    {/* Quiz Accuracy */}
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${quizScoreColor}`}>
                        {quizScore}%
                      </span>
                    </td>

                    {/* Study Hours */}
                    <td className="p-4 font-mono text-slate-800">
                      {learner.totalLearningHours || 32} hrs
                    </td>

                    {/* Badges Earned */}
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold font-mono">
                        <Award size={12} className="text-amber-600" />
                        <span>{learner.badges?.length || 2}</span>
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          learner.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${learner.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {learner.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewLearner(learner.id)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1 border border-blue-200 transition-all"
                          title="Inspect Learner Dossier"
                        >
                          <Eye size={13} />
                          <span>Dossier</span>
                        </button>

                        <button
                          onClick={() => {
                            toggleUserStatus(learner.id);
                            showToast(
                              `Learner account ${learner.status === 'active' ? 'deactivated' : 'activated'}.`,
                              'info'
                            );
                          }}
                          className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
                            learner.status === 'active'
                              ? 'text-rose-600 hover:bg-rose-50 border-slate-200 hover:border-rose-200'
                              : 'text-emerald-600 hover:bg-emerald-50 border-slate-200 hover:border-emerald-200'
                          }`}
                          title={learner.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                        >
                          <Power size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
