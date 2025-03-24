/***********************************************
 * FILE: src/domains/puzzle/services/ElementMatchGame.ts
 * CREATED: 2025-03-23 18:34:46
 *
 * PURPOSE:
 * Core game logic for the Element Match game, including matching and scoring
 *
 * METHODS:
 * - isMatch(): Determines if two elements match
 * - calculateScore(): Calculates score based on match result
 * - generateElements(): Generates random elements for gameplay
 *****************/

import type { Element } from '../models/ElementMatchTypes';
import { MATCH_SCORE } from '../models/ElementMatchTypes';

/**
 * Determines if two elements match based on their atomic numbers
 * @param element1 First element to compare
 * @param element2 Second element to compare
 * @returns true if elements match, false otherwise
 */
export function isMatch(element1: Element, element2: Element): boolean {
  return element1.atomicNumber === element2.atomicNumber;
}

/**
 * Calculates the score based on whether there was a match
 * @param matched Whether the elements matched
 * @returns Score value (MATCH_SCORE for match, 0 for no match)
 */
export function calculateScore(matched: boolean): number {
  return matched ? MATCH_SCORE : 0;
}

/**
 * Generates two random elements for gameplay
 * @param maxAtomicNumber Maximum atomic number to use (defaults to 10 for MVP)
 * @returns Tuple of two elements
 */
export function generateElements(maxAtomicNumber: number = 10): [Element, Element] {
  const getRandomAN = (): number => Math.floor(Math.random() * maxAtomicNumber) + 1;

  // For MVP, 20% chance of generating a matching pair
  const shouldMatch = Math.random() < 0.2;

  const an1 = getRandomAN();
  const an2 = shouldMatch ? an1 : getRandomAN();

  return [{ atomicNumber: an1 }, { atomicNumber: an2 }];
}
