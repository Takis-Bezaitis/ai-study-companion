import { Router } from 'express';

import {
  generateText,
} from '../controllers/ai/ai.controller.js';

import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.post(
  '/test',
  authMiddleware,
  generateText,
);

export default router;