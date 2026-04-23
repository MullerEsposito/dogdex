import { Router } from 'express';
import { register, login, getMe, forgotPassword, resetPassword, setPassword, resetPasswordPage } from '../controllers/authController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/reset-password-page', resetPasswordPage);
router.post('/reset-password', resetPassword);
router.post('/set-password', authMiddleware, setPassword);
router.get('/me', authMiddleware, getMe);

export default router;
