import type { Response } from 'express';
import type { AuthRequest } from '../../types/custom.js';

import { gameParamsSchema } from '../../validations/games/game.validation.js';

import { 
  roadRaceStartBodySchema, 
  roadRaceSessionParamsSchema,
  roadRaceCompleteBodySchema,
} from '../../validations/games/roadRace.validation.js';

import { roadRaceService } from '../../services/games/roadRace.service.js';

export async function getRoadRaceMission(req: AuthRequest, res: Response) {
  const params = gameParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ error: 'Invalid lesson ID' });
  }

  try {
    const mission = await roadRaceService.getMission(params.data.lessonId);
    return res.status(200).json({ data: mission });
  } catch (error) {
    console.error('Failed to get Road Race mission:', error);
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to get Road Race mission.',
    });
  }
}

export async function startRoadRaceGame(req: AuthRequest, res: Response) {
  const params = gameParamsSchema.safeParse(req.params);
  const body = roadRaceStartBodySchema
    .pick({ missionId: true, itemType: true })
    .safeParse(req.body);

  if (!params.success || !body.success) {
    return res.status(400).json({ error: 'Invalid game start parameters' });
  }

  try {
    const game = await roadRaceService.startGame(
      params.data.lessonId,
      req.user!.id,
      body.data.missionId,
      body.data.itemType,
    );

    return res.status(201).json({ data: game });
  } catch (error) {
    console.error('Failed to start Road Race game:', error);
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to start Road Race game.',
    });
  }
}

export async function getNextRoadRaceBatch(req: AuthRequest, res: Response) {
  const params = roadRaceSessionParamsSchema
    .pick({ sessionId: true })
    .safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ error: 'Invalid session ID' });
  }

  try {
    const batch = await roadRaceService.getNextBatch(
      params.data.sessionId,
      req.user!.id,
    );

    return res.status(200).json({ data: batch });
  } catch (error) {
    console.error('Failed to get next Road Race batch:', error);
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to get next Road Race batch.',
    });
  }
}

export async function completeRoadRaceGame(
  req: AuthRequest,
  res: Response,
) {
  const params = roadRaceSessionParamsSchema
    .pick({ sessionId: true })
    .safeParse(req.params);

  const body = roadRaceCompleteBodySchema.safeParse(req.body);

  if (!params.success || !body.success) {
    return res.status(400).json({
      error: 'Invalid game completion parameters',
    });
  }

  try {
    const result = await roadRaceService.completeGame(
      params.data.sessionId,
      req.user!.id,
      body.data,
    );

    return res.status(200).json({ data: result });
  } catch (error) {
    console.error('Failed to complete Road Race game:', error);

    return res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : 'Failed to complete Road Race game.',
    });
  }
}
