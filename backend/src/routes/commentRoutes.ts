import { Router } from 'express';
import { getComments, addComment, deleteComment, flagComment } from '../controllers/commentController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', getComments);
router.post('/', optionalAuth, addComment);
router.delete('/:id', authenticateToken, deleteComment);
router.post('/:id/flag', optionalAuth, flagComment);

export default router;
