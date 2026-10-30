CREATE EXTENSION IF NOT EXISTS vector;

-- Add sectionTitle as nullable first so existing rows can be preserved.
ALTER TABLE "LessonChunk"
ADD COLUMN "sectionTitle" TEXT;

-- Populate existing rows with a temporary value.
UPDATE "LessonChunk"
SET "sectionTitle" = '';

-- Make sectionTitle required after existing rows have been populated.
ALTER TABLE "LessonChunk"
ALTER COLUMN "sectionTitle" SET NOT NULL;

-- Add vector embeddings.
ALTER TABLE "LessonChunk"
ADD COLUMN "embedding" vector(1536);