export type ApiResponse<T> = 
  | { data: T }
  | { error: string };

export interface User {
    id: string;
    email: string;
    name: string | null;
};

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export interface LessonCategory {
  id: string;
  name: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  category: LessonCategory;
}

export type LessonChunk = {
  id: string;
  content: string;
  sectionTitle: string;
  chunkIndex: number;
};

