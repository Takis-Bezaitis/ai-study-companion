import prisma from '../../lib/prismaClient.js';
import { AppError } from '../../utils/AppError.js';

import type {
  CreateCategory,
} from '../../validations/category.validation.js';

export async function createCategory(input: CreateCategory) {
  try {
    return await prisma.category.create({
      data: {
        name: input.name,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      throw new AppError('Category already exists', 409);
    }

    throw error;
  }
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });
}