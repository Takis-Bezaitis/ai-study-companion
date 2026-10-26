
import type { GameMission, GameSpawn } from "./game.types";

export interface RoadRaceGame {
  sessionId: string;
  startedAt: string;
  mission: GameMission;
  itemType: string;
  items: GameSpawn[];
}

export type GameSprite = {
  itemId: string;
  spawnId?: string;
  name?: string;
  type: "lesson-item" | "scenery-item" | "enemy-car";
  isCorrect?: boolean;
  signature?: string;
  x: number;
  y: number;
  size: number;
  velocityX?: number;
};
