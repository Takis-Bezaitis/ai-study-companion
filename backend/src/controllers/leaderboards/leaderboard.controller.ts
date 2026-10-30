import type { Response, NextFunction } from "express";

import type { AuthRequest } from "../../types/custom.js";
import { GameType } from "../../../generated/prisma/client.js";
import { AppError } from "../../utils/AppError.js";
import { leaderboardService } from "../../services/leaderboards/leaderboard.service.js";

export async function getOverallLeaderboard(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const result =
      await leaderboardService.getOverallLeaderboard();

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function getMyTotalScore(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.id;

    const result =
      await leaderboardService.getUserTotalScore(userId);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function getLessonLeaderboard(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { lessonId } = req.params;

    if (typeof lessonId !== "string") {
      throw new AppError("Invalid lesson ID.", 400);
    }

    const result =
      await leaderboardService.getLessonLeaderboard(lessonId);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function getGameLeaderboard(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { gameType } = req.params;

    if (
      typeof gameType !== "string" ||
      !Object.values(GameType).includes(
        gameType as GameType,
      )
    ) {
      throw new AppError("Invalid game type.", 400);
    }

    const result =
      await leaderboardService.getGameLeaderboard(
        gameType as GameType,
      );

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function getKnowledgeCheckLeaderboard(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const result =
      await leaderboardService.getKnowledgeCheckLeaderboard();

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
}


export async function getAvailableGames(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await leaderboardService.getAvailableGames();

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
}

