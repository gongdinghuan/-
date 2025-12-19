
import { Monster, Move, ElementType } from './types';

export const TYPE_COLORS: Record<ElementType, string> = {
  FIRE: 'bg-red-500',
  WATER: 'bg-blue-500',
  GRASS: 'bg-green-500',
  ELECTRIC: 'bg-yellow-400',
  NORMAL: 'bg-gray-400',
};

export const MOVES: Record<string, Move> = {
  TACKLE: { name: 'Tackle', power: 40, accuracy: 100, type: 'NORMAL', description: 'A basic physical attack.' },
  EMBER: { name: 'Ember', power: 40, accuracy: 100, type: 'FIRE', description: 'Small flames hit the target.' },
  WATER_GUN: { name: 'Water Gun', power: 40, accuracy: 100, type: 'WATER', description: 'A blast of water.' },
  VINE_WHIP: { name: 'Vine Whip', power: 45, accuracy: 100, type: 'GRASS', description: 'Strikes with vines.' },
  THUNDER_SHOCK: { name: 'Thunder Shock', power: 40, accuracy: 100, type: 'ELECTRIC', description: 'A jolting shock.' },
};

export const INITIAL_MONSTERS: Monster[] = [
  {
    id: '1',
    name: 'Pyrolin',
    type: 'FIRE',
    level: 5,
    maxHp: 45,
    currentHp: 45,
    attack: 49,
    defense: 49,
    speed: 45,
    moves: [MOVES.TACKLE, MOVES.EMBER],
    imageUrl: 'https://picsum.photos/seed/pyrolin/200/200',
    experience: 0,
  },
  {
    id: '2',
    name: 'Aquafin',
    type: 'WATER',
    level: 5,
    maxHp: 44,
    currentHp: 44,
    attack: 48,
    defense: 65,
    speed: 43,
    moves: [MOVES.TACKLE, MOVES.WATER_GUN],
    imageUrl: 'https://picsum.photos/seed/aquafin/200/200',
    experience: 0,
  },
  {
    id: '3',
    name: 'Leafox',
    type: 'GRASS',
    level: 5,
    maxHp: 45,
    currentHp: 45,
    attack: 49,
    defense: 49,
    speed: 45,
    moves: [MOVES.TACKLE, MOVES.VINE_WHIP],
    imageUrl: 'https://picsum.photos/seed/leafox/200/200',
    experience: 0,
  },
];

export const WILD_MONSTERS: Monster[] = [
  {
    id: 'w1',
    name: 'Sparky',
    type: 'ELECTRIC',
    level: 3,
    maxHp: 35,
    currentHp: 35,
    attack: 55,
    defense: 40,
    speed: 90,
    moves: [MOVES.TACKLE, MOVES.THUNDER_SHOCK],
    imageUrl: 'https://picsum.photos/seed/sparky/200/200',
    experience: 0,
  },
  {
    id: 'w2',
    name: 'Grom',
    type: 'NORMAL',
    level: 4,
    maxHp: 50,
    currentHp: 50,
    attack: 45,
    defense: 50,
    speed: 30,
    moves: [MOVES.TACKLE],
    imageUrl: 'https://picsum.photos/seed/grom/200/200',
    experience: 0,
  },
];
