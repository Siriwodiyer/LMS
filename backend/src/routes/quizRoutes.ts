import { Router } from 'express';
import { getQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz, submitQuiz } from '../controllers/quizController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { requireMentor } from '../middleware/rbac.js';

const router = Router();

router.get('/', optionalAuth, getQuizzes);
router.get('/:id', optionalAuth, getQuizById);
router.post('/', authenticateToken, requireMentor, createQuiz);
router.put('/:id', authenticateToken, requireMentor, updateQuiz);
router.delete('/:id', authenticateToken, requireMentor, deleteQuiz);
router.post('/:id/submit', optionalAuth, submitQuiz);

export default router;
