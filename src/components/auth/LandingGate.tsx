import React from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, UserCheck, ShieldCheck, PlaySquare, Sparkles, ArrowRight, BookOpen, Award, CheckCircle2 } from 'lucide-react';

export const LandingGate: React.FC = () => {
  const { openAuthModal } = useApp();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 bg-white text-slate-900">
      <div className="w-full max-w-2xl text-center">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-6 shadow-xs">
          <Sparkles size={14} className="text-blue-600" />
          <span>CONNECTED LMS PLATFORM</span>
        </div>

        {/* Brand Icon */}
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 mx-auto mb-5">
          <span className="text-3xl font-black text-white font-display">L</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-display mb-4 text-slate-900 leading-tight">
          Welcome to <span className="text-blue-600">LMS</span>
        </h1>
        
        <p className="text-sm sm:text-base text-slate-600 mb-8 max-w-lg mx-auto leading-relaxed">
          Experience an integrated learning ecosystem. Complete 6 bite-sized vertical Learn reels to unlock automated assessments, earn rewards, qualify for verified Mentorship, and publish 5-reel courses.
        </p>

        {/* Main Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10 max-w-md mx-auto">
          <button
            onClick={openAuthModal}
            className="w-full sm:w-1/2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Sign In</span>
            <ArrowRight size={16} />
          </button>
          <button
            onClick={openAuthModal}
            className="w-full sm:w-1/2 px-6 py-3.5 rounded-xl bg-slate-50 border border-slate-300 hover:border-blue-500 text-slate-800 font-bold text-sm shadow-xs transition-all hover:bg-slate-100 cursor-pointer"
          >
            Create Learner Account
          </button>
        </div>

        {/* 3 Step Connected Workflow Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-3">
              <PlaySquare size={18} />
            </div>
            <p className="text-xs font-bold text-slate-900">1. 6 Learn Reels & Test</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Watch all 6 Learn reels to unlock the locked assessment & earn rewards.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 transition-all">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-3">
              <UserCheck size={18} />
            </div>
            <p className="text-xs font-bold text-slate-900">2. Mentor Qualification</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Pass 3+ assessments with ≥85% avg score to apply for Mentor credentials.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-purple-300 transition-all">
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center mb-3">
              <BookOpen size={18} />
            </div>
            <p className="text-xs font-bold text-slate-900">3. 5-Reel Course Creation</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Create courses with 5 vertical reels, get Admin approval, and teach learners.
            </p>
          </div>
        </div>

        {/* Demo Footer Helper */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-center gap-2">
          <CheckCircle2 size={13} className="text-emerald-500" />
          <span>Role-tailored logins for User 001, Mentor 001, and Administrator are available.</span>
        </div>
      </div>
    </div>
  );
};
