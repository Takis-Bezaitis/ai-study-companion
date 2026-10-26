/*
  Warnings:

  - Added the required column `gameType` to the `GameMission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameMission" ADD COLUMN     "gameType" "GameType" NOT NULL DEFAULT 'ROAD_RACE';
