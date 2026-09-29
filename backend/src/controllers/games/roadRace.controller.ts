import type { Request, Response } from 'express';

import { roadRaceParamsSchema } from '../../validations/roadRace.validation.js';
import { roadRaceService } from '../../services/games/roadRace.service.js';

export async function createRoadRaceGame(
  req: Request,
  res: Response,
) {
  const params =
    roadRaceParamsSchema.safeParse(
      req.params,
    );

  if (!params.success) {
    return res.status(400).json({
      error: 'Invalid lesson ID',
    });
  }

  try {
    const game =
      await roadRaceService.createGame(
        params.data.lessonId,
      );

    return res.status(200).json({
      data: game,
    });
  } catch (error) {
    console.error(
      'Failed to create Road Race game:',
      error,
    );

    return res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create Road Race game.',
    });
  }
}