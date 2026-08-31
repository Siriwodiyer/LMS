import { Router } from 'express';
import {
  getApprovalQueue,
  submitContentForApproval,
  approveContent,
  rejectContent,
  requestChanges,
  publishDirectly
} from '../controllers/approvalController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin, requireMentor } from '../middleware/rbac.js';

const router = Router();

router.get('/', getApprovalQueue);
router.post('/submit', authenticateToken, requireMentor, submitContentForApproval);
router.post('/:id/approve', authenticateToken, requireAdmin, approveContent);
router.post('/:id/reject', authenticateToken, requireAdmin, rejectContent);
router.post('/:id/request-changes', authenticateToken, requireAdmin, requestChanges);
router.post('/:id/publish', authenticateToken, requireAdmin, publishDirectly);

export default router;
