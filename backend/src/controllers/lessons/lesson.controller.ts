import type { Request, Response } from 'express';
import { AppError } from '../../utils/AppError.js';

import {
  createLessonSchema,
} from '../../validations/lesson.validation.js';

import {
  createLesson as createLessonService,
  getLessons as getLessonsService,
  getLesson as getLessonService,
  getLessonChunks as getLessonChunksService,
} from '../../services/lessons/lesson.service.js';

export async function createLesson(
  req: Request,
  res: Response,
) {
  const input = createLessonSchema.parse(req.body);

  const lesson = await createLessonService(input);

  return res.status(201).json({
    data: lesson,
  });
}

export async function getLessons(
  _req: Request,
  res: Response,
) {
  const lessons = await getLessonsService();

  return res.status(200).json({
    data: lessons,
  });
}

export async function getLesson(
  req: Request,
  res: Response,
) {
  const lessonId = req.params.lessonId;

  if (typeof lessonId !== 'string') {
    throw new AppError('Invalid lesson ID', 400);
  }

  const lesson = await getLessonService(lessonId);

  return res.status(200).json({
    data: lesson,
  });
}

export async function getLessonChunks(
  req: Request,
  res: Response,
) {
  const lessonId = req.params.lessonId;

  if (typeof lessonId !== 'string') {
    return res.status(400).json({
      error: 'Invalid lesson ID',
    });
  }

  const chunks = await getLessonChunksService( lessonId, );

  return res.status(200).json({
    data: chunks,
  });
}