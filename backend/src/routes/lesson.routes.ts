import { Router } from 'express';

import {
  createLesson,
  getLessons,
  getLesson,
  getLessonChunks,
} from '../controllers/lessons/lesson.controller.js';

import { authMiddleware } from '../middleware/authMiddleware.js';
import { askLesson } from '../controllers/ai/rag.controller.js';

const router = Router();

router.post('/', authMiddleware, createLesson);
router.get('/', authMiddleware, getLessons);
router.get('/:lessonId', authMiddleware, getLesson);
router.post('/:lessonId/ask', authMiddleware, askLesson);
router.get('/:lessonId/chunks', authMiddleware, getLessonChunks);

export default router;