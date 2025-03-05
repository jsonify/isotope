// src/domains/player/services/__tests__/aw-tracking-integration.test.ts

import { describe, it, expect, beforeEach } from 'vitest';

import { GameMode } from '../../../shared/models/domain-models';
import type { PlayerProfile, Puzzle, PuzzleResult } from '../../../shared/models/domain-models';
import { PlayerProfileService } from '../PlayerProfileService';
import { ProgressionService } from '../ProgressionService';

interface TestOptions {
  gameMode?: GameMode;
  isPerfect?: boolean;
  displayName?: string;
}

interface CompletionResult {
  profile: PlayerProfile;
  awarded: number;
}

describe('atomic weight tracking integration', () => {
  let progressionService: ProgressionService;
  let profileService: PlayerProfileService;

  beforeEach(() => {
    progressionService = new ProgressionService();
    profileService = new PlayerProfileService();
  });

  // Test profile helpers
  const createTestProfile = (displayName: string = 'Test Player'): PlayerProfile => {
    profileService.resetProfile();
    return profileService.updateProfile({ displayName });
  };

  // Test puzzle helpers
  const createTestPuzzle = (options: TestOptions = {}): Puzzle => ({
    id: 'test-puzzle',
    type: options.gameMode ?? GameMode.ELEMENT_MATCH,
    difficulty: 1,
    elements: ['H'],
    instructions: 'Test puzzle',
    completed: false,
    perfectSolve: false,
    attempts: 0,
    timeLimit: 60,
  });

  const createPuzzleResult = (profile: PlayerProfile, options: TestOptions = {}): PuzzleResult => ({
    puzzleId: 'test-puzzle',
    playerId: profile.id,
    score: 100,
    timeTaken: 30,
    dateCompleted: new Date(),
    isPerfect: options.isPerfect ?? false,
  });

  // Puzzle completion helper
  const completePuzzle = (profile: PlayerProfile, options: TestOptions = {}): PlayerProfile => {
    const puzzle = createTestPuzzle(options);
    const result = createPuzzleResult(profile, options);
    return progressionService.handlePuzzleCompletion(profile, puzzle, result);
  };

  describe('puzzle completion flow', () => {
    describe('basic completion', () => {
      it('should award atomic weight points', () => {
        const profile = createTestProfile();
        const updatedProfile = completePuzzle(profile);
        expect(updatedProfile.level.atomicWeight).toBeGreaterThan(0);
      });

      it('should increase atomic weight', () => {
        const profile = createTestProfile();
        const updatedProfile = completePuzzle(profile);
        expect(updatedProfile.level.atomicWeight).toBeGreaterThan(profile.level.atomicWeight);
      });
    });

    describe('perfect completion bonus', () => {
      it('should award bonus points', () => {
        const regularProfile = completePuzzle(createTestProfile());
        const perfectProfile = completePuzzle(createTestProfile(), { isPerfect: true });
        expect(perfectProfile.level.atomicWeight).toBeGreaterThan(
          regularProfile.level.atomicWeight
        );
      });
    });

    describe('game mode point scaling', () => {
      it('should award more points for harder modes', () => {
        const tutorialProfile = completePuzzle(createTestProfile(), {
          gameMode: GameMode.TUTORIAL,
        });
        const isotopeProfile = completePuzzle(createTestProfile(), {
          gameMode: GameMode.ISOTOPE_BUILDER,
        });
        expect(isotopeProfile.level.atomicWeight).toBeGreaterThan(
          tutorialProfile.level.atomicWeight
        );
      });
    });
  });

  describe('element advancement', () => {
    const advanceProfile = (
      profile: PlayerProfile,
      untilCondition: (p: PlayerProfile) => boolean
    ): PlayerProfile => {
      // Added return type here
      let current = profile;
      while (!untilCondition(current)) {
        current = completePuzzle(current, {
          gameMode: GameMode.ISOTOPE_BUILDER,
          isPerfect: true,
        });
      }
      return current;
    };

    const checkElementAdvancement = (advanced: PlayerProfile, original: PlayerProfile): void => {
      expect(advanced.level.atomicNumber).toBeGreaterThan(original.level.atomicNumber);
      expect(advanced.currentElement).not.toBe(original.currentElement);
      expect(advanced.level.atomicWeight).toBe(0);
    };

    describe('basic advancement', () => {
      it('should advance to next element at threshold', () => {
        const profile = createTestProfile();
        const hasAdvanced = (p: PlayerProfile): boolean =>
          p.currentElement !== profile.currentElement ||
          p.level.atomicNumber !== profile.level.atomicNumber;

        const advancedProfile = advanceProfile(profile, hasAdvanced);
        checkElementAdvancement(advancedProfile, profile);
      });
    });

    describe('period advancement', () => {
      it('should unlock new game modes in new period', () => {
        const profile = createTestProfile();
        const initialPeriod = progressionService.getPlayerProgress(profile).currentPeriod;
        const initialGames = profile.unlockedGames.length;

        const advancedProfile = advanceProfile(
          profile,
          p => progressionService.getPlayerProgress(p).currentPeriod > initialPeriod
        );

        expect(advancedProfile.unlockedGames.length).toBeGreaterThan(initialGames);
        expect(advancedProfile.level.gameLab).toBeGreaterThan(profile.level.gameLab);
      });
    });
  });

  describe('progress tracking', () => {
    const runPuzzleSequence = (profile: PlayerProfile, count: number): CompletionResult => {
      let current = profile;
      let totalAwarded = 0;

      for (let i = 0; i < count; i++) {
        const prevAW = current.level.atomicWeight;
        current = completePuzzle(current);
        totalAwarded += current.level.atomicWeight - prevAW;
      }

      return { profile: current, awarded: totalAwarded };
    };

    describe('basic progress tracking', () => {
      it('should track progress towards next element', () => {
        const profile = createTestProfile();
        const { profile: updatedProfile } = runPuzzleSequence(profile, 1);

        const initialProgress = progressionService.getPlayerProgress(profile);
        const updatedProgress = progressionService.getPlayerProgress(updatedProfile);

        expect(updatedProgress.puzzlesCompletedTowardNext).toBeGreaterThan(
          initialProgress.puzzlesCompletedTowardNext
        );
        expect(updatedProgress.percentToNextElement).toBeGreaterThan(
          initialProgress.percentToNextElement
        );
      });
    });

    describe('atomic weight totals', () => {
      it('should maintain accurate atomic weight totals', () => {
        const profile = createTestProfile();
        const { profile: updatedProfile, awarded } = runPuzzleSequence(profile, 5);
        const progress = progressionService.getPlayerProgress(updatedProfile);
        expect(progress.totalPuzzlesCompleted).toBe(awarded);
      });
    });
  });
});
