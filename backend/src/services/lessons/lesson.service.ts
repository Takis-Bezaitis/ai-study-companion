import prisma from '../../lib/prismaClient.js';
import { AppError } from '../../utils/AppError.js';

import type {
  CreateLesson,
} from '../../validations/lesson.validation.js';

export async function createLesson(input: CreateLesson) {
  const category = await prisma.category.findUnique({
    where: {
      id: input.categoryId,
    },
  });

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  return prisma.lesson.create({
    data: {
      categoryId: input.categoryId,
      title: input.title,
      description: input.description ?? null,
    },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function getLessons() {
  return prisma.lesson.findMany({
    orderBy: {
      title: 'asc',
    },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function getLesson(lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!lesson) {
    throw new AppError('Lesson not found', 404);
  }

  return lesson;
}

export async function getLessonChunks(
  lessonId: string,
) {
  return prisma.lessonChunk.findMany({
    where: {
      lessonId,
    },
    orderBy: {
      chunkIndex: 'asc',
    },
    select: {
      id: true,
      content: true,
      sectionTitle: true,
      chunkIndex: true,
    },
  });
}