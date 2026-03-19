import { Router } from 'express';
import { analyzeRoutes } from './analyze.routes';

const routes = Router();

// Agrupa rotas dentro de /analyze
routes.use('/analyze', analyzeRoutes);

export { routes };
