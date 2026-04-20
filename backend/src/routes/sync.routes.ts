import { Router } from 'express';
import { push, pull } from '../controllers/syncController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Todas as rotas de sincronização requerem autenticação
router.use(authMiddleware);

router.post('/push', push);
router.get('/pull', pull);

export default router;
