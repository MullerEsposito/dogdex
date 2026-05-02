import { Router } from 'express';
import { createOrGetSession, getMySessions, getMessages, sendMessage, getUnreadCount } from '../controllers/chatController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Todas as rotas de chat exigem autenticação
router.use(authMiddleware);

// Iniciar ou buscar sessão de chat com um ponto de adoção
router.post('/session', createOrGetSession);

// Listar todas as conversas do usuário
router.get('/sessions', getMySessions);

// Obter mensagens de uma sessão
router.get('/sessions/:sessionId/messages', getMessages);

// Enviar uma nova mensagem
router.post('/sessions/:sessionId/messages', sendMessage);

// Obter contagem de mensagens não lidas
router.get('/unread-count', getUnreadCount);

export default router;
