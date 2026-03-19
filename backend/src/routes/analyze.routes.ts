import { Router } from 'express';
import { analyzeController } from '../controllers/analyzeController';
import { upload } from '../middlewares/upload';

const analyzeRoutes = Router();

analyzeRoutes.post('/', upload.single('image'), analyzeController.handle.bind(analyzeController));

export { analyzeRoutes };
