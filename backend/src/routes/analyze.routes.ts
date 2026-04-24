import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { analyzeController } from '../controllers/analyzeController';
import { upload } from '../middlewares/upload';

const analyzeRoutes = Router();

/**
 * Rate limiter para o scanner de raças.
 * Protege o modelo TensorFlow contra abuso sem exigir autenticação.
 */
const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 30,                   // 30 scans por IP
  message: {
    error: 'Limite de análises atingido. Tente novamente em alguns minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

analyzeRoutes.post('/', analyzeLimiter, upload.single('image'), analyzeController.handle.bind(analyzeController));

export { analyzeRoutes };
