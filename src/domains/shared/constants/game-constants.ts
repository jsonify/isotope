// src/domains/shared/constants/game-constants.ts

import type {
  Element,
  ProgressThreshold,
  PlayerProfile,
  ElementSymbol,
} from '../models/domain-models';
import { ElectronSource, GameMode } from '../models/domain-models';
import { TEST_ELEMENTS, TEST_PROGRESSION_THRESHOLDS } from '../test-data';

// Periodic Table Data - Use our test elements
export const ELEMENTS_DATA: Element[] = TEST_ELEMENTS;

// Progression Thresholds - Use our test thresholds
export const PROGRESSION_THRESHOLDS: ProgressThreshold[] = TEST_PROGRESSION_THRESHOLDS;

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
  4: {
    name: 'Period 4',
    description: 'The fourth period contains the elements Potassium through Krypton.',
  },
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

// Game Difficulties
export const DIFFICULTY_SETTINGS = {
  baseValue: 1,
  elementMultiplier: 0.5,
  periodMultiplier: 1.5,
  maxDifficulty: 10,
};

// Game Mode Information
export const GAME_MODE_INFO: Record<
  GameMode,
  {
    name: string;
    description: string;
    unlockElement: ElementSymbol;
    timeLimit?: number;
  }
> = {
  [GameMode.TUTORIAL]: {
    name: 'Tutorial',
    description: 'Learn the basics of the game and chemistry concepts.',
    unlockElement: 'H',
  },
  [GameMode.ELEMENT_MATCH]: {
    name: 'Element Match',
    description: 'Match elements with their properties and characteristics.',
    unlockElement: 'H',
    timeLimit: 60,
  },
  [GameMode.PERIODIC_SORT]: {
    name: 'Periodic Sort',
    description: 'Arrange elements in the correct order based on atomic number.',
    unlockElement: 'Li',
    timeLimit: 45,
  },
  [GameMode.ELECTRON_SHELL]: {
    name: 'Electron Shell',
    description: 'Build the correct electron configuration for elements.',
    unlockElement: 'Ne',
  },
  [GameMode.COMPOUND_BUILD]: {
    name: 'Compound Build',
    description: 'Create chemical compounds by combining elements.',
    unlockElement: 'Ar',
  },
  [GameMode.ELEMENT_QUIZ]: {
    name: 'Element Quiz',
    description: 'Test your knowledge of element properties.',
    unlockElement: 'K',
    timeLimit: 120,
  },
  [GameMode.REACTION_BALANCE]: {
    name: 'Reaction Balance',
    description: 'Balance chemical equations with the right coefficients.',
    unlockElement: 'Ca',
  },
  [GameMode.ORBITAL_PUZZLE]: {
    name: 'Orbital Puzzle',
    description: 'Fill electron orbitals following quantum mechanics rules.',
    unlockElement: 'Ca',
  },
  [GameMode.ISOTOPE_BUILDER]: {
    name: 'Isotope Builder',
    description: 'Construct isotopes by adding the right number of neutrons.',
    unlockElement: 'Ca',
  },
  [GameMode.ELECTRON_FLOW]: {
    name: 'Electron Flow',
    description: 'Guide electrons through energy levels and orbitals.',
    unlockElement: 'Ca',
  },
};

// Achievement definitions
export const ACHIEVEMENT_DEFINITIONS = {
  tutorial_complete: {
    id: 'achievement_tutorial',
    name: 'First Steps',
    description: 'Complete the tutorial',
    category: 'progression',
    electronReward: 10,
  },
  element_first: {
    id: 'achievement_first_element',
    name: 'Element Unlocked',
    description: 'Unlock your first new element',
    category: 'progression',
    electronReward: 15,
  },
  period1_complete: {
    id: 'achievement_period1',
    name: 'Period 1 Master',
    description: 'Unlock all elements in period 1',
    category: 'progression',
    electronReward: 25,
  },
  // Additional achievements would be defined here
};
