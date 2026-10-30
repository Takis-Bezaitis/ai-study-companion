import { aiService } from '../ai/ai.container.js';

import {
  chunkMarkdownFile,
  type MarkdownChunk,
} from './chunkMarkdown.js';

export interface EmbeddedMarkdownChunk extends MarkdownChunk {
  embedding: number[];
}

export async function embedMarkdownFile(
  filePath: string,
  batchSize = 5,
): Promise<EmbeddedMarkdownChunk[]> {
  const chunks = await chunkMarkdownFile(filePath);

  const embeddedChunks: EmbeddedMarkdownChunk[] = [];

  for (
    let i = 0;
    i < chunks.length;
    i += batchSize
  ) {
    const batch = chunks.slice(i, i + batchSize);

    const embeddings = await aiService.generateEmbeddings({
      texts: batch.map((chunk) => chunk.content),
      task: 'RETRIEVAL_DOCUMENT',
    });

    if (embeddings.length !== batch.length) {
      throw new Error(
        `Embedding count mismatch: expected ${batch.length}, received ${embeddings.length}`,
      );
    }

    for (let j = 0; j < batch.length; j += 1) {
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

      embeddedChunks.push({
        content: chunk.content,
        sectionTitle: chunk.sectionTitle,
        chunkIndex: chunk.chunkIndex,
        embedding,
      });
    }
  }

  return embeddedChunks;
}