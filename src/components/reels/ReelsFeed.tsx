import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ReelCard } from './ReelCard';
import {
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  PlayCircle,
  Zap
} from 'lucide-react';

interface ReelsFeedProps {
  viewMode?: 'desktop' | 'mobile-sim' | 'tablet-sim';
}

export const ReelsFeed: React.FC<ReelsFeedProps> = ({
  viewMode = 'desktop'
}) => {
  const {
    reels,
    currentReelIndex,
    setCurrentReelIndex,
    reelsWatchedCount,
    adminSettings,
    openAssessment,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Python',
    'Java',
    'Web Dev',
    'AI/ML',
    'Data Structures'
  ];

  const touchStartY = React.useRef<number | null>(null);

  const SWIPE_THRESHOLD = 50;

  const filteredReels =
    selectedCategory === 'All'
      ? reels.filter(r => r.isPublished)
      : reels.filter(
          r =>
            r.isPublished &&
            (r.category === selectedCategory ||
              r.subject === selectedCategory)
        );

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
  }, [currentReelIndex, filteredReels.length]);

  const handleNext = () => {
    if (currentReelIndex < filteredReels.length - 1) {
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

    const deltaY =
      touchStartY.current - e.changedTouches[0].clientY;

    if (Math.abs(deltaY) > SWIPE_THRESHOLD) {
      if (deltaY > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    touchStartY.current = null;
  };

  const activeReel =
    filteredReels[currentReelIndex] || filteredReels[0];

  const isFiveCompleted =
    reelsWatchedCount >= adminSettings.reelsPerAssessment;

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] flex flex-col items-center justify-between pb-12 pt-4 bg-slate-50">

      {/* Top Floating Category Filters & Reel Progress Counter */}
      <div className="w-full max-w-4xl px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-30 mb-2">

        {/* Subject Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentReelIndex(0);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
            Reel {Math.min(currentReelIndex + 1, filteredReels.length)} of{' '}
            {filteredReels.length}
          </span>

          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Watched: {reelsWatchedCount}/
            {adminSettings.reelsPerAssessment}
          </span>
        </div>
      </div>

      {/* 5 of 5 Completed Banner Prompt */}
      {isFiveCompleted && (
        <div className="w-full max-w-xl mx-4 mb-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 shadow-sm flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs text-emerald-900">
            <CheckCircle2
              size={18}
              className="text-emerald-600 shrink-0"
            />

            <span>
              <strong>5 of 5 Reels Completed!</strong> You are eligible
              for your automated assessment.
            </span>
          </div>

          <button
            onClick={openAssessment}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shrink-0 shadow-sm"
          >
            <Zap size={14} />
            <span>Start Assessment</span>
          </button>
        </div>
      )}

      {/* Main Feed Container */}
      <div
        className="relative flex-1 w-full flex items-center justify-center touch-pan-x"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >

        {/* Next/Prev Navigation Buttons */}
        <div className="hidden lg:flex flex-col items-center gap-3 absolute left-[calc(50%+250px)] top-1/2 -translate-y-1/2 z-30">

          <button
            onClick={handlePrev}
            disabled={currentReelIndex === 0}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 shadow-sm transition-all"
          >
            <ChevronUp size={20} />
          </button>

          <button
            onClick={handleNext}
            disabled={currentReelIndex === filteredReels.length - 1}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 shadow-sm transition-all"
          >
            <ChevronDown size={20} />
          </button>
        </div>

        {/* The Active Reel Card */}
        {activeReel ? (
          <div className="h-full max-h-[calc(100vh-100px)] w-full flex items-center justify-center p-1">

            <ReelCard
              reel={activeReel}
              isActive={true}
              onNext={handleNext}
              onPrev={handlePrev}
            />

          </div>
        ) : (
          <div className="text-center py-20 text-slate-500 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">

            <PlayCircle
              size={40}
              className="mx-auto mb-3 text-slate-300"
            />

            <p className="text-sm font-semibold">
              No reels found in this category.
            </p>

            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-3 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
            >
              Reset Filter
            </button>

          </div>
        )}
      </div>
    </div>
  );
};
