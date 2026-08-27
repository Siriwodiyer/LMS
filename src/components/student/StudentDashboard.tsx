import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Flame,
  Award,
  PlaySquare,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Clock,
  TrendingUp,
  Zap,
  Target,
  BarChart2,
  ChevronRight,
  UserCheck,
  Bell,
  CheckSquare,
  Gift,
  HelpCircle
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigateToReels: () => void;
  onNavigateToCourses: () => void;
  onNavigateToRewards: () => void;
  onNavigateToAssessments?: () => void;
  onNavigateToProfile?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigateToReels,
  onNavigateToCourses,
  onNavigateToRewards,
  onNavigateToAssessments,
  onNavigateToProfile,
}) => {
  const { currentUser, reels, courses, openAssessment, reelsWatchedCount, adminSettings, assessmentHistory, showToast } = useApp();

  const [mentorApplicationSubmitted, setMentorApplicationSubmitted] = useState(false);

  // Active enrolled courses
  const enrolledCoursesList = courses.filter(c => currentUser.enrolledCourseIds.includes(c.id));
  const activeCourse = enrolledCoursesList[0] || courses[0];

  const reelsCompletedTotal = currentUser.reelsWatchedTotal || reelsWatchedCount || 3;
  const assessmentsCompletedTotal = assessmentHistory.length || 2;
  const currentProgressPercent = activeCourse?.progressPercent || 68;

  // Reels needed for next assessment
  const reelsRemaining = Math.max(0, adminSettings.reelsPerAssessment - reelsWatchedCount);

  // Mentor eligibility logic
  const isMentorEligible = reelsCompletedTotal >= 3 && assessmentsCompletedTotal >= 1;
  const mentorStatus = mentorApplicationSubmitted
    ? 'Application Pending Review'
    : isMentorEligible
    ? 'Eligible'
    : 'Progressing';

  const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const handleApplyMentor = () => {
    setMentorApplicationSubmitted(true);
    showToast('Your Mentor Eligibility application has been submitted to Admin for approval!', 'success');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pb-20 animate-in fade-in duration-200">
      {/* 1. TOP SECTION: Welcome Banner (Clean White with Accent) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div
            onClick={onNavigateToProfile}
            className="w-16 h-16 rounded-xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-sm cursor-pointer hover:bg-blue-700 transition-colors shrink-0"
            title="View User Profile"
          >
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">User Dashboard</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-200">
                Learner
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-display">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Track your learning progress, completed reels, assessment milestones, and rewards.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToReels}
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <PlaySquare size={15} />
            <span>Continue Learning</span>
          </button>
          <button
            onClick={onNavigateToRewards}
            className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 border border-slate-200 transition-all"
          >
            <Award size={15} className="text-amber-600" />
            <span>Rewards ({currentUser.points} pts)</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN DASHBOARD SECTIONS: 3 Column Stats & Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Learning Progress Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-600" />
              Learning Progress
            </h3>
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {currentProgressPercent}% Overall
            </span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Reels Completed:</span>
              <strong className="text-slate-900 font-mono">{reelsCompletedTotal} Reels</strong>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Assessments Completed:</span>
              <strong className="text-slate-900 font-mono">{assessmentsCompletedTotal} Passed</strong>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Active Course Progress:</span>
              <strong className="text-slate-900 font-mono">{currentProgressPercent}%</strong>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mt-2">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${currentProgressPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Assessment Status Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare size={18} className="text-teal-600" />
              Assessment Status
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              reelsRemaining === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {reelsRemaining === 0 ? 'Unlocked' : 'In Progress'}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {reelsRemaining > 0
              ? `Complete ${reelsRemaining} more reel${reelsRemaining > 1 ? 's' : ''} to unlock your next automated assessment.`
              : 'You have completed the required reels! Your assessment is ready to take.'}
          </p>

          <button
            onClick={openAssessment}
            className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              reelsRemaining === 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            <Zap size={14} />
            <span>{reelsRemaining === 0 ? 'Take Assessment Now' : `Progress (${reelsWatchedCount}/${adminSettings.reelsPerAssessment})`}</span>
          </button>
        </div>

        {/* Rewards Summary Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award size={18} className="text-amber-600" />
              Rewards & Points
            </h3>
            <button onClick={onNavigateToRewards} className="text-xs font-bold text-blue-600 hover:underline">
              View All
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-600">Points Earned:</span>
            <span className="font-mono font-bold text-amber-600 text-sm">{currentUser.points} Points</span>
          </div>

          {currentUser.badges[0] && (
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className="text-xl">{currentUser.badges[0].icon}</span>
              <div>
                <strong className="text-slate-900 block">{currentUser.badges[0].title}</strong>
                <span className="text-[10px] text-slate-500">{currentUser.badges[0].description}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. CONTINUE LEARNING & MENTOR ELIGIBILITY ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Continue Learning Section (7 Cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen size={18} className="text-blue-600" />
                Continue Learning
              </h3>
              <p className="text-xs text-slate-500">Currently active course module</p>
            </div>
            <button onClick={onNavigateToCourses} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              <span>Browse All Courses</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {activeCourse ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={activeCourse.thumbnailUrl}
                  alt={activeCourse.title}
                  className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{activeCourse.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{activeCourse.instructorName || 'Dr. Meera Iyer'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-28 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${activeCourse.progressPercent || 68}%` }} />
                    </div>
                    <span className="text-[11px] font-mono text-blue-700 font-semibold">{activeCourse.progressPercent || 68}%</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onNavigateToCourses}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-sm"
              >
                <span>Resume Lesson</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No active course found.</p>
          )}
        </div>

        {/* Mentor Eligibility Card (4 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck size={18} className="text-emerald-600" />
              Mentor Eligibility
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              isMentorEligible
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {mentorStatus}
            </span>
          </div>

          <div className="text-xs text-slate-600 space-y-2">
            <p>Requirements to apply for Mentor Status:</p>
            <ul className="space-y-1.5 text-[11px]">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className={reelsCompletedTotal >= 3 ? 'text-emerald-600' : 'text-slate-400'} />
                <span>Complete at least 3 Educational Reels</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className={assessmentsCompletedTotal >= 1 ? 'text-emerald-600' : 'text-slate-400'} />
                <span>Pass at least 1 Assessment</span>
              </li>
            </ul>
          </div>

          {isMentorEligible && !mentorApplicationSubmitted && (
            <button
              onClick={handleApplyMentor}
              className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <UserCheck size={14} />
              <span>Apply for Mentor Access</span>
            </button>
          )}

          {mentorApplicationSubmitted && (
            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-[11px] text-blue-800 font-medium text-center">
              Application submitted! Admin will review your profile.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

