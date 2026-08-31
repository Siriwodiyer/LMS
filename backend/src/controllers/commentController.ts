import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { Comment } from '../types/index.js';

export const getComments = (req: Request, res: Response): void => {
  try {
    const { reelId } = req.query;
    const comments = db.getComments(reelId as string);
    res.json({ success: true, count: comments.length, comments });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addComment = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { reelId, content } = req.body;
    const userId = req.user?.id || req.body.userId || 'user-student';
    const user = db.getUserById(userId);

    if (!reelId || !content || !content.trim()) {
      res.status(400).json({ success: false, message: 'Reel ID and comment content are required.' });
      return;
    }

    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      reelId,
      userId,
      userName: user?.name || 'User',
      userAvatar: user?.avatar,
      content: content.trim(),
      likes: 0,
      createdAt: new Date().toISOString()
    };

    const saved = db.insertComment(newComment);

    // Increment reel commentsCount
    const reel = db.getReelById(reelId);
    if (reel) {
      db.updateReel(reelId, { commentsCount: (reel.commentsCount || 0) + 1 });
    }

    res.status(201).json({ success: true, message: 'Comment posted!', comment: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteComment = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const deleted = db.deleteComment(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Comment not found.' });
      return;
    }
    res.json({ success: true, message: 'Comment deleted.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const flagComment = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const updated = db.updateComment(id, {
      isFlagged: true,
      flagReason: reason || 'Inappropriate content reported by community.'
    });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Comment not found.' });
      return;
    }
    res.json({ success: true, message: 'Comment flagged for moderation review.', comment: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
