-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('OPEN_QUESTION', 'ROAD_RACE');

-- CreateTable
CREATE TABLE "ActivityAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "activityType" "ActivityType" NOT NULL,
    "gameScore" INTEGER NOT NULL DEFAULT 0,
    "educationalScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "openQuestionEvaluationId" TEXT,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActivityAttempt_openQuestionEvaluationId_key" ON "ActivityAttempt"("openQuestionEvaluationId");

-- CreateIndex
CREATE INDEX "ActivityAttempt_userId_activityType_completedAt_idx" ON "ActivityAttempt"("userId", "activityType", "completedAt");

-- CreateIndex
CREATE INDEX "ActivityAttempt_lessonId_activityType_completedAt_idx" ON "ActivityAttempt"("lessonId", "activityType", "completedAt");

-- CreateIndex
CREATE INDEX "ActivityAttempt_activityType_gameScore_idx" ON "ActivityAttempt"("activityType", "gameScore");

-- AddForeignKey
ALTER TABLE "ActivityAttempt" ADD CONSTRAINT "ActivityAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityAttempt" ADD CONSTRAINT "ActivityAttempt_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityAttempt" ADD CONSTRAINT "ActivityAttempt_openQuestionEvaluationId_fkey" FOREIGN KEY ("openQuestionEvaluationId") REFERENCES "OpenQuestionEvaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
