import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, getMe, forgotPassword, resetPassword, setPassword, resetPasswordPage } from '../controllers/authController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

/**
 * Rate limiter para rotas públicas de autenticação.
 * Previne brute-force em login e spam de e-mails de recuperação.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,                   // 10 tentativas por IP
  message: {
    error: 'Muitas tentativas. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.get('/reset-password-page', resetPasswordPage);
router.post('/reset-password', authLimiter, resetPassword);
router.post('/set-password', authMiddleware, setPassword);
router.get('/me', authMiddleware, getMe);

export default router;
