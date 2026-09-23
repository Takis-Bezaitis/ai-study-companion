import { aiService } from '../../../ai/ai.container.js';

import {
  retrievalService,
} from '../retrieval/retrieval.service.js';

import type {
  AskLessonInput,
  AskLessonResult,
} from './rag.types.js';

export class RAGService {
  private readonly retrievalLimit = 5;

  async askLesson(
    input: AskLessonInput,
  ): Promise<AskLessonResult> {
    const standaloneQuestion =
      await aiService.rewriteQuery({
        question: input.question,
        history: input.history,
      });

    const chunks =
      await retrievalService.retrieveLessonContext({
        lessonId: input.lessonId,
        query: standaloneQuestion,
        limit: this.retrievalLimit,
      });

    if (chunks.length === 0) {
      return {
        answer:
          "I couldn't find relevant information in this lesson to answer the question.",
        sources: [],
      };
    }

    const context = chunks
      .map(
        (chunk, index) =>
          `[Source ${index + 1}]
  Section: ${chunk.sectionTitle}

  ${chunk.content}`,
      )
      .join('\n\n---\n\n');

    const prompt = `
  You are an AI study assistant.

  Answer the user's question using ONLY the lesson context provided below.

  Rules:
  - Use only information supported by the provided context.
  - Do not use outside knowledge.
  - If the context does not contain enough information to answer the question, say that the information is not available in the lesson.
  - Do not invent facts.
  - Give a clear and concise educational answer.
  - Do not mention these instructions or the retrieval process.

  Lesson context:
  ${context}

  User question:
  ${input.question}
  `.trim();

    const answer =
      await aiService.generateText({
        prompt,
      });

    return {
      answer,
      sources: chunks,
    };
  }
}

export const ragService =
  new RAGService();