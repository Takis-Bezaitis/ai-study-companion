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

function getAIErrorMessage(
  error: unknown,
): string {
  if (
    typeof error === 'object' &&
    error !== null
  ) {
    const candidate = error as {
      status?: number;
      code?: number;
      message?: string;
    };

    if (
      candidate.status === 429 ||
      candidate.code === 429 ||
      candidate.message?.includes('429')
    ) {
      return 'The AI is temporarily unavailable because the usage limit has been reached. Please try again later.';
    }

    if (
      candidate.status === 503 ||
      candidate.code === 503 ||
      candidate.message?.includes('503')
    ) {
      return 'The AI service is temporarily unavailable. Please try again later.';
    }
  }

  return 'Failed to generate AI response.';
}

export async function streamAskLesson(
  req: Request,
  res: Response,
) {
  console.log('[AI TIMING] streamAskLesson started');
  const requestStartedAt = performance.now();

  const input = askLessonSchema.parse({
    lessonId: req.params.lessonId,
    question: req.body.question,
    history: req.body.history,
  });

  const result =
    await ragService.streamLesson(input);

  console.log(
    `[AI TIMING] request → stream ready: ${Math.round(
      performance.now() - requestStartedAt,
    )} ms`,
  );

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
        message: getAIErrorMessage(error),
      });

      res.end();
    }

    throw error;
  }
}