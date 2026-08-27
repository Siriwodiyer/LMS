import React from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, UserCheck, ShieldCheck, PlaySquare, Sparkles } from 'lucide-react';

export const LandingGate: React.FC = () => {
  const { openAuthModal } = useApp();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      <div className="w-full max-w-lg text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-5">
          <Sparkles size={13} />
          <span>LEARNING REELS PLATFORM</span>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg mx-auto mb-5">
          <span className="text-3xl font-black text-white font-display">L</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-display mb-3">
          Welcome to <span className="text-blue-600">LMS Reels</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mb-8 max-w-md mx-auto">
          Bite-sized learning reels, automated assessments, and gamified rewards — sign in or create an account to continue.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <button
            onClick={openAuthModal}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg transition-all"
          >
            Log In
          </button>
          <button
            onClick={openAuthModal}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-slate-200 hover:border-blue-300 text-slate-800 font-bold text-sm shadow-sm transition-all"
          >
            Sign Up
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 text-left">
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
            <GraduationCap size={18} className="text-blue-600 mb-1.5" />
            <p className="text-[11px] font-bold text-slate-900">Learners</p>
            <p className="text-[10px] text-slate-500">Watch, quiz, earn rewards</p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
            <UserCheck size={18} className="text-emerald-600 mb-1.5" />
            <p className="text-[11px] font-bold text-slate-900">Mentors</p>
            <p className="text-[10px] text-slate-500">Create & publish courses</p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
            <ShieldCheck size={18} className="text-purple-600 mb-1.5" />
            <p className="text-[11px] font-bold text-slate-900">Admins</p>
            <p className="text-[10px] text-slate-500">Govern the whole platform</p>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 mt-8 flex items-center justify-center gap-1.5">
          <PlaySquare size={12} />
          <span>A different dashboard loads automatically based on your role.</span>
        </p>
      </div>
    </div>
  );
};
