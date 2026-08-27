import React, { useState } from 'react';
import { Course } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  PlayCircle,
  Clock,
  Award,
  CheckCircle2,
  Star,
  Users,
  Tag,
  Gift,
  Check,
  ShieldCheck,
  X,
  Play
} from 'lucide-react';

interface CourseDetailsModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({ course, isOpen, onClose }) => {
  const { currentUser, enrollInCourse, redeemVoucher, showToast } = useApp();

  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const isEnrolled = currentUser.enrolledCourseIds.includes(course.id);
  const basePrice = course.discountedPrice || course.price;
  const finalPrice = discountPercent > 0 ? Math.round(basePrice * (1 - discountPercent / 100)) : basePrice;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const discount = redeemVoucher(couponCode.trim().toUpperCase());
    if (discount > 0) {
      setDiscountPercent(discount);
      setAppliedCode(couponCode.trim().toUpperCase());
    }
  };

  const handleEnroll = () => {
    const res = enrollInCourse(course.id, appliedCode || undefined);
    if (res.success) {
      onClose();
    }
  };

  const activeModule = course.modules[activeModuleIndex] || course.modules[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-3xl glass-panel bg-slate-900/95 border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              {course.category}
            </span>
            <span className="text-xs text-slate-400">• {course.level}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Video Preview Player */}
          {activeModule && (
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-white/10 shadow-xl">
              <video
                key={activeModule.id}
                src={activeModule.videoUrl}
                controls
                className="w-full h-full object-contain"
                poster={course.thumbnailUrl}
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-bold text-white flex items-center gap-1.5 border border-white/10">
                <PlayCircle size={14} className="text-blue-400" />
                <span>Preview: {activeModule.title}</span>
              </div>
            </div>
          )}

          {/* Title & Metadata */}
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">{course.title}</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">{course.subtitle}</p>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star size={14} className="fill-amber-400" />
                <span>{course.rating.toFixed(1)}</span>
                <span className="text-slate-500 font-normal">({course.reviewsCount} reviews)</span>
              </div>

              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>{course.studentsCount} students enrolled</span>
              </div>

              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{course.modules.reduce((sum, m) => sum + m.durationMinutes, 0)} mins total</span>
              </div>
            </div>
          </div>

          {/* Instructor Card */}
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-white/10 flex items-center gap-3.5">
            <img
              src={course.instructorAvatar}
              alt={course.instructorName}
              className="w-12 h-12 rounded-full object-cover border border-white/20"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <strong className="text-sm text-white">{course.instructorName}</strong>
                <ShieldCheck size={14} className="text-emerald-400" />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{course.instructorBio}</p>
            </div>
          </div>

          {/* Learning Outcomes */}
          <div>
            <h3 className="text-sm font-bold text-white mb-2.5">What You'll Master</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {course.learningOutcomes.map((outcome, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-800/40 border border-white/5 flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Syllabus Modules */}
          <div>
            <h3 className="text-sm font-bold text-white mb-2.5">Curriculum & Modules ({course.modules.length})</h3>
            <div className="space-y-2">
              {course.modules.map((mod, idx) => {
                const isActive = activeModuleIndex === idx;
                return (
                  <div
                    key={mod.id}
                    onClick={() => setActiveModuleIndex(idx)}
                    className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-blue-600/20 border-blue-500/50 text-white'
                        : 'bg-slate-800/40 border-white/5 text-slate-300 hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isActive ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <strong className="block text-slate-200">{mod.title}</strong>
                        <span className="text-[11px] text-slate-400">{mod.description}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">{mod.durationMinutes}m</span>
                      {mod.isFreePreview && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          PREVIEW
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Checkout & Enrollment Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Price breakdown */}
          <div className="flex items-baseline gap-2.5 self-start sm:self-center">
            <span className="text-2xl sm:text-3xl font-black text-white font-display">
              ${finalPrice}
            </span>
            {course.price > finalPrice && (
              <span className="text-sm text-slate-500 line-through font-mono">
                ${course.price}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/30">
                {discountPercent}% OFF APPLIED
              </span>
            )}
          </div>

          {/* Coupon Input & Action */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!isEnrolled && (
              <form onSubmit={handleApplyCoupon} className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="Coupon (e.g. REELPRO30)"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  className="w-36 bg-slate-800 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none uppercase font-mono"
                />
                <button
                  type="submit"
                  className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 border border-white/10"
                >
                  Apply
                </button>
              </form>
            )}

            <button
              onClick={handleEnroll}
              disabled={isEnrolled}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xl ${
                isEnrolled
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                  : 'gradient-btn-primary'
              }`}
            >
              {isEnrolled ? (
                <>
                  <Check size={16} />
                  <span>Enrolled & Ready</span>
                </>
              ) : (
                <span>Enroll Now • ${finalPrice}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
