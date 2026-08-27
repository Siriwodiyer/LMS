import React from 'react';
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
  Lock,
  Unlock
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
  const {
    currentUser,
    courses,
    openAssessment,
    watchedLearnReelIds,
    isAssessmentUnlocked,
    assessmentHistory,
    isUserEligibleForMentor,
    mentorApplications,
    completedCourseReels
  } = useApp();

  const completedLearnCount = watchedLearnReelIds.length;
  const enrolledCoursesList = courses.filter(c => currentUser.enrolledCourseIds.includes(c.id));
  const activeCourse = enrolledCoursesList[0] || courses[0];

  const courseCompletedList = activeCourse ? (completedCourseReels[activeCourse.id] || []) : [];
  const activeCourseProgress = Math.round((courseCompletedList.length / 5) * 100);

  const eligibility = isUserEligibleForMentor(currentUser.id);
  const existingApp = mentorApplications.find(a => a.userId === currentUser.id);

  const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-20 animate-in fade-in duration-200">
      {/* 1. TOP SECTION: Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div
            onClick={onNavigateToProfile}
            className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-sm cursor-pointer hover:bg-blue-700 transition-colors shrink-0"
            title="View User Profile"
          >
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">User Dashboard</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-blue-50 text-blue-700 border-blue-200">
                {currentUser.role === 'mentor' ? 'Verified Mentor' : 'Learner'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-display mt-0.5">
              Welcome, {currentUser.name}!
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-lg">
              Track your 6 Learn reels progress, unlock micro-assessments, earn vouchers, and qualify for verified Mentor status.
            </p>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3">
          <div className="p-3 px-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Points / XP</span>
            <span className="text-sm font-black text-slate-900">{currentUser.points} pts</span>
          </div>
          <div className="p-3 px-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Daily Streak</span>
            <span className="text-sm font-black text-amber-600 flex items-center justify-center gap-1">
              <Flame size={14} className="fill-amber-500 text-amber-500" />
              {currentUser.streakDays} Days
            </span>
          </div>
        </div>
      </div>

      {/* 2. CORE WORKFLOW CARDS: 6 Learn Reels & Mentor Eligibility */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Card 1: 6 Learn Reels Progress (7 cols) */}
        <div className="md:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <PlaySquare size={18} />
                </div>
                <h2 className="text-sm font-bold text-slate-900">Learn Reels Progress</h2>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isAssessmentUnlocked ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700'
              }`}>
                {completedLearnCount} / 6 Reels Completed
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Complete all 6 vertical educational reels in the Learn dashboard to unlock the automated micro-assessment.
            </p>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full transition-all duration-300 ${isAssessmentUnlocked ? 'bg-emerald-500' : 'bg-blue-600'}`}
                style={{ width: `${Math.min(100, Math.round((completedLearnCount / 6) * 100))}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              {isAssessmentUnlocked
                ? 'Assessment Unlocked! Ready to take quiz.'
                : `${6 - completedLearnCount} reels remaining to unlock assessment.`}
            </span>

            {isAssessmentUnlocked ? (
              <button
                onClick={openAssessment}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Zap size={14} />
                <span>Start Assessment</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={onNavigateToReels}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <PlaySquare size={14} />
                <span>Continue Learning</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Card 2: Mentor Qualification Progress (5 cols) */}
        <div className="md:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <UserCheck size={18} />
                </div>
                <h2 className="text-sm font-bold text-slate-900">Mentor Qualification</h2>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                eligibility.isEligible
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {eligibility.isEligible ? 'Eligible ✓' : 'In Progress'}
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Requirements: Complete ≥3 assessments with ≥80% score each and ≥85% overall average.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mt-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Assessments Done:</span>
                <span className="font-bold text-slate-800">{eligibility.completedCount} / 3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Average Score:</span>
                <span className="font-bold text-slate-800">{eligibility.avgScore}% (Min: 85%)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-right">
            <button
              onClick={onNavigateToProfile}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{eligibility.isEligible ? 'Apply for Mentor Status' : 'View Requirements'}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. ACTIVE COURSE ENROLLMENT (5 REELS PROGRESS) */}
      {activeCourse && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Enrolled Course Progress (5 Reels)</h2>
            </div>
            <button
              onClick={onNavigateToCourses}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Browse All Courses</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={activeCourse.thumbnailUrl}
                alt={activeCourse.title}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {activeCourse.category} • 5 Vertical Reels
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{activeCourse.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Instructor: {activeCourse.instructorName}</p>
              </div>
            </div>

            <div className="sm:text-right space-y-2">
              <div className="text-xs font-bold text-slate-700">
                Progress: {courseCompletedList.length}/5 Reels ({activeCourseProgress}%)
              </div>
              <button
                onClick={onNavigateToCourses}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Continue Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
