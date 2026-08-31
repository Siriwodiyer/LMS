import { Router } from 'express';
import {
  getReels,
  getReelById,
  createReel,
  updateReel,
  deleteReel,
  toggleLike,
  toggleBookmark,
  togglePublish,
  markWatched,
  getWatchedLearnReels,
  unmarkLearnReel
} from '../controllers/reelController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { requireMentor } from '../middleware/rbac.js';

const router = Router();

router.get('/', optionalAuth, getReels);
router.get('/watched', optionalAuth, getWatchedLearnReels);
router.get('/:id', optionalAuth, getReelById);
router.post('/', authenticateToken, requireMentor, createReel);
router.put('/:id', authenticateToken, requireMentor, updateReel);
router.delete('/:id', authenticateToken, requireMentor, deleteReel);

router.post('/:id/like', optionalAuth, toggleLike);
router.post('/:id/bookmark', optionalAuth, toggleBookmark);
router.patch('/:id/publish', authenticateToken, requireMentor, togglePublish);
router.post('/:id/watch', optionalAuth, markWatched);
router.post('/:id/unmark', optionalAuth, unmarkLearnReel);

export default router;
