-- CreateTable
CREATE TABLE "OpenQuestion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "sectionTitle" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "referenceAnswer" TEXT NOT NULL,
    "evaluationCriteria" JSONB NOT NULL,
    "sourceChunkIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OpenQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenQuestionEvaluation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "feedback" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OpenQuestionEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OpenQuestion_userId_createdAt_idx" ON "OpenQuestion"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "OpenQuestion_lessonId_createdAt_idx" ON "OpenQuestion"("lessonId", "createdAt");

-- CreateIndex
CREATE INDEX "OpenQuestionEvaluation_userId_createdAt_idx" ON "OpenQuestionEvaluation"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "OpenQuestionEvaluation_questionId_createdAt_idx" ON "OpenQuestionEvaluation"("questionId", "createdAt");

-- AddForeignKey
ALTER TABLE "OpenQuestion" ADD CONSTRAINT "OpenQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenQuestion" ADD CONSTRAINT "OpenQuestion_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenQuestionEvaluation" ADD CONSTRAINT "OpenQuestionEvaluation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenQuestionEvaluation" ADD CONSTRAINT "OpenQuestionEvaluation_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "OpenQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
