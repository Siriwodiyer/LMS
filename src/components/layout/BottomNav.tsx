import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  PlaySquare,
  BarChart2,
  BookOpen,
  Award,
  BrainCircuit,
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
  const { reelsWatchedCount, adminSettings, currentUser, isViewAsLearner, notifications } = useApp();

  // If Admin is in native Admin experience, bottom nav is not needed (sidebar handles admin navigation)
  if (currentUser.role === 'admin' && !isViewAsLearner) {
    return null;
  }

  const currentRole = currentUser.role.toLowerCase().replace('role_', '');
  const isMentor = (currentRole === 'mentor' || currentRole === 'seller') && !isViewAsLearner;
  const unreadNotifs = notifications.filter(n => !n.read).length;

  if (isMentor) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {/* 1. Dashboard */}
        <button
          onClick={() => setActiveTab('mentor-dashboard')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
            activeTab === 'mentor-dashboard' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard size={18} />
          <span className="text-[9px]">Dashboard</span>
        </button>

        {/* 2. My Courses */}
        <button
          onClick={() => setActiveTab('mentor-courses')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
            activeTab === 'mentor-courses' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <BookOpen size={18} />
          <span className="text-[9px]">Courses</span>
        </button>

        {/* 3. Create Course */}
        <button
          onClick={() => setActiveTab('mentor-create-course')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
            activeTab === 'mentor-create-course' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <PlusCircle size={18} />
          <span className="text-[9px]">Create</span>
        </button>

        {/* 4. Students */}
        <button
          onClick={() => setActiveTab('mentor-students')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
            activeTab === 'mentor-students' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Users size={18} />
          <span className="text-[9px]">Students</span>
        </button>

        {/* 5. Notifications */}
        <button
          onClick={() => setActiveTab('mentor-notifications')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all relative ${
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
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
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
        className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
          activeTab === 'home' || activeTab === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-500'
        }`}
      >
        <LayoutDashboard size={18} />
        <span className="text-[9px]">Home</span>
      </button>

      {/* 2. Reels Feed */}
      <button
        onClick={() => setActiveTab('learn')}
        className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all relative ${
          activeTab === 'learn' || activeTab === 'reels' ? 'text-blue-600 font-bold' : 'text-slate-500'
        }`}
      >
        <div className="relative">
          <PlaySquare size={18} />
          {reelsWatchedCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[8px] font-bold px-1 rounded-full">
              {reelsWatchedCount}/{adminSettings.reelsPerAssessment}
            </span>
          )}
        </div>
        <span className="text-[9px]">Learn</span>
      </button>

      {/* 3. Courses */}
      <button
        onClick={() => setActiveTab('courses')}
        className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
          activeTab === 'courses' ? 'text-blue-600 font-bold' : 'text-slate-500'
        }`}
      >
        <BookOpen size={18} />
        <span className="text-[9px]">Courses</span>
      </button>

      {/* 4. Assessments */}
      <button
        onClick={() => setActiveTab('assessments')}
        className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
          activeTab === 'assessments' ? 'text-blue-600 font-bold' : 'text-slate-500'
        }`}
      >
        <Award size={18} />
        <span className="text-[9px]">Assessments</span>
      </button>

      {/* 5. Rewards & Badges */}
      <button
        onClick={() => setActiveTab('rewards')}
        className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
          activeTab === 'rewards' ? 'text-amber-500 font-bold' : 'text-slate-500'
        }`}
      >
        <Award size={18} />
        <span className="text-[9px]">Rewards</span>
      </button>

      {/* 6. Profile */}
      <button
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
          activeTab === 'profile' ? 'text-blue-600 font-bold' : 'text-slate-500'
        }`}
      >
        <User size={18} />
        <span className="text-[9px]">Profile</span>
      </button>
    </nav>
  );
};

