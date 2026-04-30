import { Router } from 'express';
import { getVersionConfig } from '../controllers/configController';

const configRoutes = Router();

configRoutes.get('/version', getVersionConfig);

export default configRoutes;
