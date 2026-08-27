import React, { useState } from 'react';
import { Course, CourseReel } from '../../types';
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
  Play,
  MessageSquare,
  Send,
  Sparkles,
  PlaySquare,
  ChevronRight
} from 'lucide-react';

interface CourseDetailsModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({ course, isOpen, onClose }) => {
  const {
    currentUser,
    enrollInCourse,
    redeemVoucher,
    courseFeedback,
    submitCourseFeedback,
    completedCourseReels,
    markCourseReelCompleted,
    isCourseReelCompleted,
    showToast
  } = useApp();

  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  // Feedback State
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');

  if (!isOpen) return null;

  const isEnrolled = currentUser.enrolledCourseIds.includes(course.id);
  const basePrice = course.discountedPrice || course.price;
  const finalPrice = discountPercent > 0 ? Math.round(basePrice * (1 - discountPercent / 100)) : basePrice;

  // 5 Course Reels
  const courseReels: CourseReel[] = course.reels && course.reels.length > 0 ? course.reels : [
    {
      id: `${course.id}-reel-1`,
      courseId: course.id,
      order: 1,
      title: 'Reel 1: Foundations & Architecture Setup',
      description: 'Environment bootstrap, core architectural patterns, and foundational concepts in 60s.',
      topic: `${course.title} - Fundamentals`,
      durationSeconds: 54,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: course.thumbnailUrl,
      likesCount: 1240
    },
    {
      id: `${course.id}-reel-2`,
      courseId: course.id,
      order: 2,
      title: 'Reel 2: Core Deep Dive & Execution',
      description: 'Hands-on code execution, internals, memory anatomy, and execution lifecycle.',
      topic: `${course.title} - Deep Dive`,
      durationSeconds: 58,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnailUrl: course.thumbnailUrl,
      likesCount: 980
    },
    {
      id: `${course.id}-reel-3`,
      courseId: course.id,
      order: 3,
      title: 'Reel 3: Advanced Patterns & Resiliency',
      description: 'Resilient architectural patterns, error handling, and production-grade best practices.',
      topic: `${course.title} - Patterns`,
      durationSeconds: 52,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      thumbnailUrl: course.thumbnailUrl,
      likesCount: 890
    },
    {
      id: `${course.id}-reel-4`,
      courseId: course.id,
      order: 4,
      title: 'Reel 4: Performance Profiling & Optimization',
      description: 'Profiling bottlenecks, memory optimization, caching strategies, and latency minimization.',
      topic: `${course.title} - Optimization`,
      durationSeconds: 56,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      thumbnailUrl: course.thumbnailUrl,
      likesCount: 750
    },
    {
      id: `${course.id}-reel-5`,
      courseId: course.id,
      order: 5,
      title: 'Reel 5: Production Deployment & Best Practices',
      description: 'Deploying to production, telemetry monitoring, real-world case studies, and certification readiness.',
      topic: `${course.title} - Production`,
      durationSeconds: 60,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      thumbnailUrl: course.thumbnailUrl,
      likesCount: 1120
    }
  ];

  const activeReel = courseReels[activeReelIndex] || courseReels[0];
  const isReelDone = isCourseReelCompleted(course.id, activeReel.id);

  // Feedback list
  const feedbackList = courseFeedback.filter(f => f.courseId === course.id);

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
    enrollInCourse(course.id, appliedCode || undefined);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment.trim()) {
      showToast('Please enter your review comments.', 'error');
      return;
    }
    submitCourseFeedback(course.id, feedbackRating, feedbackComment.trim());
    setFeedbackComment('');
    setShowFeedbackForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              {course.category}
            </span>
            <span className="text-xs font-bold text-slate-700">• 5 Vertical Learning Reels</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Grid: Player on left, 5 Reels list on right */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Player Container (Left: 7 cols) */}
            <div className="md:col-span-7 space-y-3">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[9/14] max-h-[420px] mx-auto border border-slate-200 shadow-md flex items-center justify-center">
                <video
                  key={activeReel.id}
                  src={activeReel.videoUrl}
                  controls
                  className="w-full h-full object-contain"
                  poster={activeReel.thumbnailUrl || course.thumbnailUrl}
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[11px] font-bold text-white flex items-center gap-1.5 border border-white/10 shadow-xs">
                  <PlaySquare size={13} className="text-blue-400" />
                  <span>Reel {activeReelIndex + 1} of 5: {activeReel.title}</span>
                </div>
              </div>

              {/* Reel Controls for Enrolled Users */}
              {isEnrolled && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-700">Reel Completion:</span>
                    <span className={isReelDone ? 'text-emerald-600 font-bold' : 'text-slate-500'}>
                      {isReelDone ? 'Completed ✓' : 'Not completed'}
                    </span>
                  </div>
                  <button
                    onClick={() => markCourseReelCompleted(course.id, activeReel.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isReelDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    }`}
                  >
                    <Check size={14} />
                    <span>{isReelDone ? 'Marked Complete' : 'Mark Reel Complete'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* 5 Reels Curriculum List (Right: 5 cols) */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  5 Course Reels
                </h2>
                <span className="text-xs font-mono font-semibold text-blue-600">
                  5 Vertical Reels
                </span>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {courseReels.map((reel, index) => {
                  const isCurrent = activeReelIndex === index;
                  const isDone = isCourseReelCompleted(course.id, reel.id);

                  return (
                    <div
                      key={reel.id}
                      onClick={() => setActiveReelIndex(index)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                        isCurrent
                          ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                            isCurrent
                              ? 'bg-blue-600 text-white'
                              : isDone
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isDone ? <Check size={14} /> : index + 1}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold truncate leading-snug">
                            {reel.title}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {reel.topic} • {reel.durationSeconds || 60}s
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <ChevronRight size={14} className={isCurrent ? 'text-blue-600' : 'text-slate-300'} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Course Details & Bio */}
          <div className="pt-2 space-y-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-snug">{course.title}</h1>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{course.description}</p>
            </div>

            {/* Instructor Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  {course.instructorName ? course.instructorName[0] : 'M'}
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-900">{course.instructorName}</h2>
                  <p className="text-[11px] text-slate-500">{course.instructorBio || 'Verified LMS Mentor'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span>{(course.rating || 4.9).toFixed(1)}</span>
              </div>
            </div>

            {/* Enrollment / Purchase Section */}
            {!isEnrolled ? (
              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-blue-900">Get Instant Access to all 5 Reels</span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl font-black text-slate-900">${finalPrice}</span>
                      {course.discountedPrice && (
                        <span className="text-sm text-slate-400 line-through">${course.price}</span>
                      )}
                      {discountPercent > 0 && (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">
                          {discountPercent}% OFF APPLIED
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleEnroll}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-all cursor-pointer"
                  >
                    Enroll Now (${finalPrice})
                  </button>
                </div>

                {/* Voucher Code Form */}
                <form onSubmit={handleApplyCoupon} className="flex items-center gap-2 max-w-sm">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Enter voucher code (e.g. REELPRO30)"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs uppercase font-mono font-bold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <span>You are enrolled in this course. Watch all 5 reels to master the material!</span>
                </div>
                <button
                  onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                >
                  Write Review
                </button>
              </div>
            )}

            {/* Review Form */}
            {showFeedbackForm && (
              <form onSubmit={handleSubmitReview} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h2 className="text-xs font-bold text-slate-900">Review this Masterclass</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        className="cursor-pointer"
                      >
                        <Star
                          size={18}
                          className={star <= feedbackRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows={3}
                  placeholder="Share what you learned from these 5 vertical reels..."
                  value={feedbackComment}
                  onChange={e => setFeedbackComment(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackForm(false)}
                    className="px-3 py-1.5 rounded-lg text-slate-600 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}

            {/* Course Reviews List */}
            {feedbackList.length > 0 && (
              <div className="space-y-2 pt-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Learner Reviews ({feedbackList.length})
                </h2>
                <div className="space-y-2">
                  {feedbackList.map(fb => (
                    <div key={fb.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{fb.userName}</span>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {[...Array(fb.rating)].map((_, i) => (
                            <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600">{fb.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
