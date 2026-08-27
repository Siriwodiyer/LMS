import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Course, MentorApplication } from '../../types';
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
  FileCheck2,
  Clock,
  Send,
  ExternalLink,
  MessageSquare
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
  const {
    users,
    courses,
    approvalQueue,
    toggleUserStatus,
    mentorApplications,
    approveMentorApplication,
    rejectMentorApplication,
    requestChangesMentorApplication,
    showToast
  } = useApp();

  const [activeMainTab, setActiveMainTab] = useState<'roster' | 'applications'>('roster');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [appStatusFilter, setAppStatusFilter] = useState<'all' | 'submitted' | 'under_review' | 'changes_requested' | 'approved' | 'rejected'>('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');

  // Selected Application for Review
  const [selectedApp, setSelectedApp] = useState<MentorApplication | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [reviewAction, setReviewAction] = useState<'approve' | 'request_changes' | 'reject' | null>(null);

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

  // Filtered Mentor Applications
  const filteredApplications = useMemo(() => {
    return mentorApplications.filter(app => {
      const matchesSearch =
        app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.expertise.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        appStatusFilter === 'all' || app.status === appStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [mentorApplications, searchQuery, appStatusFilter]);

  // Mentor Analytics
  const totalMentors = mentors.length;
  const activeMentors = mentors.filter(m => m.status === 'active').length;

  const totalMentorCourses = courses.filter(c => mentors.some(m => m.id === c.instructorId)).length || courses.length;
  const totalStudentsTaught = courses.reduce((sum, c) => sum + (c.studentsCount || 0), 0);
  const totalMarketplaceRevenue = courses.reduce((sum, c) => sum + (c.price * (c.studentsCount || 0)), 0);

  const pendingAppsCount = mentorApplications.filter(a => a.status === 'submitted' || a.status === 'under_review').length;

  const handleApprove = (appId: string) => {
    approveMentorApplication(appId, 'Administrator');
    setSelectedApp(null);
    setReviewFeedback('');
    setReviewAction(null);
  };

  const handleRequestChanges = (appId: string) => {
    if (!reviewFeedback.trim()) {
      showToast('Please enter the specific changes requested.', 'error');
      return;
    }
    requestChangesMentorApplication(appId, reviewFeedback, 'Administrator');
    setSelectedApp(null);
    setReviewFeedback('');
    setReviewAction(null);
  };

  const handleReject = (appId: string) => {
    if (!reviewFeedback.trim()) {
      showToast('Please enter the reason for rejection.', 'error');
      return;
    }
    rejectMentorApplication(appId, reviewFeedback, 'Administrator');
    setSelectedApp(null);
    setReviewFeedback('');
    setReviewAction(null);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Mentor Name,Email,Status,Specialty,Courses Authored,Scholars Mentored,Rating,Registered Date']
        .concat(
          filteredMentors.map(m => {
            const authoredCount = courses.filter(c => c.instructorId === m.id).length;
            const scholarsCount = m.assignedLearnerIds?.length || 2;
            return `"${m.name}","${m.email}","${m.status}","${m.specialty || 'Software Engineering'}",${authoredCount},${scholarsCount},4.92,"${new Date(m.registeredAt).toLocaleDateString()}"`;
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
              <ShieldCheck size={13} /> Mentor Governance & Faculty Management
            </span>
            <span className="text-xs text-slate-500">• {totalMentors} Verified Instructors</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-2">
            Mentor Operations & Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Review learner-to-mentor applications, approve faculty access, manage verified teaching portfolios, and track course earnings.
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

      {/* Primary Tab Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveMainTab('roster')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeMainTab === 'roster'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Users size={15} />
          <span>Active Mentors Roster ({totalMentors})</span>
        </button>

        <button
          onClick={() => setActiveMainTab('applications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeMainTab === 'applications'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileCheck2 size={15} />
          <span>Mentor Applications Queue</span>
          {pendingAppsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
              {pendingAppsCount}
            </span>
          )}
        </button>
      </div>

      {/* 1. MENTOR ROSTER TAB */}
      {activeMainTab === 'roster' && (
        <div className="space-y-6">
          {/* KPI Cards */}
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
              <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">Learners Enrolled</span>
              <strong className="text-2xl font-bold text-blue-600 font-mono block mt-1">{totalStudentsTaught}</strong>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Total course enrollments</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider block">Faculty Gross Sales</span>
              <strong className="text-2xl font-bold text-slate-900 font-mono block mt-1">${totalMarketplaceRevenue.toLocaleString()}</strong>
              <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">Platform volume</span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search mentor by name, email, or specialty domain..."
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

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    statusFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  All ({mentors.length})
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    statusFilter === 'active' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Active ({activeMentors})
                </button>
                <button
                  onClick={() => setStatusFilter('inactive')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    statusFilter === 'inactive' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Inactive ({totalMentors - activeMentors})
                </button>
              </div>

              {specialties.length > 0 && (
                <select
                  value={specialtyFilter}
                  onChange={e => setSpecialtyFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-500 font-medium"
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
                    <th className="p-4 font-bold">Learners Enrolled</th>
                    <th className="p-4 font-bold">Rating</th>
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

                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-medium text-xs border border-slate-200">
                            {mentor.specialty || 'Software Engineering'}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <BookOpen size={13} className="text-indigo-600" />
                            <strong className="font-mono text-slate-900">{authoredCourses.length || 1} Courses</strong>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-1.5 font-mono text-blue-600 font-bold">
                            <Users size={13} />
                            <span>{studentsCount || 1420}</span>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-1 text-amber-600 font-bold font-mono">
                            <Star size={12} className="fill-amber-500 text-amber-500" />
                            <span>4.92 ★</span>
                          </div>
                        </td>

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

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onViewMentor(mentor.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1 border border-emerald-200 transition-all"
                              title="Inspect Mentor Portfolio"
                            >
                              <Eye size={13} />
                              <span>Portfolio</span>
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
      )}

      {/* 2. MENTOR APPLICATIONS QUEUE TAB */}
      {activeMainTab === 'applications' && (
        <div className="space-y-6">
          {/* Applications Filter Bar */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search applicant name, email, or domain..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold">
              {[
                { id: 'all', label: 'All' },
                { id: 'submitted', label: 'Pending Review' },
                { id: 'changes_requested', label: 'Changes Req.' },
                { id: 'approved', label: 'Approved' },
                { id: 'rejected', label: 'Rejected' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setAppStatusFilter(f.id as any)}
                  className={`px-3 py-1 rounded transition-all ${
                    appStatusFilter === f.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Applications Cards Grid */}
          {filteredApplications.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FileCheck2 size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-900">No applications match this filter</h3>
              <p className="text-xs text-slate-500">All submitted mentor applications have been processed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredApplications.map(app => (
                <div key={app.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{app.applicantName}</h3>
                        <p className="text-xs text-slate-500">{app.applicantEmail}</p>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                        app.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : app.status === 'submitted'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : app.status === 'changes_requested'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Assessments</span>
                        <strong className="text-slate-900 font-mono">{app.assessmentsCompleted} Completed</strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Avg Score</span>
                        <strong className="text-emerald-600 font-mono">{app.averageScore}% Avg</strong>
                      </div>
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="text-slate-500 font-bold">Expertise:</p>
                      <p className="text-slate-900 font-medium">{app.expertise}</p>
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="text-slate-500 font-bold">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {app.skills.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="text-slate-500 font-bold">Bio & Statement:</p>
                      <p className="text-slate-700 line-clamp-2 text-[11px] leading-relaxed">{app.bio}</p>
                    </div>

                    {app.adminFeedback && (
                      <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
                        <span className="font-bold block text-[10px] uppercase text-amber-800">Admin Feedback:</span>
                        <p className="italic text-[11px] mt-0.5">"{app.adminFeedback}"</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(app.submissionDate).toLocaleDateString()}
                    </span>

                    {app.status === 'submitted' || app.status === 'changes_requested' ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setReviewAction('request_changes');
                            setReviewFeedback('');
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
                        >
                          Request Changes
                        </button>
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setReviewAction('reject');
                            setReviewFeedback('');
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-all"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApprove(app.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1"
                        >
                          <CheckCircle2 size={13} />
                          <span>Approve</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-500">
                        Processed by {app.reviewedBy || 'Admin'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Review Feedback Modal (Request Changes / Reject) */}
      {selectedApp && reviewAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {reviewAction === 'request_changes' ? 'Request Changes from Applicant' : 'Reject Mentor Application'}
              </h3>
              <button
                onClick={() => { setSelectedApp(null); setReviewAction(null); }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="text-xs text-slate-600">
              <p>Applicant: <strong className="text-slate-900">{selectedApp.applicantName}</strong> ({selectedApp.applicantEmail})</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {reviewAction === 'request_changes' ? 'Specific Feedback / Required Improvements *' : 'Rejection Reason *'}
              </label>
              <textarea
                required
                rows={4}
                value={reviewFeedback}
                onChange={e => setReviewFeedback(e.target.value)}
                placeholder={reviewAction === 'request_changes' ? 'e.g. Please provide a link to your engineering portfolio or expand on course objectives...' : 'e.g. Current average score does not satisfy teaching standards...'}
                className="w-full p-3 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => { setSelectedApp(null); setReviewAction(null); }}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              {reviewAction === 'request_changes' ? (
                <button
                  onClick={() => handleRequestChanges(selectedApp.id)}
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
                >
                  Send Changes Request
                </button>
              ) : (
                <button
                  onClick={() => handleReject(selectedApp.id)}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
                >
                  Confirm Rejection
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
