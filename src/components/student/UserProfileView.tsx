import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  BookOpen,
  Award,
  CheckSquare,
  ShieldCheck,
  Settings,
  Lock,
  MessageSquare,
  LogOut,
  UserCheck,
  TrendingUp,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const { currentUser, logoutUser, courses, assessmentHistory, reelsWatchedCount, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'progress' | 'courses' | 'eligibility' | 'settings' | 'privacy' | 'feedback'>('profile');
  const [mentorSubmitted, setMentorSubmitted] = useState(false);

  const enrolledCourses = courses.filter(c => currentUser.enrolledCourseIds.includes(c.id));
  const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const reelsCompleted = currentUser.reelsWatchedTotal || reelsWatchedCount || 3;
  const assessmentsCompleted = assessmentHistory.length || 2;
  const averageScore = assessmentHistory.length > 0
    ? Math.round(assessmentHistory.reduce((acc, curr) => acc + curr.scorePercentage, 0) / assessmentHistory.length)
    : 85;

  const isMentorEligible = reelsCompleted >= 3 && assessmentsCompleted >= 1;

  const handleApplyForMentor = () => {
    setMentorSubmitted(true);
    showToast('Mentor access application submitted for Admin review!', 'success');
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pb-20 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-sm shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 font-display">{currentUser.name}</h1>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                Learner
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{currentUser.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <span className="text-slate-500 block text-[10px]">Points</span>
            <strong className="text-blue-600 font-bold text-base">{currentUser.points}</strong>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <span className="text-slate-500 block text-[10px]">Avg Score</span>
            <strong className="text-emerald-600 font-bold text-base">{averageScore}%</strong>
          </div>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Profile Sidebar Menu */}
        <div className="md:col-span-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'profile' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <User size={15} />
            <span>My Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'progress' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <TrendingUp size={15} />
            <span>My Progress</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'courses' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <BookOpen size={15} />
            <span>My Courses</span>
          </button>

          <button
            onClick={() => setActiveTab('eligibility')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'eligibility' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <UserCheck size={15} />
            <span>Mentor Eligibility</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'settings' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Settings size={15} />
            <span>Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'privacy' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Lock size={15} />
            <span>Privacy</span>
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'feedback' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <MessageSquare size={15} />
            <span>Feedback</span>
          </button>

          <div className="pt-2 border-t border-slate-100 mt-2">
            <button
              onClick={logoutUser}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="md:col-span-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Personal Profile</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Full Name</span>
                  <strong className="text-slate-900 text-sm block mt-0.5">{currentUser.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Email Address</span>
                  <strong className="text-slate-900 text-sm block mt-0.5">{currentUser.email}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Account Role</span>
                  <strong className="text-slate-900 text-sm block mt-0.5">Learner (Student)</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Registered Date</span>
                  <strong className="text-slate-900 text-sm block mt-0.5">August 2026</strong>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Learning Statistics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-xs block">Reels Completed</span>
                  <strong className="text-slate-900 font-mono text-xl block mt-1">{reelsCompleted}</strong>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-xs block">Assessments Passed</span>
                  <strong className="text-slate-900 font-mono text-xl block mt-1">{assessmentsCompleted}</strong>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-xs block">Average Assessment Score</span>
                  <strong className="text-blue-600 font-mono text-xl block mt-1">{averageScore}%</strong>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Enrolled Courses</h2>
              <div className="space-y-3">
                {enrolledCourses.map(course => (
                  <div key={course.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={course.thumbnailUrl} alt={course.title} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                      <div>
                        <strong className="text-xs font-bold text-slate-900 block">{course.title}</strong>
                        <span className="text-[11px] text-slate-500">{course.instructorName || 'Dr. Meera Iyer'}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-blue-600">{course.progressPercent || 68}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'eligibility' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Mentor Eligibility Status</h2>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Current Status:</span>
                  <span className={`font-bold px-2 py-0.5 rounded ${
                    isMentorEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {mentorSubmitted ? 'Pending Admin Review' : isMentorEligible ? 'Eligible' : 'In Progress'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isMentorEligible
                    ? 'Congratulations! You meet all prerequisite criteria to apply for a Mentor role on LMS.'
                    : 'To become eligible for Mentor Status, complete 3 educational reels and pass 1 assessment.'}
                </p>

                {isMentorEligible && !mentorSubmitted && (
                  <button
                    onClick={handleApplyForMentor}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    Apply for Mentor Access
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4 text-xs text-slate-600">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Account Settings</h2>
              <p>Manage notification preferences and display options.</p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4 text-xs text-slate-600">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Privacy Controls</h2>
              <p>Your profile data is kept strictly secure according to platform policy.</p>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-4 text-xs text-slate-600">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Platform Feedback</h2>
              <textarea
                placeholder="Share your feedback or suggestions with our team..."
                className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 text-xs"
                rows={4}
              />
              <button
                onClick={() => showToast('Thank you! Your feedback has been sent.', 'success')}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
              >
                Submit Feedback
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
