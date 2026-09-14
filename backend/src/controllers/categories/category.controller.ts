import type { Request, Response } from 'express';

import {
  createCategorySchema,
} from '../../validations/category.validation.js';

import {
  createCategory as createCategoryService,
  getCategories as getCategoriesService,
} from '../../services/categories/category.service.js';

export async function createCategory(
  req: Request,
  res: Response,
) {
  const input = createCategorySchema.parse(req.body);

  const category = await createCategoryService(input);

  return res.status(201).json({
    data: category,
  });
}

export async function getCategories(
  _req: Request,
  res: Response,
) {
  const categories = await getCategoriesService();

  return res.status(200).json({
    data: categories,
  });
}