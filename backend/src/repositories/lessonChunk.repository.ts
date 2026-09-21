import prisma from "../lib/prismaClient.js";

export interface CreateLessonChunkInput {
  lessonId: string;
  content: string;
  sectionTitle: string;
  chunkIndex: number;
  embedding: number[];
}

export interface SearchSimilarChunksInput {
  lessonId: string;
  embedding: number[];
  limit: number;
}

export interface RetrievedLessonChunk {
  id: string;
  content: string;
  sectionTitle: string;
  chunkIndex: number;
  similarity: number;
}

export class LessonChunkRepository {
  async findExistingChunkIndexes(
    lessonId: string,
  ): Promise<number[]> {
    const chunks = await prisma.$queryRaw<
      { chunkIndex: number }[]
    >`
      SELECT "chunkIndex"
      FROM "LessonChunk"
      WHERE "lessonId" = ${lessonId}
        AND "embedding" IS NOT NULL
      ORDER BY "chunkIndex" ASC
    `;

    return chunks.map(
      (chunk) => chunk.chunkIndex,
    );
  }

  async createWithEmbedding(
    input: CreateLessonChunkInput,
  ): Promise<void> {
    const vector = `[${input.embedding.join(',')}]`;

    await prisma.$executeRaw`
      INSERT INTO "LessonChunk" (
        "id",
        "lessonId",
        "content",
        "sectionTitle",
        "chunkIndex",
        "embedding",
        "createdAt"
      )
      VALUES (
        gen_random_uuid(),
        ${input.lessonId},
        ${input.content},
        ${input.sectionTitle},
        ${input.chunkIndex},
        ${vector}::vector,
        NOW()
      )
      ON CONFLICT ("lessonId", "chunkIndex")
      DO UPDATE SET
        "content" = EXCLUDED."content",
        "sectionTitle" = EXCLUDED."sectionTitle",
        "embedding" = EXCLUDED."embedding"
    `;
  }

  async searchSimilar(
    input: SearchSimilarChunksInput,
  ): Promise<RetrievedLessonChunk[]> {
    const vector = `[${input.embedding.join(',')}]`;

    const chunks = await prisma.$queryRaw<
      RetrievedLessonChunk[]
    >`
      SELECT
        "id",
        "content",
        "sectionTitle",
        "chunkIndex",
        1 - ("embedding" <=> ${vector}::vector) AS "similarity"
      FROM "LessonChunk"
      WHERE "lessonId" = ${input.lessonId}
        AND "embedding" IS NOT NULL
      ORDER BY "embedding" <=> ${vector}::vector
      LIMIT ${input.limit}
    `;

    return chunks;
  }
}