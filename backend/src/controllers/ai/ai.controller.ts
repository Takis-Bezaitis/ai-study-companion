import type { Request, Response } from 'express';

import { aiService } from '../../ai/ai.container.js';

import {
  generateTextSchema,
} from '../../validations/ai.validation.js';

export async function generateText(
  req: Request,
  res: Response,
) {
  const input = generateTextSchema.parse(req.body);

  const text = await aiService.generateText(input);

  return res.status(200).json({
    data: {
      text,
    },
  });
}