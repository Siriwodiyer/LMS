import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CourseReel } from '../../types';
import {
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Send,
  PlaySquare,
  Clock,
  ShieldCheck,
  AlertCircle,
  Video,
  Info
} from 'lucide-react';

interface MentorCreateCourseViewProps {
  onCourseCreated?: () => void;
}

export const MentorCreateCourseView: React.FC<MentorCreateCourseViewProps> = ({
  onCourseCreated
}) => {
  const { currentUser, createCourse, showToast } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Course Info
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('AI & Engineering');
  const [price, setPrice] = useState<number>(79);
  const [discountedPrice, setDiscountedPrice] = useState<number>(49);
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'>('Intermediate');
  const [thumbnailUrl, setThumbnailUrl] = useState(
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80'
  );

  // Step 2: Exactly 5 Vertical Reels
  const [courseReels, setCourseReels] = useState<CourseReel[]>([
    {
      id: `new-reel-1`,
      courseId: '',
      order: 1,
      title: 'Reel 1: Foundations & Architecture Setup',
      description: 'Environment bootstrap, core architectural patterns, and foundational concepts in 60s.',
      topic: 'Architecture - Fundamentals',
      durationSeconds: 54,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      likesCount: 0
    },
    {
      id: `new-reel-2`,
      courseId: '',
      order: 2,
      title: 'Reel 2: Core Implementation & Deep Dive',
      description: 'Hands-on practical walkthrough, internals, and execution lifecycle.',
      topic: 'Architecture - Core Concepts',
      durationSeconds: 58,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      likesCount: 0
    },
    {
      id: `new-reel-3`,
      courseId: '',
      order: 3,
      title: 'Reel 3: Advanced Patterns & Resiliency',
      description: 'Resilient architectural patterns, error handling, and production-grade best practices.',
      topic: 'Architecture - Patterns',
      durationSeconds: 52,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
      likesCount: 0
    },
    {
      id: `new-reel-4`,
      courseId: '',
      order: 4,
      title: 'Reel 4: Performance Profiling & Optimization',
      description: 'Profiling bottlenecks, memory optimization, caching strategies, and latency minimization.',
      topic: 'Architecture - Optimization',
      durationSeconds: 56,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
      likesCount: 0
    },
    {
      id: `new-reel-5`,
      courseId: '',
      order: 5,
      title: 'Reel 5: Production Deployment & Best Practices',
      description: 'Deploying to production, telemetry monitoring, real-world case studies, and certification readiness.',
      topic: 'Architecture - Production',
      durationSeconds: 60,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
      likesCount: 0
    }
  ]);

  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([
    'Build production-ready, scalable software architectures',
    'Design resilient distributed workflows and clean APIs',
    'Apply industry design patterns to real-world codebases'
  ]);
  const [newOutcome, setNewOutcome] = useState('');

  const handleUpdateReel = (index: number, updates: Partial<CourseReel>) => {
    setCourseReels(prev =>
      prev.map((reel, i) => (i === index ? { ...reel, ...updates } : reel))
    );
  };

  const handleAddOutcome = () => {
    if (!newOutcome.trim()) return;
    setLearningOutcomes(prev => [...prev, newOutcome.trim()]);
    setNewOutcome('');
  };

  const handleRemoveOutcome = (index: number) => {
    setLearningOutcomes(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitCourse = () => {
    if (!title.trim()) {
      showToast('Please enter a course title.', 'error');
      return;
    }

    // STRICT 5-REELS VALIDATION ENFORCEMENT
    if (courseReels.length !== 5) {
      showToast(`Every course must contain exactly 5 vertical reels (currently: ${courseReels.length}/5).`, 'error');
      return;
    }

    for (let i = 0; i < courseReels.length; i++) {
      if (!courseReels[i].title.trim() || !courseReels[i].videoUrl.trim()) {
        showToast(`Please complete the title and video URL for Reel ${i + 1}.`, 'error');
        return;
      }
    }

    createCourse({
      title: title.trim(),
      subtitle: subtitle.trim() || '5-Reel Masterclass Course',
      description: description.trim() || 'Comprehensive 5-reel course covering fundamental to advanced concepts.',
      category,
      price,
      discountedPrice,
      level,
      thumbnailUrl,
      reels: courseReels,
      reelsCount: 5,
      learningOutcomes
    });

    if (onCourseCreated) {
      onCourseCreated();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Mentor Portal</span>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
              5-Reel Course Requirement
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Create 5-Reel Course</h1>
          <p className="text-xs text-slate-600 mt-1">
            Design and submit a 5-vertical-reel micro-masterclass. Submissions are reviewed by Administrators prior to publication.
          </p>
        </div>

        {/* Multi-Step Indicator */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setCurrentStep(1)}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              currentStep === 1 ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'
            }`}
          >
            1. Overview
          </button>
          <button
            onClick={() => setCurrentStep(2)}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              currentStep === 2 ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'
            }`}
          >
            2. 5 Vertical Reels
          </button>
          <button
            onClick={() => setCurrentStep(3)}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              currentStep === 3 ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'
            }`}
          >
            3. Review & Submit
          </button>
        </div>
      </div>

      {/* STEP 1: COURSE METADATA & PRICING */}
      {currentStep === 1 && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5 animate-in fade-in">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen size={18} className="text-blue-600" />
            <span>Course Information</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Course Title *</label>
              <input
                type="text"
                placeholder="e.g. Distributed Systems Architecture & Event Streaming"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Subtitle / Catchphrase</label>
              <input
                type="text"
                placeholder="From Kafka, Event Sourcing to High-Throughput Clusters"
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              >
                <option>AI & Engineering</option>
                <option>Java</option>
                <option>Python</option>
                <option>Web Dev</option>
                <option>DSA</option>
                <option>DBMS</option>
                <option>Design</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Description</label>
              <textarea
                rows={3}
                placeholder="Explain what learners will master across these 5 vertical reels..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Standard Price ($)</label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Discounted Price ($)</label>
              <input
                type="number"
                value={discountedPrice}
                onChange={e => setDiscountedPrice(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Skill Level</label>
              <select
                value={level}
                onChange={e => setLevel(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>All Levels</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Thumbnail Image URL</label>
              <input
                type="text"
                value={thumbnailUrl}
                onChange={e => setThumbnailUrl(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next: Configure 5 Reels</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: 5 VERTICAL REELS CONFIGURATION */}
      {currentStep === 2 && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PlaySquare size={18} className="text-blue-600" />
                <span>5 Vertical Learning Reels (Mandatory 5/5)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every course requires exactly 5 vertical video reels covering core topic progression.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              5 of 5 Reels Ready
            </span>
          </div>

          <div className="space-y-4">
            {courseReels.map((reel, index) => (
              <div
                key={reel.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-900">Reel {index + 1}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {reel.durationSeconds || 60}s duration
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Reel Title</label>
                    <input
                      type="text"
                      value={reel.title}
                      onChange={e => handleUpdateReel(index, { title: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Topic / Sub-Category</label>
                    <input
                      type="text"
                      value={reel.topic}
                      onChange={e => handleUpdateReel(index, { topic: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Video Stream URL</label>
                    <input
                      type="text"
                      value={reel.videoUrl}
                      onChange={e => handleUpdateReel(index, { videoUrl: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Reel Description</label>
                    <input
                      type="text"
                      value={reel.description}
                      onChange={e => handleUpdateReel(index, { description: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next: Review & Submit</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & SUBMIT TO ADMIN APPROVAL QUEUE */}
      {currentStep === 3 && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3 text-xs text-blue-900">
            <ShieldCheck size={20} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Quality Governance Review</span>
              <p className="mt-0.5 text-blue-700 leading-relaxed">
                Upon submission, this course and its 5 vertical reels will be sent to the Administrator Approval Queue.
                Once approved, it will immediately be published to the User Courses catalog.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Course Summary</h2>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Course Title:</span>
                <span className="font-bold text-slate-900">{title || 'Untitled Course'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Category & Level:</span>
                <span className="font-semibold text-slate-800">{category} • {level}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Price:</span>
                <span className="font-bold text-slate-900">${discountedPrice} (Regular: ${price})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Vertical Reels:</span>
                <span className="font-bold text-emerald-600">5 of 5 Reels Configured</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>

            <button
              onClick={handleSubmitCourse}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs hover:shadow flex items-center gap-2 cursor-pointer transition-all"
            >
              <Send size={15} />
              <span>Submit 5-Reel Course for Admin Review</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
