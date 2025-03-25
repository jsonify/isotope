/***********************************************
 * FILE: src/domains/puzzle/models/ElementMatchTypes.ts
 * CREATED: 2025-03-23 18:33:51
 *
 * PURPOSE:
 * Type definitions for the Element Match game functionality
 *
 * TYPES:
 * - Element: Basic element structure
 * - MatchResult: Game match result
 *****************/

export interface Element {
  atomicNumber: number;
}

export interface MatchResult {
  matched: boolean;
  score: number;
}

// Constants
export const MATCH_SCORE = 10; // AW points awarded for a match
