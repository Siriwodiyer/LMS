import { Router } from 'express';
import {
  getBadgeDefinitions,
  createBadgeDefinition,
  updateBadgeDefinition,
  toggleBadgeActive,
  getUserBadges,
  getVouchers,
  redeemVoucher
} from '../controllers/rewardController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';

const router = Router();

router.get('/badge-definitions', getBadgeDefinitions);
router.post('/badge-definitions', authenticateToken, requireAdmin, createBadgeDefinition);
router.put('/badge-definitions/:id', authenticateToken, requireAdmin, updateBadgeDefinition);
router.patch('/badge-definitions/:id/toggle', authenticateToken, requireAdmin, toggleBadgeActive);

router.get('/badges', optionalAuth, getUserBadges);
router.get('/vouchers', optionalAuth, getVouchers);
router.post('/vouchers/redeem', optionalAuth, redeemVoucher);

export default router;
