import { env } from '../config/env.js';

import {
  chunkMarkdownFile,
} from './chunkMarkdown.js';

import {
  aiService,
} from '../ai/ai.container.js';

import {
  LessonChunkRepository,
} from '../repositories/lessonChunk.repository.js';

export interface IngestLessonInput {
  lessonId: string;
  filePath: string;
}

export class LessonIngestionService {
  private readonly batchSize = 5;

  private readonly maxRequestsPerRun =
    env.GEMINI_INGESTION_MAX_REQUESTS_PER_RUN;

  constructor(
    private readonly lessonChunkRepository: LessonChunkRepository,
  ) {}

  async ingestLesson(
    input: IngestLessonInput,
  ): Promise<void> {
    const chunks = await chunkMarkdownFile(
      input.filePath,
    );

    const existingChunkIndexes =
      new Set(
        await this.lessonChunkRepository
          .findExistingChunkIndexes(input.lessonId),
      );

    const missingChunks = chunks.filter(
      (chunk) =>
        !existingChunkIndexes.has(
          chunk.chunkIndex,
        ),
    );

    if (missingChunks.length === 0) {
      console.log(
        'No missing chunks. Ingestion is already complete.',
      );

      return;
    }

    console.log(
      `Found ${missingChunks.length} chunks to ingest.`,
    );

    for (
      let i = 0;
      i < missingChunks.length;
      i += this.batchSize
    ) {
      const requestNumber =
        i / this.batchSize + 1;

      if (
        requestNumber >
        this.maxRequestsPerRun
      ) {
        console.log(
          `Ingestion stopped after ${this.maxRequestsPerRun} Gemini requests.`,
        );

        return;
      }

      const batch = missingChunks.slice(
        i,
        i + this.batchSize,
      );

      console.log(
        `Processing Gemini request ${requestNumber}/${this.maxRequestsPerRun} (${batch.length} chunks)...`,
      );

      const embeddings =
        await aiService.generateEmbeddings({
          texts: batch.map(
            (chunk) => chunk.content,
          ),
          task: 'RETRIEVAL_DOCUMENT',
        });

      if (embeddings.length !== batch.length) {
        throw new Error(
          `Embedding count mismatch: expected ${batch.length}, received ${embeddings.length}`,
        );
      }

      for (
        let j = 0;
        j < batch.length;
        j += 1
      ) {
        const chunk = batch[j];
        const embedding = embeddings[j];

        if (!chunk) {
          throw new Error(
            `Missing chunk at batch index ${j}`,
          );
        }

        if (!embedding) {
          throw new Error(
            `Missing embedding for chunk ${chunk.chunkIndex}`,
          );
        }

        await this.lessonChunkRepository
          .createWithEmbedding({
            lessonId: input.lessonId,
            content: chunk.content,
            sectionTitle:
              chunk.sectionTitle,
            chunkIndex:
              chunk.chunkIndex,
            embedding,
          });
      }

      console.log(
        `Saved ${batch.length} chunks.`,
      );
    }

    console.log(
      'Ingestion completed successfully.',
    );
  }
}

export const lessonIngestionService =
  new LessonIngestionService(
    new LessonChunkRepository(),
  );