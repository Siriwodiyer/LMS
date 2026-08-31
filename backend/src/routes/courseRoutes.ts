import { Router } from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  togglePublish,
  updateCourseStatus,
  enroll,
  getEnrolledStudents,
  markCourseReelCompleted,
  getCourseProgress
} from '../controllers/courseController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { requireMentor, requireAdmin } from '../middleware/rbac.js';

const router = Router();

router.get('/', optionalAuth, getCourses);
router.get('/enrolled-students', getEnrolledStudents);
router.get('/progress', optionalAuth, getCourseProgress);
router.get('/:id', optionalAuth, getCourseById);
router.post('/', authenticateToken, requireMentor, createCourse);
router.put('/:id', authenticateToken, requireMentor, updateCourse);
router.delete('/:id', authenticateToken, requireMentor, deleteCourse);

router.patch('/:id/publish', authenticateToken, requireMentor, togglePublish);
router.patch('/:id/status', authenticateToken, requireAdmin, updateCourseStatus);
router.post('/:id/enroll', optionalAuth, enroll);
router.post('/:courseId/reels/:reelId/complete', optionalAuth, markCourseReelCompleted);

export default router;
