import { Router } from 'express';
import { getAdminAnalytics, getPlatformOverview } from '../controllers/analyticsController.js';

const router = Router();

router.get('/', getAdminAnalytics);
router.get('/overview', getPlatformOverview);

export default router;
