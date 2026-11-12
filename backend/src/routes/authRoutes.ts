import { Router } from 'express';
import {
  adminLogin,
  getAdminSession,
  adminLogout,
  verifyAdminSession,
} from '../controllers/authController';
import { authenticateAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.post('/login', adminLogin);
router.get('/me', authenticateAdmin, getAdminSession);
router.post('/logout', adminLogout);
router.get('/verify', verifyAdminSession);

export default router;
