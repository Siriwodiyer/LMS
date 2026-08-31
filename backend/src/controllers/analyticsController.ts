import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { PlatformOverviewStats } from '../types/index.js';

export const getAdminAnalytics = (req: Request, res: Response): void => {
  try {
    const analytics = db.getAnalytics();
    res.json({ success: true, analytics });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPlatformOverview = (req: Request, res: Response): void => {
  try {
    const users = db.getUsers();
    const courses = db.getCourses();
    const reels = db.getReels();
    const enrolled = db.getEnrolledStudents();

    const totalLearners = users.filter(u => u.role === 'student' || u.role === 'learner').length;
    const activeLearners = users.filter(u => (u.role === 'student' || u.role === 'learner') && u.status === 'active').length;
    const totalMentors = users.filter(u => u.role === 'mentor').length;
    const activeMentors = users.filter(u => u.role === 'mentor' && u.status === 'active').length;
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(c => c.status === 'published').length;
    const totalEducationalReels = reels.length;

    const completedEnr = enrolled.filter((e: any) => e.progressPercent === 100).length;
    const overallCourseCompletionRate = enrolled.length > 0 ? Math.round((completedEnr / enrolled.length) * 100) : 74;

    const stats: PlatformOverviewStats = {
      totalLearners,
      activeLearners,
      totalMentors,
      activeMentors,
      totalCourses,
      publishedCourses,
      totalEducationalReels,
      overallCourseCompletionRate
    };

    res.json({ success: true, platformStats: stats });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
