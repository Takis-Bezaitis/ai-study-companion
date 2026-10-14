import { Router } from 'express';

import { createLesson, getLessons, getLesson, getLessonChunks, } from '../controllers/lessons/lesson.controller.js';
import { generateOpenQuestion, evaluateOpenQuestion, } from "../controllers/open-questions/open-question.controller.js";

import { authMiddleware } from '../middleware/authMiddleware.js';
import { askLesson, streamAskLesson } from '../controllers/ai/rag.controller.js';

const router = Router();

router.post('/', authMiddleware, createLesson);
router.get('/', authMiddleware, getLessons);
router.get('/:lessonId', authMiddleware, getLesson);
router.post('/:lessonId/ask', authMiddleware, askLesson);
router.post('/:lessonId/ask/stream', authMiddleware, streamAskLesson);
router.get('/:lessonId/chunks', authMiddleware, getLessonChunks);

router.post('/:lessonId/open-questions', authMiddleware, generateOpenQuestion);
router.post('/:lessonId/open-questions/:questionId/evaluate', authMiddleware, evaluateOpenQuestion);

export default router;