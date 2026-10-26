
import { Router } from 'express';

import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getRoadRaceMission,
  startRoadRaceGame,
  getNextRoadRaceBatch,
  completeRoadRaceGame,
} from '../controllers/games/roadRace.controller.js';

const router = Router();

router.get('/lessons/:lessonId/games/road-race/mission', authMiddleware, getRoadRaceMission);
router.post('/lessons/:lessonId/games/road-race/start', authMiddleware, startRoadRaceGame);
router.post('/games/sessions/:sessionId/spawns/next', authMiddleware, getNextRoadRaceBatch);
router.post('/games/sessions/:sessionId/complete', authMiddleware, completeRoadRaceGame);

export default router;
