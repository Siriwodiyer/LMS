import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Save,
  Zap,
  HelpCircle,
  Award,
  Lock
} from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  const { adminSettings, updateAdminSettings, showToast } = useApp();

  const [threshold, setThreshold] = useState(adminSettings.passingScoreThreshold);
  const [reelsCount, setReelsCount] = useState(adminSettings.reelsPerAssessment);
  const [pointsPerAnswer, setPointsPerAnswer] = useState(adminSettings.pointsPerCorrectAnswer);
  const [streakMultiplier, setStreakMultiplier] = useState(adminSettings.streakBonusMultiplier || 1.5);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminSettings({
      passingScoreThreshold: Number(threshold),
      reelsPerAssessment: Number(reelsCount),
      pointsPerCorrectAnswer: Number(pointsPerAnswer),
      streakBonusMultiplier: Number(streakMultiplier)
    });
    showToast('Platform settings saved successfully!', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16 max-w-4xl">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1">
              <Sliders size={13} /> System Configuration
            </span>
            <span className="text-xs text-slate-500">• Platform Rules</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-2">
            Platform Rules & Governance Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Configure passing score thresholds, XP reward formulas, assessment parameters, and platform-wide rules.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Assessment Scoring Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-5 shadow-sm">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Zap size={18} className="text-blue-600" />
            <div>
              <h3 className="font-bold text-sm text-slate-900">Assessment Evaluation Parameters</h3>
              <p className="text-xs text-slate-500">Controls passing thresholds and micro-assessment triggers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div className="space-y-2">
              <label className="font-bold text-slate-800 block">
                Passing Score Threshold ({threshold}%)
              </label>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={threshold}
                onChange={e => setThreshold(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 block">
                Minimum accuracy required to earn certification and course credits.
              </span>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-slate-800 block">
                Points Per Correct Answer ({pointsPerAnswer} XP)
              </label>
              <input
                type="number"
                min="5"
                max="50"
                value={pointsPerAnswer}
                onChange={e => setPointsPerAnswer(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-200 text-slate-900 font-mono"
              />
              <span className="text-[11px] text-slate-500 block">
                Base points awarded to learner profile for each quiz question solved.
              </span>
            </div>
          </div>
        </div>

        {/* Gamification & Points */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-5 shadow-sm">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Award size={18} className="text-amber-600" />
            <div>
              <h3 className="font-bold text-sm text-slate-900">Gamification Multipliers</h3>
              <p className="text-xs text-slate-500">Streaks and learning incentives</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div className="space-y-2">
              <label className="font-bold text-slate-800 block">
                Daily Streak Bonus Multiplier ({streakMultiplier}x)
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="3.0"
                value={streakMultiplier}
                onChange={e => setStreakMultiplier(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-200 text-slate-900 font-mono"
              />
              <span className="text-[11px] text-slate-500 block">
                Multiplies points earned when maintaining a continuous daily learning streak.
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Save size={15} />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
