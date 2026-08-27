import React, { useState, useEffect } from 'react';
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
  X,
  Zap,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Shield,
  Check,
  FileText
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginAsRole, loginUser, registerUser, validateCredentials, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'login' | 'demo' | 'register'>('login');

  // Login Role Path (User, Mentor, Admin)
  const [loginRole, setLoginRole] = useState<'student' | 'mentor' | 'admin'>('student');
  const [loginEmail, setLoginEmail] = useState('user@lms.ai');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register State (Learner only)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regAvatar, setRegAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
  const [regError, setRegError] = useState('');

  // Forgot Password modal
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Policy Modals
  const [policyModal, setPolicyModal] = useState<'terms' | 'privacy' | null>(null);

  // Functional Human Verification State
  const [isHumanVerified, setIsHumanVerified] = useState(false);
  const [captchaNum1, setCaptchaNum1] = useState(5);
  const [captchaNum2, setCaptchaNum2] = useState(3);
  const [captchaInput, setCaptchaInput] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  const refreshCaptcha = () => {
    const n1 = Math.floor(Math.random() * 8) + 2;
    const n2 = Math.floor(Math.random() * 8) + 1;
    setCaptchaNum1(n1);
    setCaptchaNum2(n2);
    setCaptchaInput('');
    setIsCaptchaValid(false);
    setIsHumanVerified(false);
  };

  useEffect(() => {
    if (isAuthModalOpen) {
      refreshCaptcha();
      setLoginError('');
      setRegError('');
      setShowForgotPassword(false);
      setForgotSubmitted(false);
      setPolicyModal(null);
    }
  }, [isAuthModalOpen, activeTab, loginRole]);

  // Sync default emails when role path changes
  const handleSelectLoginRole = (role: 'student' | 'mentor' | 'admin') => {
    setLoginRole(role);
    setLoginError('');
    setIsHumanVerified(false);
    setIsCaptchaValid(false);
    setCaptchaInput('');
    if (role === 'student') {
      setLoginEmail('user@lms.ai');
      setLoginPassword('password123');
    } else if (role === 'mentor') {
      setLoginEmail('mentor@lms.ai');
      setLoginPassword('password123');
    } else if (role === 'admin') {
      setLoginEmail('admin@lms.ai');
      setLoginPassword('admin123');
    }
  };

  const handleCaptchaChange = (val: string) => {
    setCaptchaInput(val);
    const parsed = parseInt(val.trim(), 10);
    if (!isNaN(parsed) && parsed === captchaNum1 + captchaNum2) {
      setIsCaptchaValid(true);
      setIsHumanVerified(true);
    } else {
      setIsCaptchaValid(false);
      setIsHumanVerified(false);
    }
  };

  const handleCheckboxVerification = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setIsHumanVerified(true);
      setIsCaptchaValid(true);
    } else {
      setIsHumanVerified(false);
      setIsCaptchaValid(false);
    }
  };

  if (!isAuthModalOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!isHumanVerified && !isCaptchaValid) {
      setLoginError('Human verification is mandatory. Please check "I am not a robot" or complete the challenge.');
      return;
    }

    const res = validateCredentials(loginEmail, loginPassword, loginRole);
    if (!res.success || !res.user) {
      setLoginError(res.error || 'Invalid credentials. Please verify your email and password.');
      return;
    }

    loginUser(res.user);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!isHumanVerified && !isCaptchaValid) {
      setRegError('Please complete the human verification step.');
      return;
    }

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError('Please fill in all required fields.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }

    const res = registerUser({
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      avatar: regAvatar
    });

    if (!res.success) {
      setRegError(res.message || 'Registration failed.');
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSubmitted(true);
    showToast(`Password reset link sent to ${forgotEmail}`, 'success');
  };

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Accent Stripe */}
        <div className="h-1.5 w-full bg-blue-600" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all z-10 cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="p-6 sm:p-7 pb-3 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2.5">
            <Shield size={13} />
            <span>LMS AUTHENTICATION GATEWAY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
            Welcome to <span className="text-blue-600">LMS</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Choose your login path or create a learner account to continue.
          </p>

          {/* Top Tabs */}
          <div className="flex items-center justify-center gap-1 mt-5 p-1 bg-slate-100 rounded-xl border border-slate-200 max-w-md mx-auto">
            <button
              onClick={() => { setActiveTab('login'); setLoginError(''); setRegError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'login' ? 'bg-white text-blue-600 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lock size={14} />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => { setActiveTab('demo'); setLoginError(''); setRegError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'demo' ? 'bg-white text-blue-600 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap size={14} />
              <span>1-Click Demo</span>
            </button>
            <button
              onClick={() => { setActiveTab('register'); setLoginError(''); setRegError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'register' ? 'bg-white text-blue-600 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User size={14} />
              <span>Sign Up (Learner)</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 pt-2 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: ROLE-BASED LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleCustomLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700 font-medium animate-in fade-in">
                  <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* 3 Separate Login Paths */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Login Path</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectLoginRole('student')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      loginRole === 'student'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <GraduationCap size={15} />
                    <span>User Login</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectLoginRole('mentor')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      loginRole === 'mentor'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <UserCheck size={15} />
                    <span>Mentor Login</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectLoginRole('admin')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      loginRole === 'admin'
                        ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck size={15} />
                    <span>Admin Login</span>
                  </button>
                </div>
              </div>

              {/* Email / Username */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email / Username</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder={
                      loginRole === 'student'
                        ? 'user@lms.ai'
                        : loginRole === 'mentor'
                        ? 'mentor@lms.ai'
                        : 'admin@lms.ai'
                    }
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password with Show/Hide Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(loginEmail);
                      setShowForgotPassword(true);
                    }}
                    className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Functional Human Verification */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Shield size={14} className="text-blue-600" />
                    <span>Human Verification</span>
                  </span>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw size={11} />
                    <span>Refresh</span>
                  </button>
                </div>

                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                  <label className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isHumanVerified}
                      onChange={handleCheckboxVerification}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>I am not a robot</span>
                  </label>

                  {isHumanVerified ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={16} />
                      <span>Verified ✓</span>
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-mono font-bold text-slate-700">
                        {captchaNum1} + {captchaNum2} =
                      </span>
                      <input
                        type="number"
                        placeholder="?"
                        value={captchaInput}
                        onChange={e => handleCaptchaChange(e.target.value)}
                        className="w-14 bg-white border border-slate-300 rounded px-2 py-1 text-xs font-bold text-center focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Login Button (Disabled until Human Verification is Completed) */}
              <button
                type="submit"
                disabled={!isHumanVerified}
                className={`w-full py-3 rounded-xl font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all ${
                  isHumanVerified
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:shadow-sm'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Sign In as {loginRole === 'student' ? 'User' : loginRole === 'mentor' ? 'Mentor' : 'Admin'}</span>
                <ArrowRight size={16} />
              </button>

              {/* Policy Links */}
              <p className="text-[11px] text-center text-slate-400">
                By logging in, you agree to our{' '}
                <button
                  type="button"
                  onClick={() => setPolicyModal('terms')}
                  className="text-blue-600 hover:underline font-semibold cursor-pointer"
                >
                  Terms & Conditions
                </button>
                {' '}and{' '}
                <button
                  type="button"
                  onClick={() => setPolicyModal('privacy')}
                  className="text-blue-600 hover:underline font-semibold cursor-pointer"
                >
                  Privacy Policy
                </button>.
              </p>
            </form>
          )}

          {/* TAB 2: 1-CLICK DEMO PERSONAS */}
          {activeTab === 'demo' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs font-semibold text-slate-700">
                  Instant 1-Click login for testing role-specific ecosystem workflows:
                </p>
              </div>

              {/* Persona 1: User 001 */}
              <div
                onClick={() => loginAsRole('student')}
                className="group p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold text-base">
                    <GraduationCap size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        User 001
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                        USER (LEARNER)
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      user@lms.ai • 6 Learn Reels • Micro-Assessments • Mentor Application
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all">
                  <ArrowRight size={16} />
                </div>
              </div>

              {/* Persona 2: Mentor 001 */}
              <div
                onClick={() => loginAsRole('mentor')}
                className="group p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold text-base">
                    <UserCheck size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        Mentor 001
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        VERIFIED MENTOR
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      mentor@lms.ai • Create 5-Reel Courses • View Students & Earnings
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-emerald-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all">
                  <ArrowRight size={16} />
                </div>
              </div>

              {/* Persona 3: Administrator */}
              <div
                onClick={() => loginAsRole('admin')}
                className="group p-4 rounded-xl bg-white border border-slate-200 hover:border-purple-500 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center font-bold text-base">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                        Administrator
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200">
                        ADMINISTRATOR
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      admin@lms.ai • Approve Mentor Apps • Course 5-Reel Approvals • Analytics
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-purple-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all">
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CREATE LEARNER ACCOUNT */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              {regError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700 font-medium animate-in fade-in">
                  <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-800">
                <p className="font-semibold">💡 Public Learner Registration</p>
                <p className="text-blue-600 mt-0.5">
                  Creates a User / Learner account. You can qualify for Mentor access by completing assessments!
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="learner@example.com"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimum 6 characters"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Profile Avatar</label>
                <div className="flex items-center gap-3">
                  {avatarPresets.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="Preset"
                      onClick={() => setRegAvatar(url)}
                      className={`w-11 h-11 rounded-xl object-cover cursor-pointer border-2 transition-all ${
                        regAvatar === url ? 'border-blue-600 scale-105 shadow-xs' : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Human Verification */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                  <label className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isHumanVerified}
                      onChange={handleCheckboxVerification}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>I am not a robot</span>
                  </label>
                  {isHumanVerified && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={16} />
                      <span>Verified ✓</span>
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={!isHumanVerified}
                className={`w-full py-3 rounded-xl font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all ${
                  isHumanVerified
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:shadow-sm'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Create User Account</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>

        {/* FORGOT PASSWORD MODAL */}
        {showForgotPassword && (
          <div className="absolute inset-0 bg-white z-20 p-6 flex flex-col justify-between animate-in fade-in">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-base font-bold text-slate-900">Reset Password</h3>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {!forgotSubmitted ? (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <p className="text-xs text-slate-600">
                    Enter the email address associated with your account. We will send a secure password reset link.
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@lms.ai"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Send Reset Link
                  </button>
                </form>
              ) : (
                <div className="p-6 text-center space-y-3">
                  <CheckCircle2 size={40} className="mx-auto text-emerald-500" />
                  <h4 className="text-sm font-bold text-slate-900">Reset Link Sent</h4>
                  <p className="text-xs text-slate-600">
                    If an account exists for {forgotEmail}, instructions to reset your password have been dispatched.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* POLICY MODAL */}
        {policyModal && (
          <div className="absolute inset-0 bg-white z-20 p-6 flex flex-col justify-between animate-in fade-in">
            <div className="overflow-y-auto pr-1">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-base font-bold text-slate-900">
                  {policyModal === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
                </h3>
                <button
                  type="button"
                  onClick={() => setPolicyModal(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
                {policyModal === 'terms' ? (
                  <>
                    <p><strong>1. Acceptance of Terms:</strong> By accessing and using the LMS platform, you agree to comply with all platform community rules, assessment integrity standards, and content creation policies.</p>
                    <p><strong>2. Micro-Assessment Integrity:</strong> Assessments unlock strictly upon completion of all 6 vertical Learn reels. Multiple submissions and answers are automatically scored.</p>
                    <p><strong>3. Mentor Verification:</strong> Mentor status requires achieving eligibility performance on 3 assessments followed by platform administrator review and approval.</p>
                    <p><strong>4. Course Publishing:</strong> All course creations require 5 vertical educational reels and quality verification prior to publication in the student course catalog.</p>
                  </>
                ) : (
                  <>
                    <p><strong>1. Information Collection:</strong> We collect learning activity data, reel watch completion progress, assessment accuracy metrics, and certification records.</p>
                    <p><strong>2. Data Usage:</strong> Your learning statistics are utilized solely to determine micro-assessment unlocking, reward vouchers, and mentor teaching eligibility.</p>
                    <p><strong>3. Anonymization & Privacy:</strong> User records and demo identifiers follow privacy best practices without selling data to third parties.</p>
                  </>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setPolicyModal(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
