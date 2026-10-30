export interface GameItem {
  id: string;
  name: string;
  isCorrect: boolean;
}

export interface GameMission {
  id: string;
  title: string;
  description: string | null;
  correctGroup: string;
  wrongGroup: string | null;
}

export interface GameSpawn {
  spawnId: string;
  gameItemId: string;
  name: string;
  isCorrect: boolean;
  signature: string;
}