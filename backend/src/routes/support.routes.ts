import { Router } from 'express';
import { supportController } from '../controllers/supportController';
import { upload } from '../middlewares/upload';
import { supportRateLimiter } from '../middlewares/rateLimiter';

const supportRoutes = Router();

supportRoutes.post('/', supportRateLimiter, upload.single('screenshot'), supportController.handle.bind(supportController));

export { supportRoutes };
