import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck,
  BookOpen,
  Users,
  Award,
  Edit,
  CheckCircle2,
  Star,
  Mail,
  Briefcase,
  Code
} from 'lucide-react';

export const MentorProfileView: React.FC = () => {
  const { currentUser, courses, enrolledStudents, updateUserProfile, showToast } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [bioText, setBioText] = useState(currentUser.bio || 'Senior Software Architect and Instructor with over 10 years of experience in distributed systems and AI engineering.');
  const [expertise, setExpertise] = useState('Full-Stack Web Dev & AI Systems');

  const myCourses = courses.filter(c => c.instructorId === currentUser.id || currentUser.role === 'admin' || currentUser.role === 'mentor');
  const totalStudents = myCourses.reduce((sum, c) => sum + (c.studentsCount || 0), 0);
  const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const skills = ['Python', 'Java', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'Machine Learning'];

  const handleSaveProfile = () => {
    updateUserProfile({ bio: bioText });
    setIsEditing(false);
    showToast('Mentor profile updated successfully.', 'success');
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pb-20 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center shadow-sm shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 font-display">{currentUser.name}</h1>
              <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 size={12} /> Verified Mentor
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-2">
              <Briefcase size={13} className="text-slate-400" />
              <span>{expertise}</span>
              <span>•</span>
              <Mail size={13} className="text-slate-400" />
              <span>{currentUser.email}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition-all shrink-0"
        >
          <Edit size={14} />
          <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
          <span className="text-xs text-slate-500 block">Total Courses</span>
          <strong className="text-2xl font-bold text-slate-900 block mt-1">{myCourses.length}</strong>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
          <span className="text-xs text-slate-500 block">Total Students Taught</span>
          <strong className="text-2xl font-bold text-blue-600 block mt-1">{totalStudents}</strong>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
          <span className="text-xs text-slate-500 block">Instructor Rating</span>
          <strong className="text-2xl font-bold text-amber-600 block mt-1">4.92 ★</strong>
        </div>
      </div>

      {/* Bio and Skills Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Biography & Overview</h2>

          {isEditing ? (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">Bio</label>
              <textarea
                value={bioText}
                onChange={e => setBioText(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs text-slate-900"
              />
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {bioText}
            </p>
          )}
        </div>

        {/* Skills Tags Card */}
        <div className="md:col-span-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Code size={16} className="text-emerald-600" />
            <span>Skills & Expertise</span>
          </h2>

          <div className="flex flex-wrap gap-1.5">
            {skills.map(skill => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
