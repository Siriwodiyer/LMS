import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CourseModule, Reel } from '../../types';
import {
  Sparkles,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  DollarSign,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Send,
  HelpCircle,
  Video,
  Layers,
  Award,
  Eye,
  Check,
  Zap,
  Info,
  Clock,
  PlaySquare,
  Film,
  X,
  Search,
  CheckSquare
} from 'lucide-react';

interface MentorCreateCourseViewProps {
  onCourseCreated?: () => void;
}

export const MentorCreateCourseView: React.FC<MentorCreateCourseViewProps> = ({
  onCourseCreated
}) => {
  const { currentUser, addNewCourse, reels, addNewReel, showToast } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiPromptTopic, setAiPromptTopic] = useState('');

  // Course Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('AI & Engineering');
  const [price, setPrice] = useState<number>(79);
  const [discountedPrice, setDiscountedPrice] = useState<number>(59);
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'>('Intermediate');
  const [thumbnailUrl, setThumbnailUrl] = useState(
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80'
  );

  // Attached Reel State
  const [attachedReel, setAttachedReel] = useState<Reel | null>(null);
  const [isReelModalOpen, setIsReelModalOpen] = useState(false);
  const [reelModalMode, setReelModalMode] = useState<'pick' | 'create'>('pick');
  const [reelSearchQuery, setReelSearchQuery] = useState('');

  // New Custom Reel fields
  const [newReelTitle, setNewReelTitle] = useState('');
  const [newReelVideoUrl, setNewReelVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  const [newReelThumbnail, setNewReelThumbnail] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80');
  const [newReelDescription, setNewReelDescription] = useState('');
  const [newReelDuration, setNewReelDuration] = useState(45);

  const [modules, setModules] = useState<CourseModule[]>([
    {
      id: 'mod-1',
      title: 'Module 1: Architecture Overview & Tooling Setup',
      description: 'Foundational primitives, core architecture patterns, and setup.',
      durationMinutes: 30,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      isFreePreview: true
    },
    {
      id: 'mod-2',
      title: 'Module 2: Core Engineering & Implementation',
      description: 'Hands-on practical walkthrough and code deep-dive.',
      durationMinutes: 45,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      isFreePreview: false
    }
  ]);

  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([
    'Build production-ready, scalable software architectures',
    'Design resilient distributed workflows and clean APIs',
    'Apply industry design patterns to real-world codebases'
  ]);
  const [newOutcome, setNewOutcome] = useState('');

  const presetThumbnails = [
    { label: 'AI & Engineering', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80' },
    { label: 'Code & Dev', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80' },
    { label: 'System Design', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80' },
    { label: 'Cloud Architecture', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80' }
  ];

  // AI Syllabus Generator Simulation
  const handleAIGenerateSyllabus = () => {
    if (!aiPromptTopic.trim()) {
      showToast('Please type a topic to generate syllabus outline', 'warning');
      return;
    }
    setIsGeneratingAI(true);
    setTimeout(() => {
      const topic = aiPromptTopic.trim();
      setTitle(`Complete ${topic} Masterclass: Zero to Hero`);
      setSubtitle(`Master modern ${topic} with enterprise design patterns and real projects`);
      setDescription(
        `This comprehensive masterclass takes you on a deep dive into ${topic}. ` +
        `You will learn through interactive lessons, real-world case studies, and hands-on modules designed for engineering excellence.`
      );
      setModules([
        {
          id: `mod-ai-1`,
          title: `Module 1: Fundamentals & Philosophy of ${topic}`,
          description: `Core concepts, syntax, mental models, and environment setup.`,
          durationMinutes: 35,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          isFreePreview: true
        },
        {
          id: `mod-ai-2`,
          title: `Module 2: Intermediate Architecture & Best Practices`,
          description: `State management, performance tuning, and modular patterns.`,
          durationMinutes: 50,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          isFreePreview: false
        },
        {
          id: `mod-ai-3`,
          title: `Module 3: Production Deployment & Capstone Project`,
          description: `End-to-end implementation of a real-world application with testing and CI/CD.`,
          durationMinutes: 60,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          isFreePreview: false
        }
      ]);
      setLearningOutcomes([
        `Master foundational to advanced concepts in ${topic}`,
        `Architect and deploy production-grade software solutions`,
        `Solve algorithmic and architecture challenges with confidence`,
        `Earn a verified certificate of completion`
      ]);
      setIsGeneratingAI(false);
      showToast('AI syllabus generated successfully!', 'success');
    }, 900);
  };

  const handleAddModule = () => {
    const newMod: CourseModule = {
      id: `mod-${Date.now()}`,
      title: `Module ${modules.length + 1}: Practical Application`,
      description: 'Hands-on lecture with downloadable reference project files.',
      durationMinutes: 30,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      isFreePreview: false
    };
    setModules([...modules, newMod]);
  };

  const handleRemoveModule = (id: string) => {
    if (modules.length > 1) {
      setModules(modules.filter(m => m.id !== id));
    } else {
      showToast('A course must have at least 1 module', 'warning');
    }
  };

  const handleAddOutcome = () => {
    if (newOutcome.trim()) {
      setLearningOutcomes([...learningOutcomes, newOutcome.trim()]);
      setNewOutcome('');
    }
  };

  const handleRemoveOutcome = (idx: number) => {
    setLearningOutcomes(learningOutcomes.filter((_, i) => i !== idx));
  };

  // Handle Pick Existing Reel
  const handleSelectExistingReel = (reel: Reel) => {
    setAttachedReel(reel);
    // Optionally set course thumbnail to match reel thumbnail
    setThumbnailUrl(reel.thumbnailUrl);
    setIsReelModalOpen(false);
    showToast(`Attached reel: "${reel.title}" and updated course thumbnail!`, 'success');
  };

  // Handle Create New Reel
  const handleCreateNewReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReelTitle.trim()) return;

    const mockReel: Reel = {
      id: `reel-${Date.now()}`,
      title: newReelTitle.trim(),
      description: newReelDescription.trim() || `Promotional short for ${title || 'course'}`,
      category: category,
      videoUrl: newReelVideoUrl,
      thumbnailUrl: newReelThumbnail,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      creatorAvatar: currentUser.avatar,
      creatorRole: 'Mentor',
      difficulty: level === 'All Levels' ? 'Intermediate' : level,
      durationSeconds: Number(newReelDuration) || 45,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      viewsCount: 0,
      isPublished: true,
      questions: [
        {
          id: `q-${Date.now()}-1`,
          category: category,
          type: 'mcq',
          prompt: `What is the primary topic covered in "${newReelTitle}"?`,
          options: [title || 'Core concepts', 'Unrelated subject', 'Legacy tools', 'None of the above'],
          correctIndex: 0,
          explanation: 'Core foundation from the course overview.'
        }
      ],
      createdAt: new Date().toISOString()
    };

    addNewReel(mockReel);
    setAttachedReel(mockReel);
    setThumbnailUrl(mockReel.thumbnailUrl);
    setIsReelModalOpen(false);
    showToast(`New educational reel created and attached!`, 'success');
  };

  const handleSubmitCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Please fill in all required course information', 'error');
      return;
    }

    addNewCourse({
      title: title.trim(),
      subtitle: subtitle.trim() || 'Comprehensive Masterclass',
      description: description.trim(),
      category,
      price: Number(price),
      discountedPrice: discountedPrice ? Number(discountedPrice) : undefined,
      instructorId: currentUser.id,
      instructorName: currentUser.name,
      instructorAvatar: currentUser.avatar,
      instructorBio: currentUser.bio || 'Verified LMS Educator & Mentor',
      thumbnailUrl,
      level,
      modules,
      learningOutcomes,
      status: 'submitted',
      submittedAt: new Date().toISOString()
    });

    showToast(
      `Course "${title}" submitted to the admin approval queue! You will receive a notification once reviewed.`,
      'success'
    );

    if (onCourseCreated) {
      onCourseCreated();
    }
  };

  const filteredReelsToPick = reels.filter(r =>
    r.title.toLowerCase().includes(reelSearchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(reelSearchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24 animate-in fade-in duration-200">
      {/* Studio Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
              <Sparkles size={13} /> Course Creation Studio
            </span>
            <span className="text-xs text-slate-500">• Step {currentStep} of 4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-2">
            Create New Course Masterclass
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Design an engaging curriculum, attach educational reels, set your pricing, and submit for admin review.
          </p>
        </div>

        {/* Step Indicator Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          {[
            { step: 1, label: '1. Basics' },
            { step: 2, label: '2. Modules' },
            { step: 3, label: '3. Pricing' },
            { step: 4, label: '4. Review' }
          ].map(s => (
            <button
              key={s.step}
              type="button"
              onClick={() => setCurrentStep(s.step)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentStep === s.step
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : currentStep > s.step
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Generator Helper Box */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
              AI Course Curriculum Assistant
            </h3>
            <p className="text-[11px] text-slate-600">
              Type a topic and let AI draft your syllabus outline, modules, and learning goals in seconds.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 max-w-md w-full">
          <input
            type="text"
            placeholder="e.g. Next.js 15, Python AI, Docker DevOps"
            value={aiPromptTopic}
            onChange={e => setAiPromptTopic(e.target.value)}
            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
          />
          <button
            type="button"
            disabled={isGeneratingAI}
            onClick={handleAIGenerateSyllabus}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0"
          >
            <Sparkles size={14} className={isGeneratingAI ? 'animate-spin' : ''} />
            <span>{isGeneratingAI ? 'Generating...' : 'Auto-Fill'}</span>
          </button>
        </div>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmitCourse} className="space-y-6">
        {/* STEP 1: Basic Information */}
        {currentStep === 1 && (
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Step 1: Course Overview & Details</h3>
                <p className="text-xs text-slate-500">Provide the title, category, target skill level, thumbnail, and attached reels.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Course Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Full-Stack AI Architecture & Agentic Workflows"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs text-slate-900 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Subtitle / Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Build enterprise-grade LLM applications with LangChain, Next.js, and Vector Databases"
                  value={subtitle}
                  onChange={e => setSubtitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs text-slate-900 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs text-slate-900 bg-white shadow-sm"
                  >
                    <option value="AI & Engineering">AI & Engineering</option>
                    <option value="Tech">Tech & Web Dev</option>
                    <option value="Java">Java & Enterprise</option>
                    <option value="DSA">Data Structures & Algorithms</option>
                    <option value="Cloud">Cloud & DevOps</option>
                    <option value="Design">UI/UX Design</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Skill Level</label>
                  <select
                    value={level}
                    onChange={e => setLevel(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs text-slate-900 bg-white shadow-sm"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Course Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide a comprehensive syllabus overview, prerequisites, and what students will build..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs text-slate-900 resize-none shadow-sm"
                />
              </div>

              {/* Thumbnail Selector with Reels Option */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-900">
                  Course Thumbnail & Cover Image
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={thumbnailUrl}
                    alt="Course Preview"
                    className="w-24 h-16 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0 bg-slate-200"
                  />
                  <input
                    type="text"
                    value={thumbnailUrl}
                    onChange={e => setThumbnailUrl(e.target.value)}
                    placeholder="Enter custom image URL"
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs text-slate-900 bg-white shadow-sm"
                  />
                </div>

                {/* Preset & Reels Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60">
                  <span className="text-[11px] text-slate-500 font-semibold">Or pick a preset:</span>
                  {presetThumbnails.map(thumb => (
                    <button
                      key={thumb.label}
                      type="button"
                      onClick={() => setThumbnailUrl(thumb.url)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200 transition-all shadow-2xs"
                    >
                      {thumb.label}
                    </button>
                  ))}

                  {/* Reels Adding Options */}
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => {
                      setReelModalMode('pick');
                      setIsReelModalOpen(true);
                    }}
                    className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300 flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <PlaySquare size={13} className="text-emerald-600" />
                    <span>🎬 Pick from Reels Library</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setReelModalMode('create');
                      setIsReelModalOpen(true);
                    }}
                    className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-300 flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Film size={13} className="text-blue-600" />
                    <span>+ Add New Course Reel</span>
                  </button>
                </div>
              </div>

              {/* Attached Promotional / Educational Reel Preview Card */}
              {attachedReel && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border border-emerald-200 shadow-sm flex items-center justify-between gap-4 animate-in fade-in">
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-emerald-300 shadow-sm bg-black">
                      <img
                        src={attachedReel.thumbnailUrl}
                        alt={attachedReel.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <PlaySquare size={18} className="text-white" />
                      </div>
                      <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[8px] px-1 rounded font-mono font-bold">
                        {attachedReel.durationSeconds}s
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider">
                          Attached Reel
                        </span>
                        <span className="text-[10px] text-emerald-800 font-semibold">• {attachedReel.category}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                        {attachedReel.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 line-clamp-1">
                        {attachedReel.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnailUrl(attachedReel.thumbnailUrl);
                        showToast('Updated course thumbnail from attached reel!', 'info');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-emerald-700 text-[11px] font-bold border border-emerald-200 shadow-xs"
                    >
                      Use as Thumbnail
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAttachedReel(null);
                        showToast('Detached reel from course.', 'info');
                      }}
                      className="p-1.5 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove Reel"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
              >
                <span>Continue to Modules</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Modules & Video Lectures */}
        {currentStep === 2 && (
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Step 2: Curriculum & Video Modules</h3>
                <p className="text-xs text-slate-500">Add course modules, video lecture links, and durations.</p>
              </div>

              <button
                type="button"
                onClick={handleAddModule}
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1.5 border border-emerald-200 transition-all shadow-sm"
              >
                <Plus size={15} />
                <span>Add Module</span>
              </button>
            </div>

            <div className="space-y-4">
              {modules.map((mod, index) => (
                <div
                  key={mod.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <strong className="text-xs text-slate-800 font-bold">Module {index + 1}</strong>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={mod.isFreePreview || false}
                          onChange={e => {
                            const updated = [...modules];
                            updated[index].isFreePreview = e.target.checked;
                            setModules(updated);
                          }}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Free Preview</span>
                      </label>

                      {modules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveModule(mod.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Remove Module"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Module Title (e.g. Setting Up Distributed Data Pipelines)"
                    value={mod.title}
                    onChange={e => {
                      const updated = [...modules];
                      updated[index].title = e.target.value;
                      setModules(updated);
                    }}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs text-slate-900 bg-white shadow-sm"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Video Lecture MP4 or HLS Stream URL"
                        value={mod.videoUrl || ''}
                        onChange={e => {
                          const updated = [...modules];
                          updated[index].videoUrl = e.target.value;
                          setModules(updated);
                        }}
                        className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs text-slate-900 bg-white"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="5"
                          placeholder="Duration"
                          value={mod.durationMinutes || 30}
                          onChange={e => {
                            const updated = [...modules];
                            updated[index].durationMinutes = Number(e.target.value);
                            setModules(updated);
                          }}
                          className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs text-slate-900 bg-white"
                        />
                        <span className="text-xs text-slate-500">min</span>
                      </div>
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Module description and key concepts covered..."
                    value={mod.description}
                    onChange={e => {
                      const updated = [...modules];
                      updated[index].description = e.target.value;
                      setModules(updated);
                    }}
                    className="w-full p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs text-slate-900 bg-white resize-none"
                  />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5"
              >
                <ArrowLeft size={15} />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
              >
                <span>Continue to Pricing</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Pricing & Outcomes */}
        {currentStep === 3 && (
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Step 3: Pricing & Learning Outcomes</h3>
                <p className="text-xs text-slate-500">Define course pricing and what students will accomplish.</p>
              </div>
            </div>

            {/* Pricing Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-700">Course Price ($ USD)</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    required
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs text-slate-900 bg-white font-bold font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Full standard enrollment fee.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-700">Discounted / Early-Bird Price ($)</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    value={discountedPrice}
                    onChange={e => setDiscountedPrice(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs text-slate-900 bg-white font-bold font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Special promotional discount for active learners.</p>
              </div>
            </div>

            {/* Learning Outcomes Builder */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">What will students learn in this course?</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Master clean architecture and test-driven development"
                  value={newOutcome}
                  onChange={e => setNewOutcome(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddOutcome();
                    }
                  }}
                  className="flex-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs text-slate-900 bg-white shadow-sm"
                />
                <button
                  type="button"
                  onClick={handleAddOutcome}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                >
                  <Plus size={15} /> Add
                </button>
              </div>

              <div className="space-y-2 pt-2">
                {learningOutcomes.map((outcome, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-950"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                      <span>{outcome}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveOutcome(idx)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5"
              >
                <ArrowLeft size={15} />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
              >
                <span>Preview & Review</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Final Submission */}
        {currentStep === 4 && (
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Step 4: Final Preview & Admin Submission</h3>
                <p className="text-xs text-slate-500">Review your course masterclass before submitting for approval.</p>
              </div>
            </div>

            {/* Course Summary Card Preview */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row gap-6">
              <img
                src={thumbnailUrl}
                alt="Thumbnail"
                className="w-full md:w-56 h-36 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
              />

              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                    {category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
                    {level}
                  </span>
                  {attachedReel && (
                    <span className="px-2.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <PlaySquare size={10} /> Reel Attached
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                    Pending Review
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-lg">{title || 'Untitled Masterclass'}</h3>
                <p className="text-xs text-slate-600">{subtitle || 'Comprehensive Course'}</p>

                <div className="pt-2 flex items-center gap-4 text-xs font-semibold">
                  <span className="text-emerald-700 font-mono font-bold text-base">
                    ${price} {discountedPrice ? <span className="text-slate-400 line-through text-xs font-normal">${discountedPrice} promo</span> : null}
                  </span>
                  <span className="text-slate-500">• {modules.length} Modules</span>
                  <span className="text-slate-500">• Instructor: {currentUser.name}</span>
                </div>
              </div>
            </div>

            {/* Approval Workflow Notice */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
              <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Admin Review Policy:</strong>
                <span>
                  Once submitted, the LMS administration team will review your course curriculum, attached reels, and pricing.
                  You can track approval status and make requested edits directly in the "My Courses" tab.
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5"
              >
                <ArrowLeft size={15} />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm hover:shadow transition-all"
              >
                <Send size={16} />
                <span>Submit Course for Admin Approval</span>
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Reel Attachment Modal (Pick from Library OR Create New Reel) */}
      {isReelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                  <PlaySquare size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {reelModalMode === 'pick' ? 'Pick Educational Reel from Library' : 'Create & Attach New Short Reel'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {reelModalMode === 'pick'
                      ? 'Select an existing educational reel to attach as a course teaser and cover.'
                      : 'Upload a quick video short with micro-assessments to boost course discoverability.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsReelModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="px-6 pt-4 flex items-center gap-2 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setReelModalMode('pick')}
                className={`pb-2 text-xs font-bold transition-all border-b-2 ${
                  reelModalMode === 'pick'
                    ? 'text-emerald-700 border-emerald-600'
                    : 'text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                Select from Existing Reels ({reels.length})
              </button>
              <button
                type="button"
                onClick={() => setReelModalMode('create')}
                className={`pb-2 text-xs font-bold transition-all border-b-2 ${
                  reelModalMode === 'create'
                    ? 'text-emerald-700 border-emerald-600'
                    : 'text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                + Create & Upload New Reel
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {reelModalMode === 'pick' ? (
                /* PICK EXISTING REEL */
                <div className="space-y-4">
                  <div className="relative">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={reelSearchQuery}
                      onChange={e => setReelSearchQuery(e.target.value)}
                      placeholder="Search reels by title, category, or keyword..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                    {filteredReelsToPick.map(reel => (
                      <div
                        key={reel.id}
                        onClick={() => handleSelectExistingReel(reel)}
                        className="p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex gap-3 group"
                      >
                        <div className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                          <img
                            src={reel.thumbnailUrl}
                            alt={reel.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <PlaySquare size={16} className="text-white" />
                          </div>
                          <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[8px] px-1 rounded font-mono">
                            {reel.durationSeconds}s
                          </span>
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[9px] font-bold">
                              {reel.category}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-2 leading-snug group-hover:text-emerald-700">
                              {reel.title}
                            </h4>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                            <span>{reel.viewsCount || 120} views</span>
                            <span className="font-bold text-emerald-600">Select →</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* CREATE NEW REEL FORM */
                <form onSubmit={handleCreateNewReel} className="space-y-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Reel Video Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 60-Second Overview: Agentic Workflows & Tool Calling"
                      value={newReelTitle}
                      onChange={e => setNewReelTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Video MP4 URL</label>
                      <input
                        type="text"
                        required
                        value={newReelVideoUrl}
                        onChange={e => setNewReelVideoUrl(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Duration (seconds)</label>
                      <input
                        type="number"
                        min="15"
                        max="180"
                        value={newReelDuration}
                        onChange={e => setNewReelDuration(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Reel Thumbnail URL</label>
                    <div className="flex items-center gap-3">
                      <img
                        src={newReelThumbnail}
                        alt="Reel Cover"
                        className="w-12 h-16 rounded-lg object-cover border border-slate-200 shadow-xs"
                      />
                      <input
                        type="text"
                        value={newReelThumbnail}
                        onChange={e => setNewReelThumbnail(e.target.value)}
                        className="flex-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Short Description / Transcript</label>
                    <textarea
                      rows={3}
                      placeholder="Brief teaser description to hook students in the Reels feed..."
                      value={newReelDescription}
                      onChange={e => setNewReelDescription(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs text-slate-900 resize-none"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsReelModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Film size={14} />
                      <span>Create & Attach Reel</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
