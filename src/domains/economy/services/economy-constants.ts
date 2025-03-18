/**
 * Base reward for completing any puzzle
 */
export const BASE_REWARD = 10;

/**
 * Difficulty level multipliers for reward calculations
 */
export const DIFFICULTY_MULTIPLIERS = {
  EASY: 1,
  MEDIUM: 1.5,
  HARD: 2,
} as const;

/**
 * Multiplier applied for perfect puzzle solutions
 */
export const PERFECT_SOLVE_MULTIPLIER = 1.2;

/**
 * Type for difficulty levels
 */
export type DifficultyLevel = keyof typeof DIFFICULTY_MULTIPLIERS;
