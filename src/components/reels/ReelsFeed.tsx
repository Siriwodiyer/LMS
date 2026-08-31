import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ReelCard } from './ReelCard';
import {
  ChevronUp,
  ChevronDown,
  ArrowRight,
  PlaySquare,
  Unlock,
  Youtube,
  Instagram,
  Video,
  Filter,
  Sparkles,
  Award,
  Layers,
  Menu,
  X,
  Compass,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface ReelsFeedProps {
  viewMode?: 'desktop' | 'mobile-sim' | 'tablet-sim';
}

const CATEGORY_TABS = [
  'All Topics',
  'Python',
  'Web Dev',
  'System Design',
  'Data Structures',
  'DBMS',
  'AI & ML'
];

export const ReelsFeed: React.FC<ReelsFeedProps> = () => {
  const {
    reels,
    currentReelIndex,
    setCurrentReelIndex,
    watchedLearnReelIds,
    isAssessmentUnlocked,
    openAssessment
  } = useApp();

  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'youtube' | 'instagram' | 'direct'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Topics');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const publishedReels = useMemo(() => reels.filter(r => r.isPublished), [reels]);

  // Compute platform counts
  const ytCount = useMemo(() => {
    return publishedReels.filter(r => r.source === 'youtube' || r.videoUrl.includes('youtube') || r.videoUrl.includes('youtu.be')).length;
  }, [publishedReels]);

  const igCount = useMemo(() => {
    return publishedReels.filter(r => r.source === 'instagram' || r.videoUrl.includes('instagram')).length;
  }, [publishedReels]);

  const lmsCount = useMemo(() => {
    return publishedReels.filter(r => r.source === 'direct' || (!r.videoUrl.includes('youtube') && !r.videoUrl.includes('youtu.be') && !r.videoUrl.includes('instagram'))).length;
  }, [publishedReels]);

  // Filter reels based on platform and category
  const filteredReels = useMemo(() => {
    return publishedReels
      .filter(r => {
        if (selectedPlatform === 'all') return true;
        if (selectedPlatform === 'youtube') return r.source === 'youtube' || r.videoUrl.includes('youtube') || r.videoUrl.includes('youtu.be');
        if (selectedPlatform === 'instagram') return r.source === 'instagram' || r.videoUrl.includes('instagram');
        if (selectedPlatform === 'direct') return r.source === 'direct' || (!r.videoUrl.includes('youtube') && !r.videoUrl.includes('youtu.be') && !r.videoUrl.includes('instagram'));
        return true;
      })
      .filter(r => {
        if (selectedCategory === 'All Topics') return true;
        return r.category === selectedCategory || r.subject === selectedCategory;
      });
  }, [publishedReels, selectedPlatform, selectedCategory]);

  const activeReelsList = filteredReels;
  const completedCount = watchedLearnReelIds.length;
  const progressPercent = Math.min(100, Math.round((completedCount / 6) * 100));

  const touchStartY = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 50;

  // Reset index when filter changes
  const handleSelectPlatform = (platform: 'all' | 'youtube' | 'instagram' | 'direct') => {
    setSelectedPlatform(platform);
    setCurrentReelIndex(0);
    setIsMobileSidebarOpen(false);
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentReelIndex(0);
    setIsMobileSidebarOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentReelIndex, activeReelsList.length]);

  const handleNext = () => {
    if (currentReelIndex < activeReelsList.length - 1) {
      setCurrentReelIndex(currentReelIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(currentReelIndex - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(deltaY) > SWIPE_THRESHOLD) {
      if (deltaY > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartY.current = null;
  };

  const activeReel = activeReelsList[currentReelIndex] || activeReelsList[0];

  // Reusable Sidebar Content
  const renderSidebarContent = () => (
    <div className="flex flex-col gap-5 p-4 sm:p-5 h-full overflow-y-auto custom-scrollbar">
      {/* 1. Milestone Quiz Card */}
      {isAssessmentUnlocked ? (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-emerald-600/10 to-teal-500/10 border border-emerald-400/40 dark:border-emerald-500/30 shadow-md space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <Unlock size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                🎉 Quiz Unlocked!
              </h3>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                6/6 Educational Reels completed
              </p>
            </div>
          </div>
          <button
            onClick={openAssessment}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Take Verified Quiz</span>
            <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                <PlaySquare size={16} />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Educational Reels
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {completedCount} / 6 Watched
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span>Quiz Milestone</span>
              <span className="font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Watch all 6 short lessons to unlock the verified micro-assessment quiz and certificate!
          </p>
        </div>
      )}

      {/* 2. Platform Sources Navigation */}
      <div className="space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 block">
          Platform Sources
        </span>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => handleSelectPlatform('all')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
              selectedPlatform === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers size={15} />
              <span>All Sources</span>
            </div>
            <span className="text-[11px] font-mono px-1.5 py-0.2 rounded-md bg-black/10 dark:bg-white/10">
              {publishedReels.length}
            </span>
          </button>

          <button
            onClick={() => handleSelectPlatform('youtube')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
              selectedPlatform === 'youtube'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Youtube size={15} className={selectedPlatform === 'youtube' ? 'fill-white' : 'text-red-500'} />
              <span>YouTube Shorts</span>
            </div>
            <span className="text-[11px] font-mono px-1.5 py-0.2 rounded-md bg-black/10 dark:bg-white/10">
              {ytCount}
            </span>
          </button>

          <button
            onClick={() => handleSelectPlatform('instagram')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
              selectedPlatform === 'instagram'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Instagram size={15} className={selectedPlatform === 'instagram' ? 'text-white' : 'text-pink-500'} />
              <span>Instagram Reels</span>
            </div>
            <span className="text-[11px] font-mono px-1.5 py-0.2 rounded-md bg-black/10 dark:bg-white/10">
              {igCount}
            </span>
          </button>

          <button
            onClick={() => handleSelectPlatform('direct')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
              selectedPlatform === 'direct'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Video size={15} />
              <span>Verified LMS</span>
            </div>
            <span className="text-[11px] font-mono px-1.5 py-0.2 rounded-md bg-black/10 dark:bg-white/10">
              {lmsCount}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Topics & Subjects Navigation */}
      <div className="space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 block">
          Topics
        </span>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_TABS.map(cat => (
            <button
              key={cat}
              onClick={() => handleSelectCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Up Next Queue */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Feed Queue ({activeReelsList.length})
          </span>
          <span className="text-[10px] text-blue-500 font-bold">
            {currentReelIndex + 1} of {activeReelsList.length}
          </span>
        </div>
        <div className="space-y-1.5">
          {activeReelsList.map((reel, idx) => {
            const isCurrent = currentReelIndex === idx;
            const isDone = watchedLearnReelIds.includes(reel.id);
            return (
              <button
                key={reel.id}
                onClick={() => {
                  setCurrentReelIndex(idx);
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full p-2 rounded-xl text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 shadow-xs'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="relative w-11 h-14 rounded-lg overflow-hidden shrink-0 bg-black">
                  <img
                    src={reel.thumbnailUrl}
                    alt={reel.title}
                    className="w-full h-full object-cover"
                  />
                  {isDone && (
                    <div className="absolute inset-0 bg-emerald-950/60 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 size={14} />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className={`text-xs font-bold line-clamp-1 ${
                    isCurrent ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-slate-200'
                  }`}>
                    {reel.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {reel.creatorName}
                  </p>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 mt-1 inline-block">
                    {reel.category}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-[calc(100vh-65px)] flex overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Desktop Left Sidebar Panel */}
      <div className="hidden md:flex w-80 shrink-0 border-r border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md flex-col z-20">
        {renderSidebarContent()}
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-slate-900 shadow-2xl z-10 flex flex-col">
            <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Compass size={16} className="text-blue-500" />
                <span>Reels & Quiz Explorer</span>
              </span>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X size={18} />
              </button>
            </div>
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* Main Center Immersive Reel Player Area */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="flex-1 h-full flex flex-col items-center justify-center relative p-2 sm:p-4 overflow-hidden"
      >
        {/* Mobile Top Floating Filter Pill Bar */}
        <div className="md:hidden absolute top-2 left-3 right-3 z-30 flex items-center justify-between gap-2">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-bold border border-white/20 shadow-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Menu size={13} />
            <span>Topics & Quiz ({completedCount}/6)</span>
          </button>

          {isAssessmentUnlocked && (
            <button
              onClick={openAssessment}
              className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-lg flex items-center gap-1 cursor-pointer animate-pulse"
            >
              <Unlock size={12} />
              <span>Quiz Ready!</span>
            </button>
          )}
        </div>

        {/* Center Vertical Reel Card */}
        {activeReel ? (
          <div className="relative flex items-center justify-center my-auto">
            <ReelCard
              reel={activeReel}
              isActive={true}
              reelIndex={currentReelIndex}
              totalReels={activeReelsList.length}
              onNext={handleNext}
              onPrev={handlePrev}
            />

            {/* Desktop Vertical Up/Down Arrow Navigation Beside the Player */}
            <div className="hidden xl:flex flex-col gap-3 absolute -right-16 top-1/2 -translate-y-1/2">
              <button
                onClick={handlePrev}
                disabled={currentReelIndex === 0}
                className="p-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-all cursor-pointer"
                title="Previous Reel (Up Arrow)"
              >
                <ChevronUp size={20} />
              </button>
              <button
                onClick={handleNext}
                disabled={currentReelIndex >= activeReelsList.length - 1}
                className="p-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-all cursor-pointer"
                title="Next Reel (Down Arrow)"
              >
                <ChevronDown size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm mx-auto shadow-md space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 mx-auto flex items-center justify-center">
              <Filter size={20} />
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              No reels match this filter
            </p>
            <p className="text-xs text-slate-500">
              Try switching source or topic in the sidebar to view other educational videos.
            </p>
            <button
              onClick={() => {
                setSelectedPlatform('all');
                setSelectedCategory('All Topics');
                setCurrentReelIndex(0);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
