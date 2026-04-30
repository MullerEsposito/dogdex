import { Router } from 'express';
import * as adoptionController from '../controllers/adoptionController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Pontos de Adoção
router.get('/points', adoptionController.listPoints);
router.post('/points', authMiddleware, adoptionController.createPoint);
router.put('/points/:id', authMiddleware, adoptionController.updatePoint);

// Cães para Adoção
router.get('/points/:pointId/dogs', adoptionController.getDogsByPoint);
router.post('/points/:pointId/dogs', authMiddleware, adoptionController.addDogToPoint);
router.patch('/dogs/:dogId/status', authMiddleware, adoptionController.updateDogStatus);
router.delete('/dogs/:dogId', authMiddleware, adoptionController.deleteDog);

export default router;
