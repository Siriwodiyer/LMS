import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { Reel } from '../types/index.js';

export const getReels = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { category, search } = req.query;
    let reels = db.getReels();

    // If query category provided
    if (category && typeof category === 'string' && category !== 'All') {
      reels = reels.filter(r => r.category.toLowerCase() === category.toLowerCase());
    }

    // If search term provided
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      reels = reels.filter(r => 
        r.title.toLowerCase().includes(q) || 
        r.description.toLowerCase().includes(q) ||
        r.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: reels.length, reels });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getReelById = (req: Request, res: Response): void => {
  try {
    const reel = db.getReelById(req.params.id);
    if (!reel) {
      res.status(404).json({ success: false, message: 'Reel not found.' });
      return;
    }
    res.json({ success: true, reel });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createReel = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const data = req.body;
    const creatorId = req.user?.id || 'user-admin';
    const creatorUser = db.getUserById(creatorId);

    const newReel: Reel = {
      id: `reel-${Date.now()}`,
      title: data.title || 'Untitled Educational Reel',
      description: data.description || '',
      category: data.category || 'General',
      subject: data.subject,
      topic: data.topic,
      courseId: data.courseId,
      courseTitle: data.courseTitle,
      videoUrl: data.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: data.thumbnailUrl || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
      creatorId,
      creatorName: creatorUser?.name || 'Instructor',
      creatorAvatar: creatorUser?.avatar,
      creatorRole: creatorUser?.role === 'admin' ? 'Admin' : 'Mentor',
      difficulty: data.difficulty || 'Beginner',
      durationSeconds: data.durationSeconds || 60,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      viewsCount: 0,
      isLiked: false,
      isBookmarked: false,
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
      tags: data.tags || [],
      questions: data.questions || [],
      createdAt: new Date().toISOString()
    };

    const saved = db.insertReel(newReel);
    res.status(201).json({ success: true, message: 'Reel created successfully.', reel: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateReel = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = db.updateReel(id, updates);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Reel not found.' });
      return;
    }
    res.json({ success: true, message: 'Reel updated successfully.', reel: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteReel = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const deleted = db.deleteReel(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Reel not found.' });
      return;
    }
    res.json({ success: true, message: 'Reel deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleLike = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const reel = db.getReelById(id);
    if (!reel) {
      res.status(404).json({ success: false, message: 'Reel not found.' });
      return;
    }

    const isLiked = !reel.isLiked;
    const likesCount = isLiked ? (reel.likesCount || 0) + 1 : Math.max(0, (reel.likesCount || 0) - 1);
    const updated = db.updateReel(id, { isLiked, likesCount });

    res.json({ success: true, isLiked, likesCount, reel: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleBookmark = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const reel = db.getReelById(id);
    if (!reel) {
      res.status(404).json({ success: false, message: 'Reel not found.' });
      return;
    }

    const isBookmarked = !reel.isBookmarked;
    const updated = db.updateReel(id, { isBookmarked });

    res.json({ success: true, isBookmarked, reel: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const togglePublish = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const reel = db.getReelById(id);
    if (!reel) {
      res.status(404).json({ success: false, message: 'Reel not found.' });
      return;
    }

    const isPublished = !reel.isPublished;
    const updated = db.updateReel(id, { isPublished });

    res.json({ success: true, isPublished, message: `Reel ${isPublished ? 'published' : 'unpublished'}.`, reel: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const markWatched = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const reel = db.getReelById(id);
    if (!reel) {
      res.status(404).json({ success: false, message: 'Reel not found.' });
      return;
    }

    // Increment views count
    const viewsCount = (reel.viewsCount || 0) + 1;
    db.updateReel(id, { viewsCount });

    // Track user watched learn reels
    const userId = req.user?.id || req.body.userId || 'user-student';
    const watchedIds = db.markLearnReelWatched(userId, id);

    res.json({ success: true, viewsCount, watchedLearnReelIds: watchedIds });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getWatchedLearnReels = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.id || (req.query.userId as string) || 'user-student';
    const watchedIds = db.getWatchedLearnReels(userId);
    res.json({ success: true, watchedLearnReelIds: watchedIds });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const unmarkLearnReel = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.body.userId || 'user-student';
    const watchedIds = db.unmarkLearnReel(userId, id);
    res.json({ success: true, watchedLearnReelIds: watchedIds });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
