
import { Router } from "express";

import {
  getOverallLeaderboard,
  getMyTotalScore,
  getLessonLeaderboard,
  getGameLeaderboard,
  getKnowledgeCheckLeaderboard,
  getAvailableGames,
} from "../controllers/leaderboards/leaderboard.controller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/overall", authMiddleware, getOverallLeaderboard);
router.get("/me/score", authMiddleware, getMyTotalScore);
router.get("/lessons/:lessonId", authMiddleware, getLessonLeaderboard);
router.get("/games", authMiddleware, getAvailableGames);
router.get("/games/:gameType", authMiddleware, getGameLeaderboard);
router.get("/knowledge-check", authMiddleware, getKnowledgeCheckLeaderboard);

export default router;
