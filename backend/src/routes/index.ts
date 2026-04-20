import { Router } from 'express';
import { analyzeRoutes } from './analyze.routes';
import { supportRoutes } from './support.routes';
import authRoutes from './auth.routes';

const routes = Router();

// Agrupa rotas dentro de /analyze
routes.use('/analyze', analyzeRoutes);
routes.use('/support', supportRoutes);
routes.use('/auth', authRoutes);

export { routes };
