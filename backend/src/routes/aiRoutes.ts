import { Router } from 'express';
import { getInsights } from '../controllers/aiController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/insights', optionalAuth, getInsights);

export default router;
