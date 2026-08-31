import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import reelRoutes from './reelRoutes.js';
import courseRoutes from './courseRoutes.js';
import quizRoutes from './quizRoutes.js';
import assignmentRoutes from './assignmentRoutes.js';
import assessmentRoutes from './assessmentRoutes.js';
import approvalRoutes from './approvalRoutes.js';
import mentorRoutes from './mentorRoutes.js';
import rewardRoutes from './rewardRoutes.js';
import feedbackRoutes from './feedbackRoutes.js';
import commentRoutes from './commentRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import aiRoutes from './aiRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/reels', reelRoutes);
router.use('/courses', courseRoutes);
router.use('/quizzes', quizRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/approvals', approvalRoutes);
router.use('/mentors', mentorRoutes);
router.use('/rewards', rewardRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/comments', commentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/settings', settingsRoutes);
router.use('/ai', aiRoutes);

export default router;
