import { aiService } from '../../../ai/ai.container.js';

import {
  LessonChunkRepository,
  type RetrievedLessonChunk,
} from '../../../repositories/lessonChunk.repository.js';

export interface RetrieveLessonContextInput {
  lessonId: string;
  query: string;
  limit?: number;
}

export class RetrievalService {
  private readonly defaultLimit = 5;

  constructor(
    private readonly lessonChunkRepository: LessonChunkRepository,
  ) {}

  async retrieveLessonContext(input: RetrieveLessonContextInput,): Promise<RetrievedLessonChunk[]> {
    const embeddingStartedAt = performance.now();
    const embedding = await aiService.generateEmbedding({text: input.query, task: 'RETRIEVAL_QUERY',});

    console.log(
      `[AI TIMING] generateEmbedding: ${Math.round(
        performance.now() - embeddingStartedAt,
      )} ms`,
    );

    if (embedding.length === 0) {
      throw new Error(
        'Failed to generate query embedding.',
      );
    }

    const searchStartedAt = performance.now();

    const chunks =
      await this.lessonChunkRepository.searchSimilar({
        lessonId: input.lessonId,
        embedding,
        limit:
          input.limit ?? this.defaultLimit,
      });

    console.log(
      `[AI TIMING] searchSimilar: ${Math.round(
        performance.now() - searchStartedAt,
      )} ms`,
    );

    return chunks;
  }
}

export const retrievalService =
  new RetrievalService(
    new LessonChunkRepository(),
  );