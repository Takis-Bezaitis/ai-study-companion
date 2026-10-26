/*
  Warnings:

  - A unique constraint covering the columns `[gameSessionId]` on the table `ActivityAttempt` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('ROAD_RACE');

-- CreateEnum
CREATE TYPE "GameSessionStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ABANDONED');

-- AlterTable
ALTER TABLE "ActivityAttempt" ADD COLUMN     "gameSessionId" TEXT;

-- CreateTable
CREATE TABLE "GameSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "gameType" "GameType" NOT NULL,
    "status" "GameSessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameSessionSpawn" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "gameItemId" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "signature" TEXT NOT NULL,
    "spawnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "elapsedMs" INTEGER,

    CONSTRAINT "GameSessionSpawn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GameSession_userId_status_idx" ON "GameSession"("userId", "status");

-- CreateIndex
CREATE INDEX "GameSession_lessonId_gameType_status_idx" ON "GameSession"("lessonId", "gameType", "status");

-- CreateIndex
CREATE INDEX "GameSessionSpawn_sessionId_resolvedAt_idx" ON "GameSessionSpawn"("sessionId", "resolvedAt");

-- CreateIndex
CREATE INDEX "GameSessionSpawn_gameItemId_idx" ON "GameSessionSpawn"("gameItemId");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityAttempt_gameSessionId_key" ON "ActivityAttempt"("gameSessionId");

-- AddForeignKey
ALTER TABLE "ActivityAttempt" ADD CONSTRAINT "ActivityAttempt_gameSessionId_fkey" FOREIGN KEY ("gameSessionId") REFERENCES "GameSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSessionSpawn" ADD CONSTRAINT "GameSessionSpawn_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "GameSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSessionSpawn" ADD CONSTRAINT "GameSessionSpawn_gameItemId_fkey" FOREIGN KEY ("gameItemId") REFERENCES "GameItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
