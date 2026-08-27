import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ReelCard } from './ReelCard';
import {
  ChevronUp,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Check,
  Award,
  ArrowRight,
  PlaySquare,
  Lock,
  Unlock
} from 'lucide-react';

interface ReelsFeedProps {
  viewMode?: 'desktop' | 'mobile-sim' | 'tablet-sim';
}

export const ReelsFeed: React.FC<ReelsFeedProps> = () => {
  const {
    reels,
    currentReelIndex,
    setCurrentReelIndex,
    watchedLearnReelIds,
    isAssessmentUnlocked,
    adminSettings,
    openAssessment
  } = useApp();

  // Exactly 6 published learn reels
  const learnReels = reels.filter(r => r.isPublished).slice(0, 6);
  const totalReels = learnReels.length || 6;
  const completedCount = watchedLearnReelIds.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalReels) * 100));

  const touchStartY = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 50;

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
  }, [currentReelIndex, learnReels.length]);

  const handleNext = () => {
    if (currentReelIndex < learnReels.length - 1) {
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

  const activeReel = learnReels[currentReelIndex] || learnReels[0];

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] flex flex-col items-center justify-between pb-8 pt-4 bg-slate-50">
      {/* Top Header: 6 Learn Reels Progress & Unlocked Assessment Banner */}
      <div className="w-full max-w-2xl px-4 z-30 mb-3 space-y-3">
        {/* Unlocked Banner (Only when all 6 reels are completed) */}
        {isAssessmentUnlocked && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 shadow-sm flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Unlock size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-900">
                  🎉 All 6 Learn Reels Completed! Assessment Unlocked!
                </p>
                <p className="text-[11px] text-emerald-700">
                  Take the automated 6-question quiz to earn points, vouchers, and qualify for Mentorship.
                </p>
              </div>
            </div>
            <button
              onClick={openAssessment}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
            >
              <span>Start Assessment</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Progress Bar & Header */}
        <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlaySquare size={16} className="text-blue-600" />
              <span className="text-xs font-bold text-slate-900">Learn Dashboard (6 Vertical Reels)</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span className={isAssessmentUnlocked ? 'text-emerald-600' : 'text-blue-600'}>
                {completedCount}/6 Completed
              </span>
              {isAssessmentUnlocked ? (
                <CheckCircle2 size={15} className="text-emerald-600" />
              ) : (
                <Lock size={14} className="text-amber-500" />
              )}
            </div>
          </div>

          {/* Progress Track */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isAssessmentUnlocked ? 'bg-emerald-500' : 'bg-blue-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* 6 Quick Reel Selector Tabs */}
          <div className="grid grid-cols-6 gap-1.5 pt-1">
            {learnReels.map((reel, index) => {
              const isWatched = watchedLearnReelIds.includes(reel.id);
              const isSelected = currentReelIndex === index;
              return (
                <button
                  key={reel.id}
                  onClick={() => setCurrentReelIndex(index)}
                  className={`py-1.5 px-1 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : isWatched
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>R{index + 1}</span>
                    {isWatched && <Check size={11} className={isSelected ? 'text-white' : 'text-emerald-600'} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Center 9:16 Vertical Reel Player */}
      <div
        className="relative w-full flex-1 flex items-center justify-center px-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {activeReel ? (
          <ReelCard
            reel={activeReel}
            isActive={true}
            reelIndex={currentReelIndex}
            totalReels={totalReels}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        ) : (
          <div className="p-8 text-center text-slate-400">No reels found.</div>
        )}

        {/* Up / Down Navigation Controls for Desktop */}
        <div className="hidden lg:flex flex-col gap-3 absolute right-8 top-1/2 -translate-y-1/2 z-20">
          <button
            onClick={handlePrev}
            disabled={currentReelIndex === 0}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              currentReelIndex === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-blue-600 hover:text-white shadow-xs cursor-pointer'
            }`}
            title="Previous Reel"
          >
            <ChevronUp size={20} />
          </button>
          <button
            onClick={handleNext}
            disabled={currentReelIndex >= learnReels.length - 1}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              currentReelIndex >= learnReels.length - 1
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-blue-600 hover:text-white shadow-xs cursor-pointer'
            }`}
            title="Next Reel"
          >
            <ChevronDown size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
