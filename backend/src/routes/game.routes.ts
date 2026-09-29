import { Router } from 'express';

import { authMiddleware } from '../middleware/authMiddleware.js';
import { createRoadRaceGame, } from '../controllers/games/roadRace.controller.js';

const router = Router();

router.get('/lessons/:lessonId/games/road-race', authMiddleware, createRoadRaceGame, );

export default router;