// src/domains/player/services/AtomicWeightService.ts

import { DIFFICULTY_SETTINGS } from '../../shared/constants/game-constants';
import { GameMode } from '../../shared/models/domain-models';
import type { Puzzle, PuzzleResult } from '../../shared/models/domain-models';

/**
 * Service for handling Atomic Weight (AW) calculations.
 * Manages puzzle completion tracking and point calculations.
 */
export class AtomicWeightService {
  // Base points for completing puzzles in different game modes
  private readonly gameBasePoints: Record<GameMode, number> = {
    [GameMode.TUTORIAL]: 1,
    [GameMode.ELEMENT_MATCH]: 2,
    [GameMode.PERIODIC_SORT]: 2,
    [GameMode.ELECTRON_SHELL]: 3,
    [GameMode.COMPOUND_BUILD]: 3,
    [GameMode.ELEMENT_QUIZ]: 2,
    [GameMode.REACTION_BALANCE]: 4,
    [GameMode.ORBITAL_PUZZLE]: 4,
    [GameMode.ISOTOPE_BUILDER]: 5,
    [GameMode.ELECTRON_FLOW]: 3,
  };

  // Perfect solve multipliers for each game mode
  private readonly perfectMultipliers: Record<GameMode, number> = {
    [GameMode.TUTORIAL]: 1.5,
    [GameMode.ELEMENT_MATCH]: 1.5,
    [GameMode.PERIODIC_SORT]: 1.5,
    [GameMode.ELECTRON_SHELL]: 1.75,
    [GameMode.COMPOUND_BUILD]: 1.75,
    [GameMode.ELEMENT_QUIZ]: 1.5,
    [GameMode.REACTION_BALANCE]: 2,
    [GameMode.ORBITAL_PUZZLE]: 2,
    [GameMode.ISOTOPE_BUILDER]: 2,
    [GameMode.ELECTRON_FLOW]: 1.75,
  };

  /**
   * Calculate atomic weight points for completing a puzzle
   */
  public calculatePuzzlePoints(
    puzzle: Puzzle,
    result: PuzzleResult,
    currentAtomicNumber: number
  ): number {
    // Start with the base points for the game mode
    const basePoints = this.gameBasePoints[puzzle.type] ?? 1;
    let points = basePoints;

    // Ensure valid atomic number
    const validAtomicNumber = Math.max(1, currentAtomicNumber);

    // Apply atomic number scaling
    if (validAtomicNumber > 1) {
      points *= 1 + (validAtomicNumber - 1) * DIFFICULTY_SETTINGS.elementMultiplier;
    }

    // Apply perfect solve bonus if achieved
    if (result.isPerfect) {
      points *= this.perfectMultipliers[puzzle.type] ?? 1.5;
    }

    // Apply time bonus if applicable
    if (
      typeof puzzle.timeLimit === 'number' &&
      typeof result.timeTaken === 'number' &&
      result.timeTaken < puzzle.timeLimit
    ) {
      const timePercent = (puzzle.timeLimit - result.timeTaken) / puzzle.timeLimit;
      const timeBonus = 1 + timePercent * 0.5; // Up to 50% bonus for fastest time
      points *= timeBonus;
    }

    // Round and ensure minimum points is the game mode's base points
    return Math.max(basePoints, Math.round(points));
  }

  /**
   * Calculate bonus points for special achievements or conditions
   * Bonuses are additive: each bonus adds its percentage to the total multiplier
   */
  public calculateBonusPoints(
    basePoints: number,
    conditions: {
      isFirstCompletion?: boolean;
      isFlawlessStreak?: boolean;
      streakLength?: number;
    }
  ): number {
    // Calculate total bonus percentage (additive)
    let totalBonusPercentage = 0;

    // Add first completion bonus (25%)
    if (conditions.isFirstCompletion === true) {
      totalBonusPercentage += 0.25;
    }

    // Add streak bonus (10% per streak up to 50%)
    if (conditions.isFlawlessStreak === true && typeof conditions.streakLength === 'number') {
      const streakBonus = Math.min(Math.max(0, conditions.streakLength) * 0.1, 0.5);
      totalBonusPercentage += streakBonus;
    }

    // Apply total bonus percentage
    const result = Math.round(basePoints * (1 + totalBonusPercentage));

    // Ensure minimum 1 point
    return Math.max(1, result);
  }

  /**
   * Get the base points value for a game mode
   */
  public getGameModeBasePoints(gameMode: GameMode): number {
    return this.gameBasePoints[gameMode] ?? 1;
  }

  /**
   * Get the perfect solve multiplier for a game mode
   */
  public getPerfectMultiplier(gameMode: GameMode): number {
    return this.perfectMultipliers[gameMode] ?? 1.5;
  }
}
