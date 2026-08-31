import { Router } from 'express';
import {
  getApplications,
  getApplicationById,
  submitApplication,
  approveApplication,
  rejectApplication,
  requestChanges,
  resubmitApplication,
  checkEligibility
} from '../controllers/mentorController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';

const router = Router();

router.get('/eligibility', optionalAuth, checkEligibility);
router.get('/applications', getApplications);
router.get('/applications/:id', getApplicationById);
router.post('/applications', optionalAuth, submitApplication);
router.post('/applications/:id/approve', authenticateToken, requireAdmin, approveApplication);
router.post('/applications/:id/reject', authenticateToken, requireAdmin, rejectApplication);
router.post('/applications/:id/request-changes', authenticateToken, requireAdmin, requestChanges);
router.put('/applications/:id/resubmit', optionalAuth, resubmitApplication);

export default router;
