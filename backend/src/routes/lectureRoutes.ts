import { Router } from 'express';
import {
  getLectureById,
  updateLecture,
  deleteLecture,
} from '../controllers/lectureController';
import { authenticateAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Public route to view a specific lecture
router.get('/:id', getLectureById);

// Protected routes for Admin
router.put('/:id', authenticateAdmin, updateLecture);
router.delete('/:id', authenticateAdmin, deleteLecture);

export default router;

