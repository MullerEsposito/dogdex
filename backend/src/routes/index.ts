import { Router } from 'express';
import { analyzeRoutes } from './analyze.routes';
import { supportRoutes } from './support.routes';
import authRoutes from './auth.routes';
import syncRoutes from './sync.routes';
import configRoutes from './config.routes';
import adoptionRoutes from './adoption.routes';
import chatRoutes from './chat.routes';

// Função auxiliar para garantir que estamos usando o Router (lidando com default import em CommonJS)
function getRouter(module: any) {
  if (module && typeof module === 'object' && module.default) return module.default;
  return module;
}

const routes = Router();

const safeSync = getRouter(syncRoutes);
const safeAuth = getRouter(authRoutes);
const safeAnalyze = getRouter(analyzeRoutes);
const safeSupport = getRouter(supportRoutes);
const safeConfig = getRouter(configRoutes);
const safeAdoption = getRouter(adoptionRoutes);
const safeChat = getRouter(chatRoutes);

routes.use('/analyze', safeAnalyze);
routes.use('/support', safeSupport);
routes.use('/auth', safeAuth);
routes.use('/sync', safeSync);
routes.use('/config', safeConfig);
routes.use('/adoption', safeAdoption);
routes.use('/chat', safeChat);

export { routes };
