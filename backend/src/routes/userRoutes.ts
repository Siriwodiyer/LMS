import { Router } from 'express';
import { getAllUsers, getUserById, updateUser, toggleUserStatus, getUserActivity } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.get('/:id/activity', getUserActivity);
router.put('/:id', authenticateToken, updateUser);
router.patch('/:id/toggle-status', authenticateToken, requireAdmin, toggleUserStatus);

export default router;
