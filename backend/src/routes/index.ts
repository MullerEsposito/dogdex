import { Router } from 'express';
import { analyzeRoutes } from './analyze.routes';
import { supportRoutes } from './support.routes';
import authRoutes from './auth.routes';
import syncRoutes from './sync.routes';

// Função auxiliar para garantir que estamos usando o Router (lidando com default import em CommonJS)
function getRouter(module: any) {
  if (module && typeof module === 'object' && module.default) return module.default;
  return module;
}

const routes = Router();

console.log('🛣️  Iniciando montagem das rotas...');

// Agrupa rotas dentro de /analyze
const safeSync = getRouter(syncRoutes);
const safeAuth = getRouter(authRoutes);
const safeAnalyze = getRouter(analyzeRoutes);
const safeSupport = getRouter(supportRoutes);

console.log('DEBUG [SYNC ROUTE]:', typeof safeSync);

routes.use('/analyze', safeAnalyze);
routes.use('/support', safeSupport);
routes.use('/auth', safeAuth);
routes.use('/sync', safeSync);

console.log('✅ Montagem das rotas concluída');

export { routes };
