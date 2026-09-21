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

  async retrieveLessonContext(
    input: RetrieveLessonContextInput,
  ): Promise<RetrievedLessonChunk[]> {
    const embedding =
      await aiService.generateEmbedding({
        text: input.query,
        task: 'RETRIEVAL_QUERY',
      });

    if (embedding.length === 0) {
      throw new Error(
        'Failed to generate query embedding.',
      );
    }

    return this.lessonChunkRepository.searchSimilar({
      lessonId: input.lessonId,
      embedding,
      limit:
        input.limit ?? this.defaultLimit,
    });
  }
}

export const retrievalService =
  new RetrievalService(
    new LessonChunkRepository(),
  );