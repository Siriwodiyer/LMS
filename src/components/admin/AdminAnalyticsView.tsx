import React from 'react';
import { useApp } from '../../context/AppContext';
import { PlatformTimeFilter } from '../../types';
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Clock,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  HelpCircle,
  Layers,
  DollarSign
} from 'lucide-react';

export const AdminAnalyticsView: React.FC = () => {
  const { analytics, timeFilter, setTimeFilter, courses, users } = useApp();

  const filterMultiplier: Record<PlatformTimeFilter, number> = {
    '7d': 0.25,
    '30d': 1.0,
    '3m': 2.8,
    '6m': 5.5,
    '1y': 10.2
  };

  const currentMult = filterMultiplier[timeFilter] || 1.0;
  const scaledHours = Math.round(18450 * currentMult);
  const scaledAssessments = Math.round(36900 * currentMult);
  const scaledRevenue = Math.round(28450 * currentMult);

  const timeFilterLabels: { id: PlatformTimeFilter; label: string }[] = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '3m', label: '3 Months' },
    { id: '6m', label: '6 Months' },
    { id: '1y', label: '1 Year' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* Header with Time Filters */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 flex items-center gap-1">
              <BarChart3 size={13} /> Platform Intelligence
            </span>
            <span className="text-xs text-slate-500">• Real-time Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-2">
            Analytics & Performance Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Systemic metrics across all learners, faculty mentors, courses, and quiz assessments.
          </p>
        </div>

        {/* Time Filters */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 self-start md:self-center">
          {timeFilterLabels.map(tf => (
            <button
              key={tf.id}
              onClick={() => setTimeFilter(tf.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeFilter === tf.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Learning Hours</span>
            <Clock size={16} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{scaledHours.toLocaleString()} hrs</p>
          <span className="text-[10px] text-emerald-600 font-semibold">↑ 24% vs previous period</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Active Enrollments</span>
            <BookOpen size={16} className="text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{courses.length * 142}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">↑ 18% course uptake</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Assessments Completed</span>
            <HelpCircle size={16} className="text-cyan-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{scaledAssessments.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">88.4% passing average</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Course Marketplace GMV</span>
            <DollarSign size={16} className="text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">${scaledRevenue.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">↑ 31% volume growth</span>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retention & Cohorts */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Learner Engagement & Retention Cohort</h3>
          <div className="space-y-3">
            {[
              { label: 'Week 1 Cohort Retention', value: 92, color: 'bg-emerald-600' },
              { label: 'Week 2 Assessment Completion', value: 84, color: 'bg-blue-600' },
              { label: 'Week 4 Project Submission Rate', value: 76, color: 'bg-indigo-600' },
              { label: 'Full Course Graduation Rate', value: 68, color: 'bg-purple-600' }
            ].map(item => (
              <div key={item.label} className="space-y-1 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-700">{item.label}</span>
                  <span className="font-bold font-mono text-slate-900">{item.value}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Categories */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Top Performing Curriculum Tracks</h3>
          <div className="space-y-3">
            {[
              { track: 'Artificial Intelligence & Agents', learners: '2,840 Students', gmv: '$42,500' },
              { track: 'Full-Stack Web Architecture', learners: '2,150 Students', gmv: '$31,200' },
              { track: 'Java Enterprise & Spring Cloud', learners: '1,720 Students', gmv: '$22,800' },
              { track: 'Algorithms & System Design', learners: '1,490 Students', gmv: '$18,400' }
            ].map(track => (
              <div key={track.track} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-slate-900 font-bold block">{track.track}</strong>
                  <span className="text-[11px] text-slate-500">{track.learners}</span>
                </div>
                <strong className="text-emerald-700 font-mono font-bold text-sm">{track.gmv}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
