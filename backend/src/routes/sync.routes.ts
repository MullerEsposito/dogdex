import { Router } from 'express';
import * as syncController from '../controllers/syncController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Todas as rotas de sincronização requerem autenticação
router.use(authMiddleware);

router.post('/push', syncController.push);
router.get('/pull', syncController.pull);

export default router;
