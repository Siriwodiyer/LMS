import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  PlaySquare,
  BookOpen,
  Award,
  CheckSquare,
  Lock,
  PlusCircle,
  Users,
  Bell,
  User
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { watchedLearnReelIds, adminSettings, isAssessmentUnlocked, currentUser, isViewAsLearner, notifications } = useApp();

  // If Admin is in native Admin experience, bottom nav is not needed (sidebar handles admin navigation)
  if (currentUser.role === 'admin' && !isViewAsLearner) {
    return null;
  }

  const currentRole = currentUser.role.toLowerCase().replace('role_', '');
  const isMentor = currentRole === 'mentor' && !isViewAsLearner;
  const unreadNotifs = notifications.filter(n => !n.read).length;
  const completedLearnCount = watchedLearnReelIds.length;

  if (isMentor) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {/* 1. Dashboard */}
        <button
          onClick={() => setActiveTab('mentor-dashboard')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'mentor-dashboard' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard size={18} />
          <span className="text-[9px]">Dashboard</span>
        </button>

        {/* 2. My Courses */}
        <button
          onClick={() => setActiveTab('mentor-courses')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'mentor-courses' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <BookOpen size={18} />
          <span className="text-[9px]">Courses</span>
        </button>

        {/* 3. Create Course */}
        <button
          onClick={() => setActiveTab('mentor-create-course')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'mentor-create-course' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <PlusCircle size={18} />
          <span className="text-[9px]">Create (5 Reels)</span>
        </button>

        {/* 4. Students */}
        <button
          onClick={() => setActiveTab('mentor-students')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'mentor-students' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Users size={18} />
          <span className="text-[9px]">Students</span>
        </button>

        {/* 5. Notifications */}
        <button
          onClick={() => setActiveTab('mentor-notifications')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all relative cursor-pointer ${
            activeTab === 'mentor-notifications' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <div className="relative">
            <Bell size={18} />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[8px] font-bold px-1 rounded-full">
                {unreadNotifs}
              </span>
            )}
          </div>
          <span className="text-[9px]">Alerts</span>
        </button>

        {/* 6. Profile */}
        <button
          onClick={() => setActiveTab('mentor-profile')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'mentor-profile' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <User size={18} />
          <span className="text-[9px]">Profile</span>
        </button>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {/* 1. Dashboard */}
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all cursor-pointer ${
          activeTab === 'home' || activeTab === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-500'
        }`}
      >
        <LayoutDashboard size={18} />
        <span className="text-[9px]">Home</span>
      </button>

      {/* 2. Learn Reels */}
      <button
        onClick={() => setActiveTab('learn')}
        className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all relative cursor-pointer ${
          activeTab === 'learn' || activeTab === 'reels' ? 'text-blue-600 font-bold' : 'text-slate-500'
        }`}
      >
        <div className="relative">
          <PlaySquare size={18} />
          <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[8px] font-bold px-1 rounded-full">
            {completedLearnCount}/6
          </span>
        </div>
        <span className="text-[9px]">Learn (6)</span>
      </button>

      {/* 3. Courses */}
      <button
        onClick={() => setActiveTab('courses')}
        className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all cursor-pointer ${
          activeTab === 'courses' ? 'text-blue-600 font-bold' : 'text-slate-500'
        }`}
      >
        <BookOpen size={18} />
        <span className="text-[9px]">Courses</span>
      </button>

      {/* 4. Assessments */}
      <button
        onClick={() => setActiveTab('assessments')}
        className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all cursor-pointer ${
          activeTab === 'assessments' ? 'text-blue-600 font-bold' : 'text-slate-500'
        }`}
      >
        {isAssessmentUnlocked ? <CheckSquare size={18} /> : <Lock size={18} className="text-amber-500" />}
        <span className="text-[9px]">Assess</span>
      </button>

      {/* 5. Rewards */}
      <button
        onClick={() => setActiveTab('rewards')}
        className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all cursor-pointer ${
          activeTab === 'rewards' ? 'text-blue-600 font-bold' : 'text-slate-500'
        }`}
      >
        <Award size={18} />
        <span className="text-[9px]">Rewards</span>
      </button>

      {/* 6. Profile */}
      <button
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all cursor-pointer ${
          activeTab === 'profile' ? 'text-blue-600 font-bold' : 'text-slate-500'
        }`}
      >
        <User size={18} />
        <span className="text-[9px]">Profile</span>
      </button>
    </nav>
  );
};
