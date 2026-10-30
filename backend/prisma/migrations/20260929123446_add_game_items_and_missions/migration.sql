-- CreateTable
CREATE TABLE "GameItem" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "group" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameMission" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "correctGroup" TEXT NOT NULL,
    "wrongGroup" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameMission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GameItem_lessonId_idx" ON "GameItem"("lessonId");

-- CreateIndex
CREATE INDEX "GameItem_lessonId_type_idx" ON "GameItem"("lessonId", "type");

-- CreateIndex
CREATE INDEX "GameItem_lessonId_type_group_idx" ON "GameItem"("lessonId", "type", "group");

-- CreateIndex
CREATE INDEX "GameMission_lessonId_idx" ON "GameMission"("lessonId");

-- AddForeignKey
ALTER TABLE "GameItem" ADD CONSTRAINT "GameItem_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameMission" ADD CONSTRAINT "GameMission_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
