import { Router } from 'express';

import {
  generateText,
} from '../controllers/ai/ai.controller.js';

import {
  retrieveLesson,
} from '../controllers/ai/retrieval.controller.js';

import {
  askLesson,
} from '../controllers/ai/rag.controller.js';

import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.post(
  '/test',
  authMiddleware,
  generateText,
);

router.post(
  '/retrieval/test',
  authMiddleware,
  retrieveLesson,
);

router.post(
  '/rag/test',
  authMiddleware,
  askLesson,
);

export default router;