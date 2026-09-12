import { Router } from 'express';
import { register, login, googleAuth, getMe, logout } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);
router.post('/logout', logout);

export default router;
