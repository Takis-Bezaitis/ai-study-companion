/*
  Warnings:

  - Added the required column `itemType` to the `GameSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `missionId` to the `GameSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameMission" ALTER COLUMN "gameType" DROP DEFAULT;

-- AlterTable
ALTER TABLE "GameSession" ADD COLUMN     "itemType" TEXT NOT NULL,
ADD COLUMN     "missionId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "GameMission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
