import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';

const router = Router();

router.get('/', getSettings);
router.put('/', authenticateToken, requireAdmin, updateSettings);

export default router;
