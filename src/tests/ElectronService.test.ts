import { describe, it, expect, beforeEach } from 'vitest';

import {
  DIFFICULTY_MULTIPLIERS,
  PERFECT_SOLVE_MULTIPLIER,
  BASE_REWARD,
} from '../domains/economy/services/economy-constants';
import type { DifficultyLevel } from '../domains/economy/services/economy-constants';
import {
  getElectronBalance,
  addElectrons,
  removeElectrons,
  initializePlayerBalance,
  calculatePuzzleReward,
} from '../domains/economy/services/ElectronService';

describe('ElectronService', () => {
  const TEST_PLAYER_ID = 'test-player-1';
  const OTHER_PLAYER_ID = 'test-player-2';

  beforeEach(() => {
    // Initialize a fresh state for each test
    initializePlayerBalance(TEST_PLAYER_ID, 0);
    initializePlayerBalance(OTHER_PLAYER_ID, 0);
  });

  describe('getElectronBalance', () => {
    it('should return 0 for new players', () => {
      expect(getElectronBalance('new-player')).toBe(0);
    });

    it('should return correct balance for initialized players', () => {
      initializePlayerBalance(TEST_PLAYER_ID, 100);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(100);
    });
  });

  describe('addElectrons', () => {
    it('should add electrons successfully', () => {
      expect(addElectrons(TEST_PLAYER_ID, 50)).toBe(true);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(50);
    });

    it('should reject negative amounts', () => {
      expect(addElectrons(TEST_PLAYER_ID, -10)).toBe(false);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(0);
    });

    it('should accumulate multiple additions', () => {
      addElectrons(TEST_PLAYER_ID, 30);
      addElectrons(TEST_PLAYER_ID, 20);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(50);
    });
  });

  describe('removeElectrons', () => {
    beforeEach(() => {
      initializePlayerBalance(TEST_PLAYER_ID, 100);
    });

    it('should remove electrons successfully', () => {
      expect(removeElectrons(TEST_PLAYER_ID, 50)).toBe(true);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(50);
    });

    it('should reject negative amounts', () => {
      expect(removeElectrons(TEST_PLAYER_ID, -10)).toBe(false);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(100);
    });

    it('should reject insufficient balance', () => {
      expect(removeElectrons(TEST_PLAYER_ID, 150)).toBe(false);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(100);
    });

    it('should handle exact balance removal', () => {
      expect(removeElectrons(TEST_PLAYER_ID, 100)).toBe(true);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(0);
    });
  });

  describe('calculatePuzzleReward', () => {
    it('should calculate base reward for easy non-perfect solve', () => {
      const result = calculatePuzzleReward(false, 'EASY');
      expect(result.electrons).toBe(BASE_REWARD * DIFFICULTY_MULTIPLIERS.EASY);
    });

    it('should apply perfect solve multiplier', () => {
      const result = calculatePuzzleReward(true, 'EASY');
      expect(result.electrons).toBe(
        Math.round(BASE_REWARD * DIFFICULTY_MULTIPLIERS.EASY * PERFECT_SOLVE_MULTIPLIER)
      );
    });

    it('should scale rewards by difficulty', () => {
      const difficulties: DifficultyLevel[] = ['EASY', 'MEDIUM', 'HARD'];
      const results = difficulties.map(diff => calculatePuzzleReward(false, diff));

      difficulties.forEach((diff, index) => {
        expect(results[index].electrons).toBe(
          Math.round(BASE_REWARD * DIFFICULTY_MULTIPLIERS[diff])
        );
      });
    });

    it('should apply both difficulty and perfect multipliers', () => {
      const result = calculatePuzzleReward(true, 'HARD');
      const expected = Math.round(
        BASE_REWARD * DIFFICULTY_MULTIPLIERS.HARD * PERFECT_SOLVE_MULTIPLIER
      );
      expect(result.electrons).toBe(expected);
    });
  });

  describe('initializePlayerBalance', () => {
    it('should set initial balance', () => {
      initializePlayerBalance(TEST_PLAYER_ID, 100);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(100);
    });

    it('should default to 0 without initial balance', () => {
      initializePlayerBalance(TEST_PLAYER_ID);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(0);
    });

    it('should prevent negative initial balance', () => {
      initializePlayerBalance(TEST_PLAYER_ID, -50);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(0);
    });

    it('should reset existing balance', () => {
      initializePlayerBalance(TEST_PLAYER_ID, 100);
      initializePlayerBalance(TEST_PLAYER_ID, 50);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(50);
    });
  });

  describe('player isolation', () => {
    it('should maintain separate balances for different players', () => {
      initializePlayerBalance(TEST_PLAYER_ID, 100);
      initializePlayerBalance(OTHER_PLAYER_ID, 50);

      addElectrons(TEST_PLAYER_ID, 50);
      removeElectrons(OTHER_PLAYER_ID, 20);

      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(150);
      expect(getElectronBalance(OTHER_PLAYER_ID)).toBe(30);
    });
  });
});
