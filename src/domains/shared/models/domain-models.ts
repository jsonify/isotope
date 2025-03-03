// src/domains/shared/models/domain-models.ts

// Element-related types
export type ElementSymbol =
  | 'H'
  | 'He'
  | 'Li'
  | 'Be'
  | 'B'
  | 'C'
  | 'N'
  | 'O'
  | 'F'
  | 'Ne'
  | 'Na'
  | 'Mg'
  | 'Al'
  | 'Si'
  | 'P'
  | 'S'
  | 'Cl'
  | 'Ar'
  | 'K'
  | 'Ca'; // Add more as needed

export interface Element {
  symbol: ElementSymbol;
  name: string;
  atomicNumber: number;
  atomicWeight: number;
  period: number;
  group: number;
  description?: string;
  imageUrl?: string;
}

/**
 * Represents a player's progression level in the game.
 * Follows the AN-AW-GL format tracking system.
 */
export interface PlayerLevel {
  /**
   * Atomic Number (AN) - Tracks the player's overall element progression.
   * Corresponds to the atomic number of the current element.
   * Range: 0-118 (max elements in periodic table)
   */
  atomicNumber: number;

  /**
   * Atomic Weight (AW) - Tracks puzzles completed for progression.
   * Players need to accumulate AW points to advance to the next element.
   * Resets when advancing to a new element.
   */
  atomicWeight: number;

  /**
   * Game Lab (GL) - Tracks unlocked game modes.
   * Increases when advancing to a new period of the periodic table.
   * Used to determine which game modes are available.
   */
  gameLab: number;
}

export interface PlayerProfile {
  id: string;
  displayName: string;
  level: PlayerLevel;
  currentElement: ElementSymbol;
  electrons: number;
  unlockedGames: GameMode[];
  achievements: Achievement[];
  lastLogin: Date;
  tutorialCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlayerProgress {
  currentElement: ElementSymbol;
  totalPuzzlesCompleted: number;
  puzzlesCompletedTowardNext: number;
  puzzlesRequiredForNext: number;
  percentToNextElement: number;
  currentPeriod: number;
  elementsInCurrentPeriod: ElementSymbol[];
  periodsUnlocked: number;
}

export interface ProgressThreshold {
  fromElement: ElementSymbol;
  toElement: ElementSymbol;
  puzzlesRequired: number;
  unlocksFeature?: string;
}

// Puzzle domain models
export enum GameMode {
  TUTORIAL = 0,
  ELEMENT_MATCH = 1,
  PERIODIC_SORT = 2,
  ELECTRON_SHELL = 3,
  COMPOUND_BUILD = 4,
  ELEMENT_QUIZ = 5,
  REACTION_BALANCE = 6,
  ORBITAL_PUZZLE = 7,
  ISOTOPE_BUILDER = 8,
  ELECTRON_FLOW = 9,
}

export interface Puzzle {
  id: string;
  type: GameMode;
  difficulty: number;
  elements: ElementSymbol[];
  instructions: string;
  timeLimit?: number;
  completed: boolean;
  perfectSolve: boolean;
  attempts: number;
}

export interface PuzzleResult {
  puzzleId: string;
  playerId: string;
  score: number;
  timeTaken: number;
  dateCompleted: Date;
  isPerfect: boolean;
}

// Economy domain models
export enum ElectronSource {
  TUTORIAL_COMPLETION = 'tutorial',
  PUZZLE_COMPLETION = 'puzzle',
  DAILY_LOGIN = 'daily',
  ACHIEVEMENT = 'achievement',
  PERFECT_SOLVE = 'perfect',
}

export interface ElectronTransaction {
  id: string;
  playerId: string;
  amount: number;
  source: ElectronSource;
  timestamp: Date;
  balance: number;
  description?: string;
}

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'hint' | 'powerup' | 'gameUnlock' | 'cosmetic';
  gameMode?: GameMode;
  imageUrl?: string;
}

export interface RewardResult {
  electrons: number;
  unlockedItems?: StoreItem[];
  progressGain: {
    atomicWeight: number;
    atomicNumber?: number;
    gameLab?: number;
  };
  achievement?: Achievement;
}

// Achievement system

export interface Achievement {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  dateUnlocked: Date;
  category: 'progression' | 'puzzle' | 'collection' | 'special';
  electronReward: number;
}

// Configuration models
export interface GameConfig {
  electronRewards: {
    [key in ElectronSource]: number;
  };
  gameUnlockCosts: {
    [key in GameMode]?: number;
  };
  elementThresholds: ProgressThreshold[];
  difficultyScaling: {
    baseValue: number;
    atomicNumberMultiplier: number;
    maxDifficulty: number;
  };
}
