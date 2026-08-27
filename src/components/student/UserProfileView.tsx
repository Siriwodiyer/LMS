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
  AlertCircle,
  Clock,
  Send,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const {
    currentUser,
    logoutUser,
    courses,
    assessmentHistory,
    reelsWatchedCount,
    isUserEligibleForMentor,
    mentorApplications,
    submitMentorApplication,
    resubmitMentorApplication,
    submitPlatformFeedback,
    adminSettings,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'progress' | 'courses' | 'eligibility' | 'settings' | 'privacy' | 'feedback'>('profile');

  // Mentor Application Form State
  const [appExpertise, setAppExpertise] = useState('Full Stack Software Engineering & Java');
  const [appSkills, setAppSkills] = useState('Java, Spring Boot, React, TypeScript, System Design');
  const [appExperience, setAppExperience] = useState('4 years in software engineering & mentoring');
  const [appBio, setAppBio] = useState('Passionate educator dedicated to creating intuitive, industry-grade learning reels and masterclass courses.');
  const [appPortfolio, setAppPortfolio] = useState('https://github.com/learner-portfolio');

  // Platform Feedback State
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackCategory, setFeedbackCategory] = useState('Learning Experience');
  const [feedbackComment, setFeedbackComment] = useState('');

  const enrolledCourses = courses.filter(c => currentUser.enrolledCourseIds.includes(c.id));
  const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const reelsCompleted = currentUser.reelsWatchedTotal || reelsWatchedCount || 3;
  const userAssessments = assessmentHistory.filter(h => h.userId === currentUser.id);
  const assessmentsCompleted = userAssessments.length;
  const averageScore = userAssessments.length > 0
    ? Math.round(userAssessments.reduce((acc, curr) => acc + curr.scorePercentage, 0) / userAssessments.length)
    : 85;

  const eligibility = isUserEligibleForMentor(currentUser.id);
  const existingApp = mentorApplications.find(a => a.userId === currentUser.id);

  const handleSubmitApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appExpertise.trim() || !appSkills.trim() || !appBio.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const skillsArray = appSkills.split(',').map(s => s.trim()).filter(Boolean);

    if (existingApp && existingApp.status === 'changes_requested') {
      resubmitMentorApplication(existingApp.id, {
        expertise: appExpertise.trim(),
        skills: skillsArray,
        experienceYears: Number(appExperience) || 3,
        bio: appBio.trim(),
        portfolioUrl: appPortfolio.trim()
      });
    } else {
      submitMentorApplication({
        userId: currentUser.id,
        applicantName: currentUser.name,
        applicantEmail: currentUser.email,
        expertise: appExpertise.trim(),
        skills: skillsArray,
        experienceYears: Number(appExperience) || 3,
        bio: appBio.trim(),
        portfolioUrl: appPortfolio.trim(),
        assessmentsCompleted: assessmentsCompleted,
        averageScore: averageScore
      });
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment.trim()) {
      showToast('Please enter your feedback comment.', 'error');
      return;
    }
    submitPlatformFeedback({
      rating: feedbackRating,
      category: feedbackCategory,
      comment: feedbackComment
    });
    setFeedbackComment('');
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
              <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${
                currentUser.role === 'mentor'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {currentUser.role === 'mentor' ? 'Verified Mentor' : 'Learner'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{currentUser.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center min-w-[90px]">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Points</span>
            <strong className="text-blue-600 font-bold text-base">{currentUser.points}</strong>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center min-w-[90px]">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">XP Level</span>
            <strong className="text-amber-600 font-bold text-base">Lvl {currentUser.level}</strong>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center min-w-[90px]">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Avg Score</span>
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
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'profile' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <User size={15} />
            <span>My Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'progress' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <TrendingUp size={15} />
            <span>Learning Statistics</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'courses' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <BookOpen size={15} />
            <span>My Enrolled Courses</span>
          </button>

          <button
            onClick={() => setActiveTab('eligibility')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'eligibility' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <UserCheck size={15} />
              <span>Mentor Eligibility</span>
            </div>
            {eligibility.isEligible && (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'settings' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Settings size={15} />
            <span>Account Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'privacy' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Lock size={15} />
            <span>Privacy Controls</span>
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'feedback' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <MessageSquare size={15} />
            <span>Platform Feedback</span>
          </button>

          <div className="pt-2 border-t border-slate-100 mt-2">
            <button
              onClick={logoutUser}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="md:col-span-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          {/* 1. PROFILE TAB */}
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
                  <strong className="text-slate-900 text-sm block mt-0.5">
                    {currentUser.role === 'mentor' ? 'Verified Mentor' : 'Learner (Student)'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Account Status</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold mt-1">
                    <CheckCircle2 size={12} />
                    <span>Active & Verified</span>
                  </span>
                </div>
              </div>

              {currentUser.role === 'mentor' && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <Sparkles size={16} />
                    <span>Mentor Teaching Privileges Active</span>
                  </div>
                  <p className="text-emerald-700">
                    You have verified mentor credentials. You can publish educational courses and earn dynamic revenue from student enrollments.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 2. PROGRESS TAB */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Learning Statistics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-xs block">Reels Watched</span>
                  <strong className="text-slate-900 font-mono text-2xl block mt-1">{reelsCompleted}</strong>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-xs block">Assessments Passed</span>
                  <strong className="text-slate-900 font-mono text-2xl block mt-1">{assessmentsCompleted}</strong>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-xs block">Avg Assessment Score</span>
                  <strong className="text-blue-600 font-mono text-2xl block mt-1">{averageScore}%</strong>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Assessment Milestone History</h3>
                {userAssessments.length === 0 ? (
                  <p className="text-xs text-slate-500">No assessment records yet. Complete 5 reels to take your first micro-assessment.</p>
                ) : (
                  <div className="space-y-2">
                    {userAssessments.map(item => (
                      <div key={item.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 size={16} className={item.passed ? 'text-emerald-600' : 'text-amber-600'} />
                          <div>
                            <p className="font-bold text-slate-900">
                              5-Reel Assessment ({item.correctCount}/{item.totalQuestions} correct)
                            </p>
                            <p className="text-[11px] text-slate-500">
                              Completed on {new Date(item.completedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                          item.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {item.scorePercentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. COURSES TAB */}
          {activeTab === 'courses' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Enrolled Masterclass Courses</h2>
              <div className="space-y-3">
                {enrolledCourses.length === 0 ? (
                  <p className="text-xs text-slate-500">No courses enrolled yet. Browse the course catalog to enroll.</p>
                ) : (
                  enrolledCourses.map(course => (
                    <div key={course.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <img src={course.thumbnailUrl} alt={course.title} className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0" />
                        <div>
                          <strong className="text-xs font-bold text-slate-900 block">{course.title}</strong>
                          <span className="text-[11px] text-slate-500">{course.instructorName || 'Verified Mentor'}</span>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="w-24 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${course.progressPercent || 0}%` }} />
                            </div>
                            <span className="text-[10px] font-mono font-bold text-blue-700">{course.progressPercent || 0}%</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 self-start sm:self-auto">
                        In Progress
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 4. MENTOR ELIGIBILITY & APPLICATION TAB */}
          {activeTab === 'eligibility' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Mentor Qualification & Application</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Earned path to become a verified course instructor</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  currentUser.role === 'mentor'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : existingApp?.status === 'approved'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : existingApp?.status === 'submitted'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : existingApp?.status === 'changes_requested'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : eligibility.isEligible
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {currentUser.role === 'mentor'
                    ? 'Active Mentor'
                    : existingApp?.status === 'submitted'
                    ? 'Application In Review'
                    : existingApp?.status === 'changes_requested'
                    ? 'Changes Requested'
                    : eligibility.isEligible
                    ? 'Eligible to Apply'
                    : 'Prerequisites In Progress'}
                </span>
              </div>

              {/* Live Eligibility Criteria Progress */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Prerequisite Milestones</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={15} className={assessmentsCompleted >= adminSettings.mentorEligibilityMinAssessments ? 'text-emerald-600' : 'text-slate-400'} />
                      <span className="text-slate-700">Passed Micro-Assessments</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">
                      {assessmentsCompleted} / {adminSettings.mentorEligibilityMinAssessments} (Target: ≥{adminSettings.mentorEligibilityMinAssessments})
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={15} className={averageScore >= adminSettings.mentorEligibilityAvgScore ? 'text-emerald-600' : 'text-slate-400'} />
                      <span className="text-slate-700">Average Assessment Score</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">
                      {averageScore}% (Target: ≥{adminSettings.mentorEligibilityAvgScore}%)
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {eligibility.reason}
                </p>
              </div>

              {/* Status Alert if already submitted / under review */}
              {existingApp && existingApp.status === 'submitted' && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
                  <Clock size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-900">
                    <p className="font-bold">Mentor Application Under Review</p>
                    <p className="text-blue-700 mt-0.5">
                      Your application was submitted on {new Date(existingApp.submissionDate).toLocaleString()}. The platform Administrator is currently vetting your credentials.
                    </p>
                  </div>
                </div>
              )}

              {existingApp && existingApp.status === 'changes_requested' && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                  <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900">
                    <p className="font-bold">Administrator Feedback (Changes Requested):</p>
                    <p className="text-amber-800 mt-1 italic bg-white/70 p-2.5 rounded border border-amber-200">
                      "{existingApp.adminFeedback}"
                    </p>
                    <p className="text-amber-700 mt-1">Please update your application details below and click Resubmit.</p>
                  </div>
                </div>
              )}

              {/* Application Form */}
              {(eligibility.isEligible || (existingApp && existingApp.status === 'changes_requested')) && existingApp?.status !== 'submitted' && currentUser.role !== 'mentor' && (
                <form onSubmit={handleSubmitApp} className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {existingApp ? 'Update Mentor Application' : 'Submit Mentor Application'}
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Subject Expertise Domain *</label>
                    <input
                      type="text"
                      required
                      value={appExpertise}
                      onChange={e => setAppExpertise(e.target.value)}
                      placeholder="e.g. Distributed Systems & Java"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Key Technical Skills (comma-separated) *</label>
                    <input
                      type="text"
                      required
                      value={appSkills}
                      onChange={e => setAppSkills(e.target.value)}
                      placeholder="Java, Spring Boot, React, AWS, Docker"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Experience & Background *</label>
                    <input
                      type="text"
                      required
                      value={appExperience}
                      onChange={e => setAppExperience(e.target.value)}
                      placeholder="e.g. 4+ years as Senior Software Engineer & Technical Speaker"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Teaching Bio & Course Proposal *</label>
                    <textarea
                      required
                      rows={3}
                      value={appBio}
                      onChange={e => setAppBio(e.target.value)}
                      placeholder="Describe what masterclasses you plan to build for learners..."
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Portfolio or GitHub URL</label>
                    <input
                      type="url"
                      value={appPortfolio}
                      onChange={e => setAppPortfolio(e.target.value)}
                      placeholder="https://github.com/your-profile"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={14} />
                    <span>{existingApp ? 'Resubmit Application for Admin Review' : 'Submit Mentor Application'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 5. SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-4 text-xs text-slate-600">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Account Preferences</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600" />
                  <span>Email notifications for micro-assessment milestones and rewards</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600" />
                  <span>Course announcement digests</span>
                </label>
              </div>
            </div>
          )}

          {/* 6. PRIVACY TAB */}
          {activeTab === 'privacy' && (
            <div className="space-y-4 text-xs text-slate-600">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Privacy & Governance</h2>
              <p>Your learning metrics, assessment scores, and vouchers are strictly encrypted and governed under LMS Platform Security Standards.</p>
            </div>
          )}

          {/* 7. FEEDBACK TAB */}
          {activeTab === 'feedback' && (
            <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs text-slate-600">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Share Platform Feedback</h2>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Feedback Category</label>
                <select
                  value={feedbackCategory}
                  onChange={e => setFeedbackCategory(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option>Learning Experience</option>
                  <option>Reels & Micro-Assessments</option>
                  <option>Mentor Qualification Process</option>
                  <option>Course Catalog & Enrolment</option>
                  <option>General Suggestion</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Rating (1 to 5 Stars)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className={`w-8 h-8 rounded-lg font-bold transition-all ${
                        feedbackRating >= star ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Feedback Comment *</label>
                <textarea
                  required
                  rows={4}
                  value={feedbackComment}
                  onChange={e => setFeedbackComment(e.target.value)}
                  placeholder="Share your thoughts or report an issue..."
                  className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 text-xs text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-2"
              >
                <Send size={14} />
                <span>Submit Feedback</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
