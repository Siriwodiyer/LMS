import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  Sparkles,
  Flame,
  Gift,
  Copy,
  Check,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { CertificateModal } from './CertificateModal';

interface RewardsDashboardProps {
  onNavigateToCourses: () => void;
}

export const RewardsDashboard: React.FC<RewardsDashboardProps> = ({ onNavigateToCourses }) => {
  const { currentUser, badges, vouchers, assessmentHistory, showToast } = useApp();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Voucher code "${code}" copied!`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pb-20 animate-in fade-in duration-200">
      {/* Header Banner (Clean White Style) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-sm shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 font-display">{currentUser.name}</h1>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                Learner Rewards
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-md">
              Earn badges, goodies, and discount vouchers by completing educational reels and passing assessments.
            </p>
          </div>
        </div>

        {/* Quick Points & Badge Metrics */}
        <div className="flex items-center gap-3 font-mono">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[90px]">
            <div className="flex items-center justify-center gap-1 text-amber-600">
              <Sparkles size={16} />
              <span className="text-lg font-bold">{currentUser.points}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Points</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[90px]">
            <div className="flex items-center justify-center gap-1 text-blue-600">
              <Award size={16} />
              <span className="text-lg font-bold">{badges.length}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Badges</span>
          </div>
        </div>
      </div>

      {/* Badges Collection */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Award size={18} className="text-blue-600" />
          <span>Earned Badges & Medals ({badges.length})</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map(badge => (
            <div
              key={badge.id}
              className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                    {badge.rarity}
                  </span>
                </div>
                <h3 className="font-bold text-xs text-slate-900">{badge.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{badge.description}</p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Unlocked</span>
                <span className="font-mono">{new Date(badge.unlockedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goodies & Discount Vouchers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Gift size={18} className="text-teal-600" />
            <span>Goodies & Vouchers</span>
          </h2>
          <button
            onClick={onNavigateToCourses}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Use in Courses</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {vouchers.map(vouch => (
            <div
              key={vouch.id}
              className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-emerald-600 font-mono">{vouch.discountPercent}% OFF</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    Active Goodie
                  </span>
                </div>
                <p className="text-xs text-slate-600">{vouch.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
                  <span className="text-xs font-mono font-bold text-slate-900">{vouch.code}</span>
                </div>

                <button
                  onClick={() => handleCopyCode(vouch.code)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  {copiedCode === vouch.code ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedCode === vouch.code ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <Award size={24} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Verified Platform Certificate</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified completion certificate issued upon passing subject micro-assessments.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCertModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-sm"
        >
          <ShieldCheck size={15} />
          <span>View Certificate</span>
        </button>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />
    </div>
  );
};

