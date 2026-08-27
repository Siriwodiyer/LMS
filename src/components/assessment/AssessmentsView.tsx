import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  Award,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Sparkles,
  Lock,
  Unlock,
  PlaySquare,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface AssessmentsViewProps {
  setActiveTab?: (tab: string) => void;
}

export const AssessmentsView: React.FC<AssessmentsViewProps> = ({ setActiveTab }) => {
  const {
    assessmentHistory,
    watchedLearnReelIds,
    isAssessmentUnlocked,
    adminSettings,
    openAssessment
  } = useApp();

  const completedReelsCount = watchedLearnReelIds.length;
  const progressPercent = Math.min(100, Math.round((completedReelsCount / 6) * 100));

  const handleContinueLearning = () => {
    if (setActiveTab) {
      setActiveTab('learn');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-20 animate-in fade-in duration-200">
      {/* 1. STRICT LOCK STATE BANNER IF < 6 REELS */}
      {!isAssessmentUnlocked ? (
        <div className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200 shadow-sm text-center max-w-2xl mx-auto space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-xs">
            <Lock size={32} />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
              <span>LOCKED ASSESSMENT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              Assessment Locked 🔒
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Please complete all 6 Learn reels first. The micro-assessment unlocks automatically once all 6 vertical reels have been watched.
            </p>
          </div>

          {/* Progress Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-md mx-auto space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Progress:</span>
              <span className="font-mono text-blue-600">{completedReelsCount} / 6 Completed</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Direct CTA back to Learn */}
          <button
            onClick={handleContinueLearning}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs hover:shadow transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <PlaySquare size={16} />
            <span>Continue Learning</span>
            <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        /* 2. UNLOCKED ASSESSMENT HERO IF === 6 REELS */
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-emerald-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
              <Unlock size={28} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-1.5">
                <Sparkles size={12} />
                <span>UNLOCKED & READY</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                6-Reel Micro-Assessment
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg">
                You have completed all 6 Learn reels! Take the automated 6-question assessment to test your knowledge, earn points, get a 25% course voucher, and qualify for Mentor status.
              </p>
            </div>
          </div>

          <button
            onClick={openAssessment}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs hover:shadow flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer"
          >
            <Zap size={16} />
            <span>Start Assessment</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* 3. ASSESSMENT CRITERIA & REWARD EXPLANATION */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2 font-bold text-xs">
            6 Qs
          </div>
          <h3 className="text-xs font-bold text-slate-900">1 Question per Reel</h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Questions directly test key takeaways from Python, Java 21, Spring Boot, DSA, SQL, and Networking.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 font-bold text-xs">
            80%
          </div>
          <h3 className="text-xs font-bold text-slate-900">Passing Threshold</h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Score ≥ 80% to earn the Speed Learner certification, +200 XP bonus, and a 25% discount voucher.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2 font-bold text-xs">
            3x
          </div>
          <h3 className="text-xs font-bold text-slate-900">Mentor Qualification</h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Pass 3 assessments with ≥85% average to become eligible to apply for verified Mentor status.
          </p>
        </div>
      </div>

      {/* 4. PAST ASSESSMENT HISTORY */}
      <div className="space-y-4 pt-2">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <CheckSquare size={18} className="text-blue-600" />
          <span>Assessment History</span>
        </h2>

        {assessmentHistory.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-2">
            <Clock size={28} className="mx-auto text-slate-300" />
            <h3 className="text-xs font-bold text-slate-700">No Assessment Attempts Recorded Yet</h3>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Once you complete all 6 Learn reels and submit the assessment, your detailed scoring history will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {assessmentHistory.map(res => (
              <div
                key={res.id}
                className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                      res.passed ? 'bg-emerald-600' : 'bg-rose-600'
                    }`}
                  >
                    {res.scorePercentage}%
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">
                        6-Reel Micro-Assessment
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          res.passed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {res.passed ? 'PASSED ✓' : 'NEEDS RETAKE'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Scored {res.correctCount} / {res.totalQuestions} questions correct • +{res.rewardsEarned?.points || 0} XP awarded
                    </p>
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-400">
                  {new Date(res.completedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
