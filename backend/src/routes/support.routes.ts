import { Router } from 'express';
import { supportController } from '../controllers/supportController';
import { upload } from '../middlewares/upload';

const supportRoutes = Router();

supportRoutes.post('/', upload.single('screenshot'), supportController.handle.bind(supportController));

export { supportRoutes };
