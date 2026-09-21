import type { Request, Response } from 'express';

import {
  ragService,
} from '../../services/ai/rag/rag.service.js';

import {
  askLessonSchema,
} from '../../validations/ai.validation.js';

export async function askLesson(
  req: Request,
  res: Response,
) {
  const input = askLessonSchema.parse(
    req.body,
  );

  const result =
    await ragService.askLesson(input);

  return res.status(200).json({
    data: result,
  });
}