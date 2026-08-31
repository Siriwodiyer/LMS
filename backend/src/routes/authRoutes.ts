import { Router } from 'express';
import {
  register,
  mentorApply,
  login,
  getMe,
  updateProfile,
  forgotPassword,
  switchRole
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/mentor-apply', mentorApply);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/me', authenticateToken, getMe);
router.put('/profile', authenticateToken, updateProfile);
router.post('/switch-role', authenticateToken, switchRole);

export default router;
