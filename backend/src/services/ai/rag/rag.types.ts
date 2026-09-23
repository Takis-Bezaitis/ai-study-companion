import type { RetrievedLessonChunk } from '../../../repositories/lessonChunk.repository.js';

export interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AskLessonInput {
  lessonId: string;
  question: string;
  history: ChatHistoryMessage[];
}

export interface AskLessonResult {
  answer: string;
  sources: RetrievedLessonChunk[];
}