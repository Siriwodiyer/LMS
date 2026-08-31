import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { CourseFeedback, PlatformFeedbackItem } from '../types/index.js';

export const getCourseFeedback = (req: Request, res: Response): void => {
  try {
    const { courseId } = req.query;
    const feedback = db.getCourseFeedback(courseId as string);
    res.json({ success: true, count: feedback.length, feedback });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const submitCourseFeedback = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { courseId, rating, comment } = req.body;
    const userId = req.user?.id || req.body.userId || 'user-student';
    const user = db.getUserById(userId);
    const course = db.getCourseById(courseId);

    if (!courseId || !comment) {
      res.status(400).json({ success: false, message: 'Course ID and comment are required.' });
      return;
    }

    const newFeedback: CourseFeedback = {
      id: `fb-${Date.now()}`,
      courseId,
      courseTitle: course?.title || 'LMS Course',
      userId,
      userName: user?.name || 'Student',
      userAvatar: user?.avatar,
      rating: Number(rating) || 5,
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };

    const saved = db.insertCourseFeedback(newFeedback);

    // Recalculate course rating
    const allCourseFeedback = db.getCourseFeedback(courseId);
    const avgRating = allCourseFeedback.reduce((acc, f) => acc + f.rating, 0) / allCourseFeedback.length;
    db.updateCourse(courseId, {
      rating: Number(avgRating.toFixed(2)),
      reviewsCount: allCourseFeedback.length
    });

    res.status(201).json({ success: true, message: 'Course feedback submitted!', feedback: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPlatformFeedback = (req: Request, res: Response): void => {
  try {
    const feedback = db.getPlatformFeedback();
    res.json({ success: true, count: feedback.length, platformFeedback: feedback });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const submitPlatformFeedback = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { rating, category, comment } = req.body;
    const userId = req.user?.id || req.body.userId || 'user-student';
    const user = db.getUserById(userId);

    if (!comment) {
      res.status(400).json({ success: false, message: 'Comment is required.' });
      return;
    }

    const newFeedback: PlatformFeedbackItem = {
      id: `pfb-${Date.now()}`,
      userId,
      userName: user?.name || 'Student',
      rating: Number(rating) || 5,
      category: category || 'Platform Experience',
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };

    const saved = db.insertPlatformFeedback(newFeedback);
    res.status(201).json({ success: true, message: 'Platform feedback submitted. Thank you for your feedback!', platformFeedback: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
