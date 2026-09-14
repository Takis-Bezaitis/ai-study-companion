import { Router } from 'express';

import {
  createCategory,
  getCategories,
} from '../controllers/categories/category.controller.js';

import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', authMiddleware, createCategory);
router.get('/', authMiddleware, getCategories);

export default router;