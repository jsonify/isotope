/***********************************************
 * FILE: src/tests/ElementMatchGame.test.ts
 * CREATED: 2025-03-24 15:34:01
 *
 * PURPOSE:
 * Test suite for ElementMatchGame core functionality including
 * element matching logic, scoring system, and progression integration.
 *
 * METHODS:
 * - isMatch(): Tests element matching logic
 * - calculateScore(): Tests scoring calculations
 * - updateProgression(): Tests progression system integration
 *****************/

import { describe, it, expect, vi } from 'vitest';

import { PlayerProfileService } from '../domains/player/services/PlayerProfileService';
import { isMatch, calculateScore } from '../domains/puzzle/services/ElementMatchGame';

describe('ElementMatchGame Core Logic', () => {
  describe('isMatch', () => {
    it('should return true when elements have the same atomic number', () => {
      const element1 = { atomicNumber: 1 };
      const element2 = { atomicNumber: 1 };
      expect(isMatch(element1, element2)).toBe(true);
    });

    it('should return false when elements have different atomic numbers', () => {
      const element1 = { atomicNumber: 1 };
      const element2 = { atomicNumber: 2 };
      expect(isMatch(element1, element2)).toBe(false);
    });
  });

  describe('calculateScore', () => {
    it('should return fixed AW points when there is a match', () => {
      expect(calculateScore(true)).toBe(10); // 10 AW points for a match
    });

    it('should return 0 points when there is no match', () => {
      expect(calculateScore(false)).toBe(0);
    });
  });

  describe('Integration with PlayerProfileService', () => {
    it('should update player AW score on match', async () => {
      const mockUpdateAWScore = vi.fn();
      vi.spyOn(PlayerProfileService.prototype, 'updateAWScore').mockImplementation(
        mockUpdateAWScore
      );

      const element1 = { atomicNumber: 1 };
      const element2 = { atomicNumber: 1 };
      const matched = isMatch(element1, element2);
      const score = calculateScore(matched);

      const profileService = PlayerProfileService.getInstance();
      await profileService.updateAWScore(score);

      expect(mockUpdateAWScore).toHaveBeenCalledWith(10);
    });

    it('should not update player AW score on non-match', async () => {
      const mockUpdateAWScore = vi.fn();
      vi.spyOn(PlayerProfileService.prototype, 'updateAWScore').mockImplementation(
        mockUpdateAWScore
      );

      const element1 = { atomicNumber: 1 };
      const element2 = { atomicNumber: 2 };
      const matched = isMatch(element1, element2);
      const score = calculateScore(matched);

      const profileService = PlayerProfileService.getInstance();
      await profileService.updateAWScore(score);

      expect(mockUpdateAWScore).toHaveBeenCalledWith(0);
    });
  });
});
