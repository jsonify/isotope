import { describe, it, expect, beforeEach } from 'vitest';
import { vi } from 'vitest';

import type { Element, PlayerProfile } from '../../../shared/models/domain-models';
import { GameMode } from '../../../shared/models/domain-models';
import {
  ProgressionEventEmitter,
  ProgressionEventType,
} from '../../../shared/models/progression-events';
import { TransitionService } from '../../../shared/services/TransitionService';
import { ProgressionService } from '../ProgressionService';

// Mock the TransitionService
vi.mock('../../../shared/services/TransitionService', () => ({
  TransitionService: {
    getInstance: vi.fn(() => ({
      createTransition: vi.fn(),
    })),
  },
}));

// Mock AtomicWeightService
vi.mock('../AtomicWeightService', () => ({
  AtomicWeightService: vi.fn().mockImplementation(() => ({
    calculatePuzzlePoints: vi.fn(() => 10),
    calculateBonusPoints: vi.fn(base => base),
  })),
}));

describe('ProgressionService - Game Lab Features', () => {
  let progressionService: ProgressionService;
  let mockEventHandler: ReturnType<typeof vi.fn>;

  // Mock Element data
  const mockElements: Record<string, Element> = {
    He: {
      symbol: 'He',
      name: 'Helium',
      atomicNumber: 2,
      atomicWeight: 4.002602,
      period: 1,
      group: 18,
      description: 'Noble gas',
    },
    Li: {
      symbol: 'Li',
      name: 'Lithium',
      atomicNumber: 3,
      atomicWeight: 6.94,
      period: 2,
      group: 1,
      description: 'Alkali metal',
    },
    Ne: {
      symbol: 'Ne',
      name: 'Neon',
      atomicNumber: 10,
      atomicWeight: 20.1797,
      period: 2,
      group: 18,
      description: 'Noble gas',
    },
  };

  const createMockProfile = (override: Partial<PlayerProfile> = {}): PlayerProfile => ({
    id: 'test-player',
    displayName: 'Test Player',
    level: {
      atomicNumber: 1,
      atomicWeight: 0,
      gameLab: 0,
    },
    currentElement: 'H',
    electrons: 0,
    unlockedGames: [GameMode.TUTORIAL],
    achievements: [],
    lastLogin: new Date(),
    tutorialCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    progressionService = new ProgressionService();
    mockEventHandler = vi.fn();
    ProgressionEventEmitter.getInstance().subscribe(mockEventHandler);
  });

  describe('Period Progression', () => {
    it('should unlock correct game modes for period 1', () => {
      const profile = createMockProfile();
      const updatedProfile = progressionService.unlockPeriodGames(profile, 1);

      expect(updatedProfile.unlockedGames).toEqual(
        expect.arrayContaining([GameMode.TUTORIAL, GameMode.ELEMENT_MATCH])
      );
    });

    it('should unlock additional game modes when advancing to period 2', () => {
      const profile = createMockProfile({
        currentElement: 'Li',
        level: { atomicNumber: 3, atomicWeight: 0, gameLab: 1 },
        unlockedGames: [GameMode.TUTORIAL, GameMode.ELEMENT_MATCH],
      });

      const updatedProfile = progressionService.unlockPeriodGames(profile, 2);

      expect(updatedProfile.unlockedGames).toEqual(
        expect.arrayContaining([
          GameMode.TUTORIAL,
          GameMode.ELEMENT_MATCH,
          GameMode.PERIODIC_SORT,
          GameMode.ELECTRON_SHELL,
        ])
      );
    });

    it('should not duplicate already unlocked games', () => {
      const profile = createMockProfile({
        unlockedGames: [GameMode.TUTORIAL, GameMode.ELEMENT_MATCH],
      });

      const updatedProfile = progressionService.unlockPeriodGames(profile, 1);

      expect(updatedProfile.unlockedGames).toHaveLength(2);
      expect(updatedProfile.unlockedGames).toEqual([GameMode.TUTORIAL, GameMode.ELEMENT_MATCH]);
    });
  });

  describe('Event Emission', () => {
    it('should emit game mode unlocked events', () => {
      const profile = createMockProfile();
      progressionService.unlockPeriodGames(profile, 1);

      expect(mockEventHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          type: ProgressionEventType.GAME_MODE_UNLOCKED,
          playerId: profile.id,
          gameMode: GameMode.ELEMENT_MATCH,
          period: 1,
        })
      );
    });

    it('should emit period completed event during period advancement', () => {
      const profile = createMockProfile({
        currentElement: 'He',
        level: { atomicNumber: 2, atomicWeight: 20, gameLab: 0 },
      });

      progressionService['handlePeriodAdvancement'](
        profile,
        mockElements.Li,
        mockElements.He,
        TransitionService.getInstance()
      );

      expect(mockEventHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          type: ProgressionEventType.PERIOD_COMPLETED,
          playerId: profile.id,
          periodNumber: 2,
        })
      );
    });
  });

  describe('Caching', () => {
    it('should cache period progress calculations', async () => {
      const profile = createMockProfile();
      const getCacheSpy = vi.spyOn(
        progressionService,
        'getCachedProgress' as keyof ProgressionService
      );
      const setCacheSpy = vi.spyOn(
        progressionService,
        'setCachedProgress' as keyof ProgressionService
      );

      // First call should calculate
      const progress1 = progressionService.getPeriodProgress(profile);
      expect(setCacheSpy).toHaveBeenCalledTimes(1);
      expect(getCacheSpy).toHaveBeenCalledTimes(1);

      // Second call should use cache
      const progress2 = progressionService.getPeriodProgress(profile);

      expect(progress1).toEqual({
        currentPeriod: expect.any(Number),
        elementsInPeriod: expect.any(Array),
        completedInPeriod: expect.any(Number),
      });

      expect(progress2).toEqual(progress1);
      // Cache should be checked twice, but set only once
      expect(getCacheSpy).toHaveBeenCalledTimes(2);
      expect(setCacheSpy).toHaveBeenCalledTimes(1);
    });

    it('should clear cache when advancing periods', () => {
      const profile = createMockProfile();
      progressionService.getPeriodProgress(profile); // Cache initial progress

      const clearCacheSpy = vi.spyOn(
        progressionService,
        'clearPeriodProgressCache' as keyof ProgressionService
      );

      progressionService['handlePeriodAdvancement'](
        profile,
        mockElements.Li,
        mockElements.He,
        TransitionService.getInstance()
      );

      expect(clearCacheSpy).toHaveBeenCalledWith(profile.id);
      expect(progressionService.getPeriodProgress(profile)).toBeDefined();
    });
  });

  describe('Player Progress', () => {
    it('should track which periods are unlocked', () => {
      const profile = createMockProfile({
        currentElement: 'Ne',
        level: { atomicNumber: 10, atomicWeight: 0, gameLab: 2 },
      });

      const progress = progressionService.getPlayerProgress(profile);
      expect(progress.periodsUnlocked).toBe(2);
    });

    it('should provide game mode info for a period', () => {
      const periodModes = progressionService.getGameModesForPeriod(2);
      expect(periodModes).toEqual([
        expect.objectContaining({ mode: GameMode.PERIODIC_SORT }),
        expect.objectContaining({ mode: GameMode.ELECTRON_SHELL }),
      ]);
    });
  });
});
