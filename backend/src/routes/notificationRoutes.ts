import { Router } from 'express';
import { getNotifications, markAsRead, clearAll } from '../controllers/notificationController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, getNotifications);
router.patch('/:id/read', optionalAuth, markAsRead);
router.post('/clear', optionalAuth, clearAll);

export default router;
