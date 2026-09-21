import type { Request, Response } from 'express';

import {
  retrievalService,
} from '../../services/ai/retrieval/retrieval.service.js';

import {
  retrieveLessonSchema,
} from '../../validations/ai.validation.js';

export async function retrieveLesson(
  req: Request,
  res: Response,
) {
  const input = retrieveLessonSchema.parse(
    req.body,
  );

  const chunks =
    await retrievalService.retrieveLessonContext({
      lessonId: input.lessonId,
      query: input.query,
      ...(input.limit !== undefined
        ? { limit: input.limit }
        : {}),
    });

  return res.status(200).json({
    data: {
      chunks,
    },
  });
}