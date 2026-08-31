import { Router } from 'express';
import { getAssessmentQuestions, submitAssessment, getAssessmentHistory } from '../controllers/assessmentController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/questions', getAssessmentQuestions);
router.post('/submit', optionalAuth, submitAssessment);
router.get('/history', optionalAuth, getAssessmentHistory);

export default router;
