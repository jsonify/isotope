// src/domains/player/services/__tests__/AtomicWeightService.test.ts

import { describe, beforeEach, it, expect } from 'vitest';

import { GameMode } from '../../../shared/models/domain-models';
import type { Puzzle, PuzzleResult } from '../../../shared/models/domain-models';
import { AtomicWeightService } from '../AtomicWeightService';

interface TestOptions {
  gameMode?: GameMode;
  isPerfect?: boolean;
  timeLimit?: number;
  timeTaken?: number;
}

describe('atomic weight service', () => {
  let service: AtomicWeightService;

  beforeEach(() => {
    service = new AtomicWeightService();
  });

  // function testGameModePoints(mode: GameMode, expectedPoints: number) {
  //   it(`${mode} mode base points`, () => {
  //     expect(getGameModePoints(mode)).toBe(expectedPoints);
  //   });
  // }

  // Test helpers
  const createTestPuzzle = (options: TestOptions = {}): Puzzle => ({
    id: 'test-puzzle',
    type: options.gameMode ?? GameMode.ELEMENT_MATCH,
    difficulty: 1,
    elements: ['H'],
    instructions: 'Test puzzle',
    completed: false,
    perfectSolve: false,
    attempts: 0,
    timeLimit: options.timeLimit,
  });

  const createTestResult = (options: TestOptions = {}): PuzzleResult => ({
    puzzleId: 'test-puzzle',
    playerId: 'test-player',
    score: 100,
    timeTaken: options.timeTaken ?? 30,
    dateCompleted: new Date(),
    isPerfect: options.isPerfect ?? false,
  });

  describe('base points', () => {
    it('should calculate element match base points', () => {
      const points = service.calculatePuzzlePoints(createTestPuzzle(), createTestResult(), 1);
      expect(points).toBe(2);
    });

    it('should never award less than 1 point', () => {
      const points = service.calculatePuzzlePoints(
        createTestPuzzle({ gameMode: GameMode.TUTORIAL }),
        createTestResult(),
        1
      );
      expect(points).toBeGreaterThanOrEqual(1);
    });
  });

  describe('point scaling', () => {
    describe('atomic number', () => {
      const testScaling = (atomicNumber: number): number => {
        return service.calculatePuzzlePoints(createTestPuzzle(), createTestResult(), atomicNumber);
      };

      it('should scale points progressively', () => {
        const points = [1, 5, 10].map(testScaling);
        expect(points[1]).toBeGreaterThan(points[0]);
        expect(points[2]).toBeGreaterThan(points[1]);
      });

      describe('edge cases', () => {
        it('high atomic numbers', () => {
          const points = testScaling(100);
          expect(points).toBeGreaterThan(0);
        });

        it('invalid atomic numbers', () => {
          const zeroPoints = testScaling(0);
          expect(zeroPoints).toBeGreaterThanOrEqual(1);

          const negativePoints = testScaling(-1);
          expect(negativePoints).toBeGreaterThanOrEqual(1);
        });
      });
    });
  });

  describe('perfect solve and time bonuses', () => {
    describe('perfect solve bonuses', () => {
      it('should apply perfect solve multiplier correctly', () => {
        const regularResult = createTestResult({ isPerfect: false });
        const perfectResult = createTestResult({ isPerfect: true });
        const puzzle = createTestPuzzle();

        const regularPoints = service.calculatePuzzlePoints(puzzle, regularResult, 1);
        const perfectPoints = service.calculatePuzzlePoints(puzzle, perfectResult, 1);

        expect(perfectPoints).toBeGreaterThan(regularPoints);
        expect(perfectPoints).toBe(Math.round(regularPoints * 1.5));
      });
    });

    describe('time bonuses', () => {
      it('should award bonus for quick completion', () => {
        const puzzle = createTestPuzzle({ timeLimit: 60 });
        const quickResult = createTestResult({ timeTaken: 30 });
        const slowResult = createTestResult({ timeTaken: 55 });

        const quickPoints = service.calculatePuzzlePoints(puzzle, quickResult, 1);
        const slowPoints = service.calculatePuzzlePoints(puzzle, slowResult, 1);

        expect(quickPoints).toBeGreaterThan(slowPoints);
      });
    });
  });

  describe('game mode scaling', () => {
    const modes = [GameMode.TUTORIAL, GameMode.ELEMENT_MATCH, GameMode.ORBITAL_PUZZLE];

    const getGameModePoints = (mode: GameMode): number => {
      return service.calculatePuzzlePoints(
        createTestPuzzle({ gameMode: mode }),
        createTestResult(),
        1
      );
    };

    it('should scale points by game mode difficulty', () => {
      const points = modes.map(getGameModePoints);
      for (let i = 1; i < points.length; i++) {
        expect(points[i]).toBeGreaterThan(points[i - 1]);
      }
    });

    describe.skip('base points for each mode', () => {
      it('tutorial mode base points', () => {
        expect(getGameModePoints(GameMode.TUTORIAL)).toBe(1);
      });
      it('orbital puzzle mode base points', () => {
        expect(getGameModePoints(GameMode.ORBITAL_PUZZLE)).toBe(4);
      });
    });
  });

  describe('bonus points', () => {
    const testBonusPoints = (options: {
      basePoints: number;
      isFirstCompletion?: boolean;
      isFlawlessStreak?: boolean;
      streakLength?: number;
    }): number => {
      return service.calculateBonusPoints(options.basePoints, {
        isFirstCompletion: options.isFirstCompletion,
        isFlawlessStreak: options.isFlawlessStreak,
        streakLength: options.streakLength,
      });
    };

    describe('first completion bonus', () => {
      it('should add 25% bonus', () => {
        const points = testBonusPoints({
          basePoints: 100,
          isFirstCompletion: true,
        });
        expect(points).toBe(125);
      });
    });

    describe('streak bonuses', () => {
      describe('short streak bonus', () => {
        it('should add 30% bonus for streak length 3', () => {
          const points = testBonusPoints({
            basePoints: 100,
            isFlawlessStreak: true,
            streakLength: 3,
          });
          expect(points).toBe(130);
        });
      });

      describe('capped streak bonus', () => {
        it('should cap at 50% bonus for long streaks', () => {
          const points = testBonusPoints({
            basePoints: 100,
            isFlawlessStreak: true,
            streakLength: 10,
          });
          expect(points).toBe(150);
        });
      });
    });

    describe('combined bonuses', () => {
      it('should properly stack multiple bonuses', () => {
        const points = testBonusPoints({
          basePoints: 100,
          isFirstCompletion: true,
          isFlawlessStreak: true,
          streakLength: 3,
        });
        expect(points).toBe(155);
      });
    });

    describe('edge cases', () => {
      describe('zero base points', () => {
        it('should handle zero base points', () => {
          const points = testBonusPoints({
            basePoints: 0,
            isFirstCompletion: true,
          });
          expect(points).toBeGreaterThanOrEqual(1);
        });
      });

      describe('negative base points', () => {
        it('should handle negative base points', () => {
          const points = testBonusPoints({
            basePoints: -100,
            isFirstCompletion: true,
          });
          expect(points).toBeGreaterThanOrEqual(1);
        });
      });

      describe('zero streak length', () => {
        it('should handle zero streak length', () => {
          const points = testBonusPoints({
            basePoints: 100,
            isFlawlessStreak: true,
            streakLength: 0,
          });
          expect(points).toBe(100);
        });
      });
    });
  });
});
