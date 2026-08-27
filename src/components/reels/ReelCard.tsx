import React, { useState, useRef, useEffect } from 'react';
import { Reel } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
  CheckCircle2,
  Check
} from 'lucide-react';
import { CommentSheet } from './CommentSheet';
import { ShareModal } from './ShareModal';

interface ReelCardProps {
  reel: Reel;
  isActive: boolean;
  onNext?: () => void;
  onPrev?: () => void;
}

export const ReelCard: React.FC<ReelCardProps> = ({ reel, isActive, onNext, onPrev }) => {
  const { toggleLikeReel, toggleBookmarkReel, markReelWatched, showToast, currentUser } = useApp();
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  // Play or pause based on active visibility
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration || 1;
      const pct = (current / total) * 100;
      setProgressPercent(pct);

      // Trigger watched completion after 5 seconds or 80%
      if (current >= 5 && isActive) {
        markReelWatched(reel.id);
      }
    }
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!reel.isLiked) {
      toggleLikeReel(reel.id);
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
  };

  const categoryColors: Record<string, string> = {
    Tech: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    AI: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    Design: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    Business: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    Science: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    Languages: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  };

  return (
    <div className="relative w-full h-full max-w-[420px] max-h-[820px] rounded-3xl overflow-hidden bg-slate-950 border border-white/10 shadow-2xl flex flex-col select-none">
      {/* Top Video Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-30">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 transition-all duration-100"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Media Player Area */}
      <div
        className="relative flex-1 bg-black flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={handleVideoClick}
        onDoubleClick={handleDoubleTap}
      >
        <video
          ref={videoRef}
          src={reel.videoUrl}
          poster={reel.thumbnailUrl}
          playsInline
          loop
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-cover"
        />

        {/* Floating Gradient Backdrop for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />

        {/* Heart Burst on Double Tap */}
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <Heart size={90} className="text-pink-500 fill-pink-500 animate-heart-burst drop-shadow-2xl" />
          </div>
        )}

        {/* Play/Pause Overlay Indicator */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none z-20">
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <Play size={28} className="translate-x-0.5" />
            </div>
          </div>
        )}

        {/* Top Floating Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border backdrop-blur-md ${categoryColors[reel.category] || 'bg-slate-800 text-white'}`}>
              {reel.category}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/50 text-slate-300 border border-white/10 backdrop-blur-md">
              {reel.difficulty}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted(!isMuted);
            }}
            className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/15 hover:bg-black/80 transition-all"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </div>

        {/* Right Action Sidebar (Instagram Reels Style) */}
        <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4 z-30">
          {/* Like */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLikeReel(reel.id);
            }}
            className="flex flex-col items-center group"
          >
            <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              reel.isLiked ? 'bg-pink-500/30 text-pink-400 scale-110' : 'bg-black/50 text-white hover:bg-black/70'
            } border border-white/15`}>
              <Heart size={20} className={reel.isLiked ? 'fill-pink-400 text-pink-400' : 'text-white'} />
            </div>
            <span className="text-[11px] font-semibold text-white mt-1 shadow-sm drop-shadow">
              {reel.likesCount}
            </span>
          </button>

          {/* Comments */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCommentOpen(true);
            }}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all">
              <MessageCircle size={20} />
            </div>
            <span className="text-[11px] font-semibold text-white mt-1 drop-shadow">
              {reel.commentsCount}
            </span>
          </button>

          {/* Bookmark */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmarkReel(reel.id);
            }}
            className="flex flex-col items-center group"
          >
            <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              reel.isBookmarked ? 'bg-amber-500/30 text-amber-300' : 'bg-black/50 text-white hover:bg-black/70'
            } border border-white/15`}>
              <Bookmark size={20} className={reel.isBookmarked ? 'fill-amber-300 text-amber-300' : 'text-white'} />
            </div>
            <span className="text-[11px] font-semibold text-white mt-1 drop-shadow">
              Save
            </span>
          </button>

          {/* Share */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsShareOpen(true);
            }}
            className="flex flex-col items-center group"
          >
            <div className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all">
              <Share2 size={20} />
            </div>
            <span className="text-[11px] font-semibold text-white mt-1 drop-shadow">
              Share
            </span>
          </button>
        </div>

        {/* Bottom Content Metadata Overlay */}
        <div className="absolute left-4 right-16 bottom-4 z-20 text-left">
          {/* Creator Profile */}
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center border border-white/30 shrink-0 shadow-md">
              {reel.creatorName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white drop-shadow">{reel.creatorName}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/40 text-blue-200 border border-blue-400/30">
                {reel.creatorRole}
              </span>
            </div>
          </div>

          {/* Title */}
          <h2 className="font-bold text-sm text-slate-100 leading-snug drop-shadow line-clamp-2 mb-1.5">
            {reel.title}
          </h2>

          {/* Description */}
          <p
            onClick={(e) => {
              e.stopPropagation();
              setIsDescExpanded(!isDescExpanded);
            }}
            className={`text-xs text-slate-300/90 drop-shadow cursor-pointer ${
              isDescExpanded ? 'line-clamp-none' : 'line-clamp-2'
            }`}
          >
            {reel.description}
            {!isDescExpanded && <span className="text-blue-400 font-semibold ml-1">...more</span>}
          </p>
        </div>
      </div>

      {/* Interactive Modals */}
      <CommentSheet
        reelId={reel.id}
        isOpen={isCommentOpen}
        onClose={() => setIsCommentOpen(false)}
      />

      <ShareModal
        reel={reel}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
};
