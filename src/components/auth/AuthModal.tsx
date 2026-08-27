import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  GraduationCap,
  UserCheck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  User,
  CheckCircle2,
  X,
  Zap,
  Star,
  Award,
  Layers
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginAsRole, loginUser, registerUser, users } = useApp();
  const [activeTab, setActiveTab] = useState<'demo' | 'login' | 'register'>('demo');

  // Custom Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [regAvatar, setRegAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

  if (!isAuthModalOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;

    // Find existing user or fallback
    const found = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase().trim());
    if (found) {
      loginUser(found);
    } else {
      // Auto create as student
      registerUser({
        name: loginEmail.split('@')[0],
        email: loginEmail.trim(),
        role: 'student'
      });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    registerUser({
      name: regName.trim(),
      email: regEmail.trim(),
      role: regRole,
      avatar: regAvatar
    });
  };

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl glass-panel bg-gradient-to-b from-[#0f172a] to-[#090d16] border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glowing Top Edge */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all z-10"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="p-6 sm:p-8 pb-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold mb-3">
            <Sparkles size={13} />
            <span>AUTHENTICATION GATEWAY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
            Welcome to <span className="gradient-text">LMS Reels</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-md mx-auto">
            Choose a demo account or sign in to experience role-based learning, creator studio, and platform governance.
          </p>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-center gap-1.5 mt-6 p-1 bg-slate-900/80 rounded-2xl border border-white/10 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('demo')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'demo' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap size={14} />
              <span>1-Click Demo</span>
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'login' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mail size={14} />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'register' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <User size={14} />
              <span>Sign Up</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 pt-2 overflow-y-auto space-y-4">
          {/* TAB 1: 1-CLICK DEMO ACCOUNTS */}
          {activeTab === 'demo' && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Select a persona to test instantly:
              </p>

              {/* Persona 1: Student */}
              <div
                onClick={() => loginAsRole('student')}
                className="group p-4 rounded-2xl bg-gradient-to-r from-blue-950/50 via-slate-900 to-slate-900 border border-blue-500/30 hover:border-blue-500 hover:scale-[1.01] transition-all cursor-pointer shadow-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                      alt="Student"
                      className="w-12 h-12 rounded-xl object-cover border-2 border-blue-500/50"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center">
                      4
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-white group-hover:text-blue-300 transition-colors">
                        Yashwanth Gowda
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                        STUDENT
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      1,450 XP • 7-day Streak • Micro-Reels & Quizzes
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-600/20 group-hover:bg-blue-600 text-blue-400 group-hover:text-white flex items-center justify-center transition-all">
                  <ArrowRight size={16} />
                </div>
              </div>

              {/* Persona 2: Mentor */}
              <div
                onClick={() => loginAsRole('mentor')}
                className="group p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-900 border border-emerald-500/30 hover:border-emerald-500 hover:scale-[1.01] transition-all cursor-pointer shadow-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
                      alt="Mentor"
                      className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500/50"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center">
                      ★
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors">
                        Dr. Meera Iyer
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                        MENTOR / INSTRUCTOR
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      3 Active Courses • 1,420 Students • Creator Studio
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-600/20 group-hover:bg-emerald-600 text-emerald-400 group-hover:text-white flex items-center justify-center transition-all">
                  <ArrowRight size={16} />
                </div>
              </div>

              {/* Persona 3: Admin */}
              <div
                onClick={() => loginAsRole('admin')}
                className="group p-4 rounded-2xl bg-gradient-to-r from-rose-950/50 via-slate-900 to-slate-900 border border-rose-500/30 hover:border-rose-500 hover:scale-[1.01] transition-all cursor-pointer shadow-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                      alt="Admin"
                      className="w-12 h-12 rounded-xl object-cover border-2 border-rose-500/50"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center">
                      🛡️
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-white group-hover:text-rose-300 transition-colors">
                        Gagan
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                        ADMIN / GOVERNOR
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      KPIs Analytics • Content Manager • Course Approvals
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-rose-600/20 group-hover:bg-rose-600 text-rose-400 group-hover:text-white flex items-center justify-center transition-all">
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOM SIGN IN */}
          {activeTab === 'login' && (
            <form onSubmit={handleCustomLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="student@lms.ai"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl gradient-btn-primary font-bold text-sm shadow-xl flex items-center justify-center gap-2 mt-2 hover:scale-[1.01] transition-all"
              >
                <span>Sign In to Dashboard</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* TAB 3: CREATE ACCOUNT */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Primary Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setRegRole('student')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                      regRole === 'student'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <GraduationCap size={18} className="text-blue-400" />
                    <div>
                      <p className="text-xs font-bold">Student</p>
                      <p className="text-[10px] text-slate-400">Learn & Earn</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setRegRole('mentor')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                      regRole === 'mentor'
                        ? 'bg-emerald-600/20 border-emerald-500 text-white'
                        : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <UserCheck size={18} className="text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold">Mentor</p>
                      <p className="text-[10px] text-slate-400">Publish Courses</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Choose Avatar</label>
                <div className="flex items-center gap-3">
                  {avatarPresets.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="Preset"
                      onClick={() => setRegAvatar(url)}
                      className={`w-10 h-10 rounded-xl object-cover cursor-pointer border-2 transition-all ${
                        regAvatar === url ? 'border-blue-500 scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl gradient-btn-primary font-bold text-sm shadow-xl flex items-center justify-center gap-2 mt-2 hover:scale-[1.01] transition-all"
              >
                <span>Create Account & Start Learning</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
