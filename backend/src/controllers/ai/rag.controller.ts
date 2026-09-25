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

export async function streamAskLesson(
  req: Request,
  res: Response,
) {
  const input = askLessonSchema.parse({
    lessonId: req.params.lessonId,
    question: req.body.question,
    history: req.body.history,
  });

  const result =
    await ragService.streamLesson(input);

  res.status(200);

  res.setHeader(
    'Content-Type',
    'text/event-stream; charset=utf-8',
  );

  res.setHeader(
    'Cache-Control',
    'no-cache, no-transform',
  );

  res.setHeader(
    'Connection',
    'keep-alive',
  );

  res.flushHeaders();

  const sendEvent = (
    event: string,
    data: unknown,
  ) => {
    res.write(
      `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`,
    );
  };

  sendEvent('sources', {
    sources: result.sources,
  });

  try {
    for await (const chunk of result.stream) {
      if (res.writableEnded) {
        break;
      }

      sendEvent('delta', {
        text: chunk,
      });
    }

    if (!res.writableEnded) {
      sendEvent('done', {});
      res.end();
    }
  } catch (error) {
    if (!res.writableEnded) {
      sendEvent('error', {
        message:
          'Failed to generate AI response.',
      });

      res.end();
    }

    throw error;
  }
}