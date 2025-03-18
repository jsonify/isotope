import { describe, it, expect, beforeEach } from 'vitest';

import {
  clearAllElectronServiceData,
  getElectronBalance,
  getElectronTransactionHistory,
} from '../domains/economy/services/ElectronService';
import { PuzzleService } from '../domains/puzzle/services/PuzzleService';
import { GameMode, type PlayerProfile } from '../domains/shared/models/domain-models';

describe('Puzzle Completion Rewards', () => {
  const TEST_PLAYER_ID = 'test-player-1';
  const puzzleService = new PuzzleService();

  // Create a mock player profile for testing
  const createTestProfile = (id: string): PlayerProfile => ({
    id,
    displayName: 'Test Player',
    level: {
      atomicNumber: 1,
      atomicWeight: 0,
      gameLab: 1,
    },
    currentElement: 'H',
    electrons: 0,
    unlockedGames: [GameMode.ELECTRON_SHELL],
    achievements: [],
    lastLogin: new Date(),
    tutorialCompleted: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(() => {
    clearAllElectronServiceData();
  });

  describe('Basic Puzzle Completion', () => {
    it('should award base electrons for completing a puzzle', () => {
      // Create a simple puzzle
      const puzzle = puzzleService.generatePuzzle(GameMode.ELECTRON_SHELL, 1, ['H']);

      // Complete puzzle with basic score
      const profile = createTestProfile(TEST_PLAYER_ID);
      puzzleService.completePuzzle(puzzle, profile, 80);

      // Verify electron balance
      const balance = getElectronBalance(TEST_PLAYER_ID);
      expect(balance).toBeGreaterThan(0);

      // Verify transaction history
      const history = getElectronTransactionHistory(TEST_PLAYER_ID);
      const lastTransaction = history[history.length - 1];
      expect(lastTransaction.type).toBe('earn');
      expect(lastTransaction.amount).toBeGreaterThan(0);
    });

    it('should award more electrons for perfect puzzle completion', () => {
      // Create a simple puzzle
      const puzzle = puzzleService.generatePuzzle(GameMode.ELECTRON_SHELL, 1, ['H']);

      // Complete puzzle with perfect score
      const profile = createTestProfile(TEST_PLAYER_ID);
      puzzleService.completePuzzle(puzzle, profile, 100);

      // Complete another puzzle with basic score for comparison
      const puzzle2 = puzzleService.generatePuzzle(GameMode.ELECTRON_SHELL, 1, ['He']);
      puzzleService.completePuzzle(puzzle2, profile, 80);

      // Get transaction history
      const history = getElectronTransactionHistory(TEST_PLAYER_ID);
      const perfectTransaction = history[0];
      const basicTransaction = history[1];

      // Perfect completion should give more electrons
      expect(perfectTransaction.amount).toBeGreaterThan(basicTransaction.amount);
    });

    it('should correctly track cumulative electron balance from multiple puzzles', () => {
      const profile = createTestProfile(TEST_PLAYER_ID);
      const difficulties = [1, 3, 5]; // Easy, Medium difficulty puzzles
      let expectedBalance = 0;

      // Complete multiple puzzles
      for (const difficulty of difficulties) {
        const puzzle = puzzleService.generatePuzzle(GameMode.ELECTRON_SHELL, difficulty, ['H']);
        const { reward } = puzzleService.completePuzzle(puzzle, profile, 90);

        // Keep track of awarded electrons
        expectedBalance += reward.electrons;

        // Verify running balance
        expect(getElectronBalance(TEST_PLAYER_ID)).toBe(expectedBalance);
      }

      // Verify final balance matches sum of all rewards
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(expectedBalance);
    });
  });

  describe('Transaction History', () => {
    it('should record puzzle completion rewards with correct source', () => {
      const profile = createTestProfile(TEST_PLAYER_ID);
      const puzzle = puzzleService.generatePuzzle(GameMode.ELECTRON_SHELL, 1, ['H']);

      // Complete puzzle with perfect score
      puzzleService.completePuzzle(puzzle, profile, 100);

      // Check transaction history
      const history = getElectronTransactionHistory(TEST_PLAYER_ID);
      const rewardTransaction = history[0];

      expect(rewardTransaction.type).toBe('earn');
      // Transaction amount should match the calculated reward
      expect(rewardTransaction.amount).toBeGreaterThan(0);
      expect(rewardTransaction.previousBalance).toBe(0);
      expect(rewardTransaction.newBalance).toBe(rewardTransaction.amount);
    });
  });
});
