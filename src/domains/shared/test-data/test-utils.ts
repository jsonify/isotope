// src/domains/shared/test-data/test-utils.ts
import { v4 as uuidv4 } from 'uuid';

import { TEST_PLAYER_PROFILES, TEST_PUZZLES, getElementBySymbol } from './index';
import type {
  PlayerProfile,
  Puzzle,
  GameMode,
  PuzzleResult,
  ElementSymbol,
  RewardResult,
} from '../models/domain-models';

/**
 * Create a custom test player profile with specified overrides
 */
export const createTestPlayerProfile = (overrides: Partial<PlayerProfile> = {}): PlayerProfile => {
  return {
    ...TEST_PLAYER_PROFILES.newPlayer,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};

/**
 * Create a custom test puzzle with specified overrides
 */
export const createTestPuzzle = (gameMode: GameMode, overrides: Partial<Puzzle> = {}): Puzzle => {
  const defaultPuzzle: Puzzle = {
    id: uuidv4(),
    type: gameMode,
    difficulty: 1,
    elements: ['H'],
    instructions: 'Complete this puzzle',
    completed: false,
    perfectSolve: false,
    attempts: 0,
  };

  const basePuzzle = TEST_PUZZLES[gameMode]?.[0] ?? defaultPuzzle;

  return {
    ...basePuzzle,
    id: uuidv4(),
    ...overrides,
  };
};

/**
 * Create a mock puzzle result
 */
export const createMockPuzzleResult = (
  puzzleId: string,
  playerId: string,
  score: number,
  isPerfect: boolean = false
): PuzzleResult => {
  return {
    puzzleId,
    playerId,
    score,
    timeTaken: Math.floor(Math.random() * 60) + 30, // Random time between 30-90 seconds
    dateCompleted: new Date(),
    isPerfect,
  };
};

/**
 * Create a mock reward result
 */
export const createMockReward = (
  electrons: number,
  atomicWeight: number,
  atomicNumber?: number
): RewardResult => {
  return {
    electrons,
    progressGain: {
      atomicWeight,
      ...(typeof atomicNumber === 'number' && { atomicNumber }),
    },
  };
};

/**
 * Generate a sequence of elements from a starting element
 */
export const generateElementSequence = (
  startElement: ElementSymbol,
  count: number
): ElementSymbol[] => {
  const result: ElementSymbol[] = [];
  const element = getElementBySymbol(startElement);
  let currentAtomicNumber = element?.atomicNumber ?? 1;

  for (let i = 0; i < count; i++) {
    // Explicitly check for the existence of atomicNumber
    const currentElement = getElementBySymbol(startElement);
    const isValidElement = typeof currentElement?.atomicNumber === 'number';

    result.push(isValidElement ? startElement : 'H');
    currentAtomicNumber++;

    // Get next element by atomic number
    const elements = Object.values(getElementBySymbol);
    if (!Array.isArray(elements)) {
      break;
    }

    const nextElement = elements.find(
      (el): el is NonNullable<typeof el> =>
        el !== null &&
        typeof el === 'object' &&
        typeof el.atomicNumber === 'number' &&
        el.atomicNumber === currentAtomicNumber &&
        typeof el.symbol === 'string'
    );

    // Fixed line: Explicit check for nextElement and its symbol property
    if (
      nextElement !== null &&
      nextElement !== undefined &&
      typeof nextElement.symbol === 'string'
    ) {
      startElement = nextElement.symbol as ElementSymbol;
    } else {
      break;
    }
  }

  return result;
};

/**
 * Simulate progress over time by generating a series of test data points
 */
export const simulatePlayerProgression = (
  days: number,
  startingProfile: PlayerProfile = TEST_PLAYER_PROFILES.newPlayer
): PlayerProfile[] => {
  const progression: PlayerProfile[] = [];
  let currentProfile = { ...startingProfile };

  // Generate a profile for each day
  for (let day = 0; day < days; day++) {
    // Simple progression logic - every 2 days we level up
    if (day > 0 && day % 2 === 0) {
      currentProfile = {
        ...currentProfile,
        level: {
          ...currentProfile.level,
          atomicNumber: currentProfile.level.atomicNumber + 1,
          atomicWeight: currentProfile.level.atomicWeight + 10,
        },
        electrons: currentProfile.electrons + 20,
        updatedAt: new Date(startingProfile.createdAt.getTime() + day * 86400000),
      };
    } else {
      // Just add some electrons and atomic weight
      currentProfile = {
        ...currentProfile,
        level: {
          ...currentProfile.level,
          atomicWeight: currentProfile.level.atomicWeight + 5,
        },
        electrons: currentProfile.electrons + 10,
        updatedAt: new Date(startingProfile.createdAt.getTime() + day * 86400000),
      };
    }

    progression.push({ ...currentProfile });
  }

  return progression;
};

export default {
  createTestPlayerProfile,
  createTestPuzzle,
  createMockPuzzleResult,
  createMockReward,
  generateElementSequence,
  simulatePlayerProgression,
};
