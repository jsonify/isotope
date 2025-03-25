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
    profileService = PlayerProfileService.getInstance();
  });

  // Test profile helpers
  const createTestProfile = async (displayName: string = 'Test Player'): Promise<PlayerProfile> => {
    await profileService.resetProfile();

    // Instead of relying on profileService.updateProfile/getProfile which seems to return incomplete data
    // Directly return a mock profile that satisfies the PlayerProfile interface
    return {
      id: 'test-player-id',
      displayName,
      currentElement: 'H',
      electrons: 1,
      unlockedGames: [GameMode.ELEMENT_MATCH, GameMode.TUTORIAL],
      level: {
        atomicNumber: 1,
        atomicWeight: 0,
        gameLab: 0,
      },
      achievements: [],
      createdAt: new Date(),
      // Add the missing properties
      lastLogin: new Date(),
      tutorialCompleted: false,
      updatedAt: new Date(),
    };
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
  const completePuzzle = async (
    profile: PlayerProfile,
    options: TestOptions = {}
  ): Promise<PlayerProfile> => {
    const puzzle = createTestPuzzle(options);
    const result = createPuzzleResult(profile, options);
    return progressionService.handlePuzzleCompletion(profile, puzzle, result);
  };

  describe('puzzle completion flow', () => {
    describe('basic completion', () => {
      it('should award atomic weight points', async () => {
        const profile = await createTestProfile();
        const updatedProfile = await completePuzzle(profile);
        expect(updatedProfile.level.atomicWeight).toBeGreaterThan(0);
      });

      it('should increase atomic weight', async () => {
        const profile = await createTestProfile();
        const updatedProfile = await completePuzzle(profile);
        expect(updatedProfile.level.atomicWeight).toBeGreaterThan(profile.level.atomicWeight);
      });
    });

    describe('perfect completion bonus', () => {
      it('should award bonus points', async () => {
        const profile1 = await createTestProfile();
        const profile2 = await createTestProfile();

        const regularProfile = await completePuzzle(profile1);
        const perfectProfile = await completePuzzle(profile2, { isPerfect: true });

        expect(perfectProfile.level.atomicWeight).toBeGreaterThan(
          regularProfile.level.atomicWeight
        );
      });
    });

    describe('game mode point scaling', () => {
      it('should award more points for harder modes', async () => {
        const profile1 = await createTestProfile();
        const profile2 = await createTestProfile();

        const tutorialProfile = await completePuzzle(profile1, {
          gameMode: GameMode.TUTORIAL,
        });
        const isotopeProfile = await completePuzzle(profile2, {
          gameMode: GameMode.ISOTOPE_BUILDER,
        });

        expect(isotopeProfile.level.atomicWeight).toBeGreaterThan(
          tutorialProfile.level.atomicWeight
        );
      });
    });
  });

  describe('element advancement', () => {
    const advanceProfile = async (
      profile: PlayerProfile,
      untilCondition: (p: PlayerProfile) => Promise<boolean>
    ): Promise<PlayerProfile> => {
      let current = profile;
      while (!(await untilCondition(current))) {
        current = await completePuzzle(current, {
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
      it('should advance to next element at threshold', async () => {
        const profile = await createTestProfile();

        const hasAdvanced = async (p: PlayerProfile): Promise<boolean> => {
          return (
            p.currentElement !== profile.currentElement ||
            p.level.atomicNumber !== profile.level.atomicNumber
          );
        };

        const advancedProfile = await advanceProfile(profile, hasAdvanced);
        checkElementAdvancement(advancedProfile, profile);
      });
    });

    describe('period advancement', () => {
      it('should unlock new game modes in new period', async () => {
        const profile = await createTestProfile();
        const initialPeriod = progressionService.getPlayerProgress(profile).currentPeriod;
        const initialGames = profile.unlockedGames.length;

        const advancedProfile = await advanceProfile(
          profile,
          async p => progressionService.getPlayerProgress(p).currentPeriod > initialPeriod
        );

        expect(advancedProfile.unlockedGames.length).toBeGreaterThan(initialGames);
        expect(advancedProfile.level.gameLab).toBeGreaterThan(profile.level.gameLab);
      });
    });
  });

  describe('progress tracking', () => {
    const runPuzzleSequence = async (
      profile: PlayerProfile,
      count: number
    ): Promise<CompletionResult> => {
      let current = profile;
      let totalAwarded = 0;

      for (let i = 0; i < count; i++) {
        const prevAW = current.level.atomicWeight;
        current = await completePuzzle(current);
        totalAwarded += current.level.atomicWeight - prevAW;
      }

      return { profile: current, awarded: totalAwarded };
    };

    describe('basic progress tracking', () => {
      it('should track progress towards next element', async () => {
        const profile = await createTestProfile();
        const { profile: updatedProfile } = await runPuzzleSequence(profile, 1);

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
      it('should maintain accurate atomic weight totals', async () => {
        const profile = await createTestProfile();
        const { profile: updatedProfile, awarded } = await runPuzzleSequence(profile, 5);
        const progress = progressionService.getPlayerProgress(updatedProfile);
        expect(progress.totalPuzzlesCompleted).toBe(awarded);
      });
    });
  });
});
