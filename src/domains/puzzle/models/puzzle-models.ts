// src/domains/puzzle/models/puzzle-models.ts

import type { ElementSymbol } from '../../../domains/shared/models/domain-models';

/**
 * Enum for the different game modes available in Isotope
 */
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

/**
 * Core puzzle interface that all game puzzles implement
 */
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

/**
 * Interface for tracking puzzle results
 */
export interface PuzzleResult {
  puzzleId: string;
  playerId: string;
  score: number;
  timeTaken: number;
  dateCompleted: Date;
  isPerfect: boolean;
}

/**
 * Base interface for specific puzzle type data
 */
export interface PuzzleData {
  puzzleId: string;
  gameMode: GameMode;
}

/**
 * Tutorial puzzle specific data
 */
export interface TutorialPuzzleData extends PuzzleData {
  gameMode: GameMode.TUTORIAL;
  step: number;
  totalSteps: number;
  concept: string;
}

/**
 * Element match puzzle specific data
 */
export interface ElementMatchPuzzleData extends PuzzleData {
  gameMode: GameMode.ELEMENT_MATCH;
  elementSymbols: ElementSymbol[];
  propertyToMatch: 'atomicNumber' | 'period' | 'group' | 'atomicWeight';
}

/**
 * Periodic sort puzzle specific data
 */
export interface PeriodicSortPuzzleData extends PuzzleData {
  gameMode: GameMode.PERIODIC_SORT;
  elementSymbols: ElementSymbol[];
  sortDirection: 'ascending' | 'descending';
  sortProperty: 'atomicNumber' | 'atomicWeight';
}

/**
 * Electron shell puzzle specific data
 */
export interface ElectronShellPuzzleData extends PuzzleData {
  gameMode: GameMode.ELECTRON_SHELL;
  elementSymbol: ElementSymbol;
  shellConfiguration: number[];
}

/**
 * Compound build puzzle specific data
 */
export interface CompoundBuildPuzzleData extends PuzzleData {
  gameMode: GameMode.COMPOUND_BUILD;
  targetCompound: string;
  availableElements: ElementSymbol[];
}

/**
 * Type guard to check if puzzle data is for a specific game mode
 */
export function isPuzzleDataForGameMode<T extends PuzzleData>(
  data: PuzzleData,
  gameMode: GameMode
): data is T {
  return data.gameMode === gameMode;
}

/**
 * Puzzle difficulty calculation parameters
 */
export interface DifficultyParams {
  baseValue: number;
  atomicNumberMultiplier: number;
  maxDifficulty: number;
}

/**
 * Options for generating puzzles
 */
export interface PuzzleGenerationOptions {
  gameMode: GameMode;
  difficulty?: number;
  elementSymbols?: ElementSymbol[];
  count?: number;
  timeLimit?: number;
}
