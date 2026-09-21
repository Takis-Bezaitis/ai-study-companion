import type { RetrievedLessonChunk } from '../../../repositories/lessonChunk.repository.js';

export interface AskLessonInput {
  lessonId: string;
  question: string;
}

export interface AskLessonResult {
  answer: string;
  sources: RetrievedLessonChunk[];
}