// src/domains/shared/constants/game-constants.ts

import type { Element, ProgressThreshold, PlayerProfile } from '../models/domain-models';
import { ElectronSource, GameMode } from '../models/domain-models';

// Periodic Table Data
export const ELEMENTS_DATA: Element[] = [
  {
    symbol: 'H',
    name: 'Hydrogen',
    atomicNumber: 1,
    atomicWeight: 1.008,
    period: 1,
    group: 1,
    description: 'The lightest and most abundant chemical element in the universe.',
  },
  {
    symbol: 'He',
    name: 'Helium',
    atomicNumber: 2,
    atomicWeight: 4.0026,
    period: 1,
    group: 18,
    description: 'A colorless, odorless, tasteless, non-toxic, inert, monatomic gas.',
  },
  {
    symbol: 'Li',
    name: 'Lithium',
    atomicNumber: 3,
    atomicWeight: 6.94,
    period: 2,
    group: 1,
    description: 'A soft, silvery-white alkali metal that is highly reactive.',
  },
  // Add remaining elements...
];

// Progression Thresholds
export const PROGRESSION_THRESHOLDS: ProgressThreshold[] = [
  {
    fromElement: 'H',
    toElement: 'He',
    puzzlesRequired: 4,
    unlocksFeature: 'Basic element properties',
  },
  {
    fromElement: 'He',
    toElement: 'Li',
    puzzlesRequired: 6,
    unlocksFeature: 'Period 2 elements',
  },
  // Add remaining thresholds...
];

// Electron Rewards Configuration
export const ELECTRON_REWARDS: Record<ElectronSource, number> = {
  [ElectronSource.TUTORIAL_COMPLETION]: 10,
  [ElectronSource.PUZZLE_COMPLETION]: 5,
  [ElectronSource.DAILY_LOGIN]: 3,
  [ElectronSource.ACHIEVEMENT]: 20,
  [ElectronSource.PERFECT_SOLVE]: 5,
};

// Game Mode Unlock Costs
export const GAME_UNLOCK_COSTS: Partial<Record<GameMode, number>> = {
  [GameMode.TUTORIAL]: 0, // Free
  [GameMode.ELEMENT_MATCH]: 0, // Free
  [GameMode.PERIODIC_SORT]: 0, // Free with Li unlocked
  [GameMode.ELECTRON_SHELL]: 0, // Free with Ne unlocked
  [GameMode.COMPOUND_BUILD]: 0, // Free with Ar unlocked
  [GameMode.ELEMENT_QUIZ]: 50,
  [GameMode.REACTION_BALANCE]: 75,
  [GameMode.ORBITAL_PUZZLE]: 100,
  [GameMode.ISOTOPE_BUILDER]: 150,
  [GameMode.ELECTRON_FLOW]: 200,
};

// Period Information
export const PERIOD_INFO: Record<number, { name: string; description: string }> = {
  1: {
    name: 'Period 1',
    description: 'The first period contains only two elements: Hydrogen and Helium.',
  },
  2: {
    name: 'Period 2',
    description: 'The second period contains the elements Lithium through Neon.',
  },
  3: {
    name: 'Period 3',
    description: 'The third period contains the elements Sodium through Argon.',
  },
  // Add more periods as needed
};

// Initial Player Profile
export const INITIAL_PLAYER_PROFILE: Omit<PlayerProfile, 'id'> = {
  displayName: 'New Scientist',
  level: {
    atomicNumber: 0,
    atomicWeight: 0,
    gameLab: 0,
  },
  currentElement: 'H' as ElementSymbol,
  electrons: 0,
  unlockedGames: [GameMode.TUTORIAL],
  achievements: [],
  lastLogin: new Date(),
  tutorialCompleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};
