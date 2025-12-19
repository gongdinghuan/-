
export type ElementType = 'FIRE' | 'WATER' | 'GRASS' | 'ELECTRIC' | 'NORMAL';

export interface Move {
  name: string;
  power: number;
  accuracy: number;
  type: ElementType;
  description: string;
}

export interface Monster {
  id: string;
  name: string;
  type: ElementType;
  level: number;
  maxHp: number;
  currentHp: number;
  attack: number;
  defense: number;
  speed: number;
  moves: Move[];
  imageUrl: string;
  experience: number;
}

export type GameState = 'OVERWORLD' | 'BATTLE' | 'POKEDEX' | 'MENU';

export interface BattleState {
  playerMonster: Monster;
  enemyMonster: Monster;
  turn: 'PLAYER' | 'ENEMY';
  isVictory: boolean;
  isDefeat: boolean;
  isCaptured: boolean;
  logs: string[];
}
