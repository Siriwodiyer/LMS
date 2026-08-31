import { Router } from 'express';
import {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeSubmission
} from '../controllers/assignmentController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { requireMentor } from '../middleware/rbac.js';

const router = Router();

router.get('/', optionalAuth, getAssignments);
router.get('/:id', optionalAuth, getAssignmentById);
router.post('/', authenticateToken, requireMentor, createAssignment);
router.put('/:id', authenticateToken, requireMentor, updateAssignment);
router.delete('/:id', authenticateToken, requireMentor, deleteAssignment);

router.post('/:id/submit', optionalAuth, submitAssignment);
router.post('/:id/submissions/:submissionId/grade', authenticateToken, requireMentor, gradeSubmission);

export default router;
