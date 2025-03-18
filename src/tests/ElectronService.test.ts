import { describe, it, expect, beforeEach } from 'vitest';

import {
  DIFFICULTY_MULTIPLIERS,
  PERFECT_SOLVE_MULTIPLIER,
  BASE_REWARD,
} from '../domains/economy/services/economy-constants';
import type { DifficultyLevel } from '../domains/economy/services/economy-constants';
import {
  clearAllElectronServiceData,
  getElectronBalance,
  addElectrons,
  removeElectrons,
  initializePlayerBalance,
  calculatePuzzleReward,
  getElectronTransactionHistory,
  earn,
} from '../domains/economy/services/ElectronService';

describe('ElectronService', () => {
  const TEST_PLAYER_ID = 'test-player-1';
  const OTHER_PLAYER_ID = 'test-player-2';

  beforeEach(() => {
    // Reset internal state
    clearAllElectronServiceData();
    // Initialize balances (recording transactions is fine now)
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

    describe('transaction history', () => {
      it('should record add transaction', () => {
        addElectrons(TEST_PLAYER_ID, 50);
        const history = getElectronTransactionHistory(TEST_PLAYER_ID);

        expect(history).toHaveLength(2); // initialize + add
        expect(history[1]).toEqual({
          type: 'add',
          amount: 50,
          previousBalance: 0,
          newBalance: 50,
          timestamp: expect.any(Date),
        });
      });

      it('should record remove transaction', () => {
        clearAllElectronServiceData(); // Start fresh
        initializePlayerBalance(TEST_PLAYER_ID, 100); // Set up initial balance
        removeElectrons(TEST_PLAYER_ID, 30); // Perform remove operation
        const history = getElectronTransactionHistory(TEST_PLAYER_ID);

        expect(history).toHaveLength(2); // initialize + remove
        expect(history[1]).toEqual({
          // Check the remove transaction
          type: 'remove',
          amount: 30,
          previousBalance: 100,
          newBalance: 70,
          timestamp: expect.any(Date),
        });
      });

      it('should record initialize transaction', () => {
        clearAllElectronServiceData(); // Start fresh
        initializePlayerBalance(TEST_PLAYER_ID, 50);
        const history = getElectronTransactionHistory(TEST_PLAYER_ID);

        expect(history).toHaveLength(1);
        expect(history[0]).toEqual({
          type: 'initialize',
          amount: 50,
          previousBalance: 0,
          newBalance: 50,
          timestamp: expect.any(Date),
        });
      });

      it('should maintain separate transaction histories for different players', () => {
        addElectrons(TEST_PLAYER_ID, 30);
        addElectrons(OTHER_PLAYER_ID, 20);

        const history1 = getElectronTransactionHistory(TEST_PLAYER_ID);
        const history2 = getElectronTransactionHistory(OTHER_PLAYER_ID);

        expect(history1).toHaveLength(2); // initialize + add
        expect(history2).toHaveLength(2); // initialize + add

        // Check initialization transactions
        expect(history1[0]).toEqual({
          type: 'initialize',
          amount: 0,
          previousBalance: 0,
          newBalance: 0,
          timestamp: expect.any(Date),
        });
        expect(history2[0]).toEqual({
          type: 'initialize',
          amount: 0,
          previousBalance: 0,
          newBalance: 0,
          timestamp: expect.any(Date),
        });

        // Check add transactions
        expect(history1[1]).toEqual({
          type: 'add',
          amount: 30,
          previousBalance: 0,
          newBalance: 30,
          timestamp: expect.any(Date),
        });
        expect(history2[1]).toEqual({
          type: 'add',
          amount: 20,
          previousBalance: 0,
          newBalance: 20,
          timestamp: expect.any(Date),
        });
      });

      it('should return empty array for players without history', () => {
        const history = getElectronTransactionHistory('non-existent-player');
        expect(history).toEqual([]);
      });
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

  describe('earn', () => {
    beforeEach(() => {
      clearAllElectronServiceData();
      initializePlayerBalance(TEST_PLAYER_ID, 0);
    });

    it('should add earned electrons to balance', () => {
      const result = earn(TEST_PLAYER_ID, 50);
      expect(result).toBe(true);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(50);
    });

    it('should record earn transaction in history', () => {
      earn(TEST_PLAYER_ID, 30);
      const history = getElectronTransactionHistory(TEST_PLAYER_ID);

      expect(history).toHaveLength(2); // initialize + earn
      expect(history[1]).toEqual({
        type: 'earn',
        amount: 30,
        previousBalance: 0,
        newBalance: 30,
        timestamp: expect.any(Date),
      });
    });

    it('should reject negative earn amounts', () => {
      const result = earn(TEST_PLAYER_ID, -10);
      expect(result).toBe(false);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(0);
    });

    it('should accumulate multiple earned amounts', () => {
      earn(TEST_PLAYER_ID, 30);
      earn(TEST_PLAYER_ID, 20);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(50);
    });
  });
});
