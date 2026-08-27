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
  Sparkles
} from 'lucide-react';

export const AssessmentsView: React.FC = () => {
  const { assessmentHistory, reelsWatchedCount, adminSettings, openAssessment } = useApp();

  const reelsRemaining = Math.max(0, adminSettings.reelsPerAssessment - reelsWatchedCount);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pb-20 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Educational Assessments</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-display mt-1">Assessments & Results</h1>
          <p className="text-xs text-slate-600 mt-1">
            Complete educational reels to unlock micro-assessments and earn certificates & reward points.
          </p>
        </div>

        <button
          onClick={openAssessment}
          disabled={reelsRemaining > 0}
          className={`px-4 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 transition-all ${
            reelsRemaining === 0
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
          }`}
        >
          <Zap size={15} />
          <span>{reelsRemaining === 0 ? 'Start Assessment' : `Locked (${reelsWatchedCount}/${adminSettings.reelsPerAssessment} Reels)`}</span>
        </button>
      </div>

      {/* Assessment Flow Progress Diagram */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Assessment Workflow</h2>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs font-medium">
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800">
            <strong>1. Watch Reels</strong>
            <span className="block text-[10px] text-blue-600 mt-0.5">{reelsWatchedCount}/5 Completed</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
            <strong>2. Unlock Quiz</strong>
            <span className="block text-[10px] text-slate-500 mt-0.5">Automated</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
            <strong>3. Answer Qs</strong>
            <span className="block text-[10px] text-slate-500 mt-0.5">MCQ Format</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
            <strong>4. Submit</strong>
            <span className="block text-[10px] text-slate-500 mt-0.5">Instant Grading</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
            <strong>5. View Result</strong>
            <span className="block text-[10px] text-slate-500 mt-0.5">Pass threshold 80%</span>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
            <strong>6. Rewards</strong>
            <span className="block text-[10px] text-emerald-600 mt-0.5">+Points & Badges</span>
          </div>
        </div>
      </div>

      {/* Upcoming & Completed Assessments */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-900">Assessment History</h2>

        {assessmentHistory.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-3">
            <CheckSquare size={32} className="mx-auto text-slate-300" />
            <h3 className="text-sm font-bold text-slate-900">No Assessment History Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Watch educational reels in the Learn tab to unlock your first micro-assessment.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {assessmentHistory.map(res => (
              <div
                key={res.id}
                className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shrink-0 ${
                    res.passed ? 'bg-emerald-600' : 'bg-red-600'
                  }`}>
                    {res.passed ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-bold text-slate-900">
                        {res.passed ? 'Micro-Assessment Passed' : 'Micro-Assessment Retake Required'}
                      </strong>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        res.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {res.passed ? 'PASS' : 'FAIL'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Score: <strong className="text-slate-900 font-mono">{res.scorePercentage}%</strong> ({res.correctCount}/{res.totalQuestions} Correct)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">{new Date(res.completedAt).toLocaleDateString()}</span>
                  {res.rewardsEarned?.points && (
                    <span className="font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                      +{res.rewardsEarned.points} Pts
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
