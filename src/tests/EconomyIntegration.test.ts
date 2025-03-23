import { describe, it, expect, beforeEach } from 'vitest';

import type { DifficultyLevel } from '../domains/economy/services/economy-constants';
import * as ElectronService from '../domains/economy/services/ElectronService';
import type { RewardDetails } from '../domains/economy/services/ElectronService';
import { ElectronSource } from '../domains/shared/models/domain-models';
import type { PlayerProfile } from '../domains/shared/models/domain-models';
import type { ElementSymbol } from '../domains/shared/models/ElementTypes';

function createTestPlayerProfile(id: string = 'test-player'): PlayerProfile {
  return {
    id,
    displayName: 'Test Player',
    currentElement: 'H' as ElementSymbol,
    level: {
      atomicNumber: 1,
      atomicWeight: 0,
      gameLab: 0,
    },
    lastUpdated: new Date().toISOString(),
    electrons: 0,
    unlockedGames: [],
    achievements: [],
    lastLogin: new Date(),
    tutorialCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as PlayerProfile;
}

function simulatePuzzleCompletion(
  profile: PlayerProfile,
  difficulty: DifficultyLevel = 'EASY',
  isPerfect: boolean = false
): { profile: PlayerProfile; rewardDetails?: RewardDetails } {
  const reward = ElectronService.calculatePuzzleReward(isPerfect, difficulty);
  return ElectronService.awardElectrons(
    profile,
    reward.electrons,
    ElectronSource.PUZZLE_COMPLETION,
    `Completed ${difficulty} puzzle${isPerfect ? ' perfectly' : ''}`
  );
}

function assertElectronBalance(playerId: string, expectedBalance: number): void {
  const balance = ElectronService.getElectronBalance(playerId);
  expect(balance).toBe(expectedBalance);
}

function assertTransactionRecord(
  playerId: string,
  expectedAmount: number,
  type: 'earn',
  description: string
): void {
  const history = ElectronService.getElectronTransactionHistory(playerId);
  const lastTransaction = history[history.length - 1];

  expect(lastTransaction).toBeDefined();
  expect(lastTransaction.amount).toBe(expectedAmount);
  expect(lastTransaction.type).toBe(type);
  expect(lastTransaction.description).toBe(description);
}

describe('Economy Integration Tests', () => {
  beforeEach(() => {
    ElectronService.clearAllElectronServiceData();
  });

  describe('Basic Puzzle Completion Reward', () => {
    it('should award base electrons on puzzle completion', () => {
      const profile = createTestPlayerProfile();
      const difficulty = 'EASY' as DifficultyLevel;

      simulatePuzzleCompletion(profile, difficulty, false);

      const reward = ElectronService.calculatePuzzleReward(false, difficulty);
      assertElectronBalance(profile.id, reward.electrons);
      assertTransactionRecord(profile.id, reward.electrons, 'earn', 'Completed EASY puzzle');
    });
  });

  describe('Perfect Puzzle Completion Bonus', () => {
    it('should award bonus electrons for perfect puzzle completion', () => {
      const profile = createTestPlayerProfile();
      const difficulty = 'EASY' as DifficultyLevel;

      simulatePuzzleCompletion(profile, difficulty, true);

      const reward = ElectronService.calculatePuzzleReward(true, difficulty);
      assertElectronBalance(profile.id, reward.electrons);
      assertTransactionRecord(
        profile.id,
        reward.electrons,
        'earn',
        'Completed EASY puzzle perfectly'
      );
    });
  });

  describe('Puzzle Difficulty Scaling', () => {
    it('should scale electron rewards by puzzle difficulty', () => {
      const profile = createTestPlayerProfile();
      const difficulties: DifficultyLevel[] = ['EASY', 'MEDIUM', 'HARD'];

      let totalExpectedReward = 0;

      difficulties.forEach(difficulty => {
        simulatePuzzleCompletion(profile, difficulty, false);
        const reward = ElectronService.calculatePuzzleReward(false, difficulty);
        totalExpectedReward += reward.electrons;

        assertElectronBalance(profile.id, totalExpectedReward);
        assertTransactionRecord(
          profile.id,
          reward.electrons,
          'earn',
          `Completed ${difficulty} puzzle`
        );
      });
    });
  });

  describe('Cumulative Rewards', () => {
    it('should accumulate electron rewards from multiple puzzle completions', () => {
      const profile = createTestPlayerProfile();
      const difficulty = 'MEDIUM' as DifficultyLevel;
      const completions = 3;

      let totalExpectedReward = 0;

      for (let i = 0; i < completions; i++) {
        simulatePuzzleCompletion(profile, difficulty, false);
        const reward = ElectronService.calculatePuzzleReward(false, difficulty);
        totalExpectedReward += reward.electrons;

        assertElectronBalance(profile.id, totalExpectedReward);
        assertTransactionRecord(
          profile.id,
          reward.electrons,
          'earn',
          `Completed ${difficulty} puzzle`
        );
      }
    });
  });
});
