import { describe, it, expect, beforeEach } from 'vitest';

import { PuzzleService } from '../domains/puzzle/services/PuzzleService';
import { GameMode } from '../domains/shared/models/domain-models';
import type { PlayerProfile, ElementSymbol } from '../domains/shared/models/domain-models';

describe('PuzzleService', () => {
  let service: PuzzleService;
  let testProfile: PlayerProfile;

  beforeEach(() => {
    service = new PuzzleService();
    const now = new Date();
    testProfile = {
      id: 'test-player',
      displayName: 'Test Player',
      level: {
        atomicNumber: 1,
        atomicWeight: 0,
        gameLab: 1,
      },
      currentElement: 'H',
      electrons: 0,
      unlockedGames: [GameMode.TUTORIAL],
      achievements: [],
      lastLogin: now,
      tutorialCompleted: false,
      createdAt: now,
      updatedAt: now,
    };
  });

  describe('generatePuzzle', () => {
    it('should create a puzzle with the specified parameters', () => {
      const elements: ElementSymbol[] = ['H', 'He'];
      const puzzle = service.generatePuzzle(GameMode.ELEMENT_MATCH, 5, elements);

      expect(puzzle).toMatchObject({
        type: GameMode.ELEMENT_MATCH,
        difficulty: 5,
        elements: elements,
        completed: false,
        perfectSolve: false,
        attempts: 0,
      });
      expect(puzzle.id).toBeDefined();
    });

    it('should add timeLimit for timed game modes', () => {
      const puzzle = service.generatePuzzle(GameMode.ELEMENT_MATCH, 5, ['H']);
      expect(puzzle.timeLimit).toBeDefined();
      expect(puzzle.timeLimit).toBe(110); // 60 + 5 * 10
    });
  });

  describe('completePuzzle', () => {
    it('should calculate rewards based on difficulty level', () => {
      const easyPuzzle = service.generatePuzzle(GameMode.TUTORIAL, 2, ['H']);
      const mediumPuzzle = service.generatePuzzle(GameMode.TUTORIAL, 5, ['H']);
      const hardPuzzle = service.generatePuzzle(GameMode.TUTORIAL, 9, ['H']);

      const easyResult = service.completePuzzle(easyPuzzle, testProfile, 100);
      const mediumResult = service.completePuzzle(mediumPuzzle, testProfile, 100);
      const hardResult = service.completePuzzle(hardPuzzle, testProfile, 100);

      // Perfect solve, different difficulties should yield different rewards
      expect(easyResult.reward.electrons).toBeLessThan(mediumResult.reward.electrons);
      expect(mediumResult.reward.electrons).toBeLessThan(hardResult.reward.electrons);
    });

    it('should award additional electrons for perfect solves', () => {
      const puzzle = service.generatePuzzle(GameMode.TUTORIAL, 5, ['H']);

      const perfectResult = service.completePuzzle(puzzle, testProfile, 100);
      const nonPerfectResult = service.completePuzzle(puzzle, testProfile, 80);

      expect(perfectResult.reward.electrons).toBeGreaterThan(nonPerfectResult.reward.electrons);
    });

    it('should consider time remaining for timed puzzles', () => {
      const puzzle = service.generatePuzzle(GameMode.ELEMENT_MATCH, 5, ['H']);
      expect(puzzle.timeLimit).toBeDefined();

      const perfectWithTime = service.completePuzzle(
        puzzle,
        testProfile,
        100,
        puzzle.timeLimit! * 0.75
      );
      const perfectNoTime = service.completePuzzle(
        puzzle,
        testProfile,
        100,
        puzzle.timeLimit! * 0.25
      );

      expect(perfectWithTime.result.isPerfect).toBe(true);
      expect(perfectNoTime.result.isPerfect).toBe(false);
    });
  });
});
