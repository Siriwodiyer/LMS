import React from 'react';
import { User, Course } from '../../types';
import {
  GraduationCap,
  BookOpen,
  HelpCircle,
  Award,
  Clock,
  TrendingUp,
  X,
  UserCheck,
  CheckCircle2,
  Calendar,
  Layers,
  FileText,
  Mail,
  ShieldCheck
} from 'lucide-react';

interface LearnerInspectorModalProps {
  learner: User | null;
  courses: Course[];
  onClose: () => void;
}

export const LearnerInspectorModal: React.FC<LearnerInspectorModalProps> = ({
  learner,
  courses,
  onClose
}) => {
  if (!learner) return null;

  const initials = learner.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const enrolledCourses = courses.filter(c => learner.enrolledCourseIds.includes(c.id));
  const completedCourses = courses.filter(c => learner.completedCourseIds.includes(c.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-sm shrink-0">
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-blue-700">
                  Learner Dossier & Telemetry
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                    learner.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {learner.status}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5 font-display">
                {learner.name}
              </h2>
              <p className="text-xs text-slate-500 font-mono">{learner.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 text-xs text-slate-700">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Assigned Mentor</span>
              <p className="text-xs font-bold text-slate-900 truncate">
                {learner.assignedMentorName || 'Dr. Meera Iyer'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Total Learning Hours</span>
              <p className="text-sm font-bold text-slate-900 font-mono">
                {learner.totalLearningHours || 42.5} hrs
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Quiz Avg Accuracy</span>
              <p className="text-sm font-bold text-emerald-600 font-mono">
                {learner.quizAverage || 92}%
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Learning Streak</span>
              <p className="text-sm font-bold text-amber-600 font-mono">
                {learner.streakDays || 5} Days Active
              </p>
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BookOpen size={16} className="text-blue-600" />
              <span>Enrolled Curriculum ({enrolledCourses.length})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {enrolledCourses.map(course => {
                const isCompleted = learner.completedCourseIds.includes(course.id);
                return (
                  <div
                    key={course.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <strong className="text-slate-900 block font-bold text-xs">{course.title}</strong>
                        <span className="text-[11px] text-slate-500">{course.category} • ${course.price}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {isCompleted ? 'COMPLETED' : 'IN PROGRESS'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges Earned */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Award size={16} className="text-amber-600" />
              <span>Badges & Certifications ({learner.badges?.length || 0})</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {learner.badges?.map(badge => (
                <div
                  key={badge.id}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Award size={14} className="text-amber-600" />
                  <span>{badge.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-all"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
