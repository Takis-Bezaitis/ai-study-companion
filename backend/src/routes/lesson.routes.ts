import { Router } from 'express';

import {
  createLesson,
  getLessons,
  getLesson,
} from '../controllers/lessons/lesson.controller.js';

import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', authMiddleware, createLesson);
router.get('/', authMiddleware, getLessons);
router.get('/:lessonId', authMiddleware, getLesson);

export default router;