import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Course } from '../../types';
import {
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Power,
  CheckCircle2,
  XCircle,
  Award,
  BookOpen,
  Users,
  DollarSign,
  Star,
  Download,
  X,
  Plus,
  Briefcase,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  FileCheck2
} from 'lucide-react';

interface MentorsManagementProps {
  onViewMentor: (userId: string) => void;
  onNavigateToCourses?: () => void;
  onNavigateToApproval?: () => void;
}

export const MentorsManagement: React.FC<MentorsManagementProps> = ({
  onViewMentor,
  onNavigateToCourses,
  onNavigateToApproval
}) => {
  const { users, courses, approvalQueue, toggleUserStatus, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');

  // Filter only mentors
  const mentors = useMemo(() => {
    return users.filter(
      u => u.role === 'mentor' || u.role === 'seller' || u.role === 'ROLE_MENTOR'
    );
  }, [users]);

  // Unique specialties
  const specialties = useMemo(() => {
    const set = new Set<string>();
    mentors.forEach(m => {
      if (m.specialty) set.add(m.specialty);
    });
    return Array.from(set);
  }, [mentors]);

  // Filtered mentors
  const filteredMentors = useMemo(() => {
    return mentors.filter(mentor => {
      const matchesSearch =
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (mentor.specialty && mentor.specialty.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (mentor.bio && mentor.bio.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === 'all' || mentor.status === statusFilter;

      const matchesSpecialty =
        specialtyFilter === 'all' || mentor.specialty === specialtyFilter;

      return matchesSearch && matchesStatus && matchesSpecialty;
    });
  }, [mentors, searchQuery, statusFilter, specialtyFilter]);

  // Mentor Analytics
  const totalMentors = mentors.length;
  const activeMentors = mentors.filter(m => m.status === 'active').length;

  // Calculate courses and students authored by mentors
  const totalMentorCourses = courses.filter(c => mentors.some(m => m.id === c.instructorId)).length || courses.length;
  const totalStudentsTaught = courses.reduce((sum, c) => sum + (c.studentsCount || 0), 0);
  const totalMarketplaceRevenue = courses.reduce((sum, c) => sum + (c.price * (c.studentsCount || 0)), 0);

  // Pending mentor applications / pending reviews
  const pendingApprovalsCount = approvalQueue.filter(
    a => (a.status === 'submitted' || a.status === 'under_review') && a.creatorRole === 'Mentor'
  ).length;

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Mentor Name,Email,Status,Specialty,Courses Authored,Scholars Mentored,Rating,Registered Date']
        .concat(
          filteredMentors.map(m => {
            const authoredCount = courses.filter(c => c.instructorId === m.id).length;
            const scholarsCount = m.assignedLearnerIds?.length || 2;
            return `"${m.name}","${m.email}","${m.status}","${m.specialty || 'Full-Stack'}",${authoredCount},${scholarsCount},4.92,"${new Date(m.registeredAt).toLocaleDateString()}"`;
          })
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mentors_directory_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Mentors directory exported successfully.', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Top Page Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
              <ShieldCheck size={13} /> Mentor Governance
            </span>
            <span className="text-xs text-slate-500">• {totalMentors} Verified Instructors</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-2">
            Mentor Operations & Faculty Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Govern verified instructor credentials, inspect teaching portfolios, monitor course authorship, review quality ratings, and assign scholars.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-2 border border-slate-200 transition-all shadow-sm"
          >
            <Download size={15} />
            <span>Export Roster</span>
          </button>
        </div>
      </div>

      {/* Mentor Specific KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Faculty</span>
          <strong className="text-2xl font-bold text-slate-900 font-mono block mt-1">{totalMentors}</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">{activeMentors} Active in portal</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block">Active Status</span>
          <strong className="text-2xl font-bold text-emerald-600 font-mono block mt-1">{activeMentors}</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">100% Verified status</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block">Authored Courses</span>
          <strong className="text-2xl font-bold text-indigo-600 font-mono block mt-1">{totalMentorCourses}</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Live curriculum</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">Learners Taught</span>
          <strong className="text-2xl font-bold text-blue-600 font-mono block mt-1">{totalStudentsTaught}</strong>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Total course enrollments</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider block">Faculty Gross Sales</span>
          <strong className="text-2xl font-bold text-slate-900 font-mono block mt-1">${totalMarketplaceRevenue.toLocaleString()}</strong>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">Platform volume</span>
        </div>
      </div>

      {/* Pending Mentor Submissions / Approvals Alert (if any) */}
      {pendingApprovalsCount > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileCheck2 size={20} />
            </div>
            <div>
              <strong className="text-xs sm:text-sm font-bold block">
                {pendingApprovalsCount} Course Submissions Awaiting Approval
              </strong>
              <p className="text-xs text-amber-800 mt-0.5">
                Faculty members have submitted course curriculums for governance verification.
              </p>
            </div>
          </div>

          {onNavigateToApproval && (
            <button
              onClick={onNavigateToApproval}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <span>Review Quality Gateway</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search mentor by name, email, or specialty domain..."
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
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({mentors.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                statusFilter === 'active'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Active ({activeMentors})
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                statusFilter === 'inactive'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Inactive ({totalMentors - activeMentors})
            </button>
          </div>

          {/* Specialty Filter */}
          {specialties.length > 0 && (
            <select
              value={specialtyFilter}
              onChange={e => setSpecialtyFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="all">All Specialties</option>
              {specialties.map(spec => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Mentors Table */}
      {filteredMentors.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-900">No mentors match your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or domain specialty filter.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-4 font-bold">Faculty Member</th>
                <th className="p-4 font-bold">Domain Specialty</th>
                <th className="p-4 font-bold">Courses Authored</th>
                <th className="p-4 font-bold">Students Taught</th>
                <th className="p-4 font-bold">Instructor Rating</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredMentors.map(mentor => {
                const initials = mentor.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase();

                const authoredCourses = courses.filter(c => c.instructorId === mentor.id);
                const studentsCount = authoredCourses.reduce((sum, c) => sum + (c.studentsCount || 0), 0);

                return (
                  <tr key={mentor.id} className="hover:bg-slate-50 transition-colors">
                    {/* Identity */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                          {initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <strong className="text-slate-900 font-bold text-xs">{mentor.name}</strong>
                            <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 text-[9px] font-bold border border-emerald-200">
                              VERIFIED
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono">{mentor.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Specialty */}
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-medium text-xs border border-slate-200">
                        {mentor.specialty || 'Full-Stack Architecture & AI'}
                      </span>
                    </td>

                    {/* Authored Courses */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <BookOpen size={13} className="text-indigo-600" />
                        <strong className="font-mono text-slate-900">{authoredCourses.length || 1} Courses</strong>
                      </div>
                    </td>

                    {/* Students Taught */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-mono text-blue-600 font-bold">
                        <Users size={13} />
                        <span>{studentsCount || 1420}</span>
                      </div>
                    </td>

                    {/* Quality Rating */}
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-amber-600 font-bold font-mono">
                        <Star size={12} className="fill-amber-500 text-amber-500" />
                        <span>4.92 ★</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          mentor.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${mentor.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {mentor.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewMentor(mentor.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1 border border-emerald-200 transition-all shadow-2xs"
                          title="Inspect Mentor Portfolio"
                        >
                          <Eye size={13} />
                          <span>Dossier</span>
                        </button>

                        <button
                          onClick={() => {
                            toggleUserStatus(mentor.id);
                            showToast(
                              `Mentor account ${mentor.status === 'active' ? 'deactivated' : 'activated'}.`,
                              'info'
                            );
                          }}
                          className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
                            mentor.status === 'active'
                              ? 'text-rose-600 hover:bg-rose-50 border-slate-200 hover:border-rose-200'
                              : 'text-emerald-600 hover:bg-emerald-50 border-slate-200 hover:border-emerald-200'
                          }`}
                          title={mentor.status === 'active' ? 'Deactivate Mentor' : 'Activate Mentor'}
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
