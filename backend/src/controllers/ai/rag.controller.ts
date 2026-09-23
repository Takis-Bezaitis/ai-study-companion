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
  const input = askLessonSchema.parse({
    lessonId: req.params.lessonId,
    question: req.body.question,
    history: req.body.history,
  });

  const result = await ragService.askLesson(input);

  return res.status(200).json({
    data: result,
  });
}