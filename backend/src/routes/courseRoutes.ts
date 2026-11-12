import { Router } from 'express';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController';
import {
  getLecturesByCourse,
  createLecture,
} from '../controllers/lectureController';
import { authenticateAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Public routes for student panel & listing
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected routes for Admin
router.post('/', authenticateAdmin, createCourse);
router.put('/:id', authenticateAdmin, updateCourse);
router.delete('/:id', authenticateAdmin, deleteCourse);

// Nested routes for lectures under a course
router.get('/:courseId/lectures', getLecturesByCourse);
router.post('/:courseId/lectures', authenticateAdmin, createLecture);

export default router;

