import { Router } from 'express';
import {
  getCourseFeedback,
  submitCourseFeedback,
  getPlatformFeedback,
  submitPlatformFeedback
} from '../controllers/feedbackController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/courses', getCourseFeedback);
router.post('/courses', optionalAuth, submitCourseFeedback);
router.get('/platform', getPlatformFeedback);
router.post('/platform', optionalAuth, submitPlatformFeedback);

export default router;
