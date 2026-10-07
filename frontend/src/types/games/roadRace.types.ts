import type { GameItem, GameMission } from "./game.types";

export interface RoadRaceGame {
  mission: GameMission;
  itemType: string;
  correctItems: GameItem[];
  wrongItems: GameItem[];
}

export type GameSprite = {
  itemId: string;
  name?: string;
  type: "lesson-item" | "scenery-item" | "enemy-car";
  isCorrect?: boolean;
  x: number;
  y: number;
  size: number;
  velocityX?: number;
};