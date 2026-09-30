import type { GameItem, GameMission } from "./game.types";

export interface RoadRaceGame {
  mission: GameMission;
  itemType: string;
  correctItems: GameItem[];
  wrongItems: GameItem[];
}