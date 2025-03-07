import { describe, expect, it, beforeEach } from 'vitest';

import type { PlayerProfile } from '../../../../shared/models/domain-models';
import { ProgressionService } from '../../ProgressionService';

describe('ProgressionService - Period Progress', () => {
  let service: ProgressionService;
  let mockProfile: PlayerProfile;

  beforeEach(() => {
    service = new ProgressionService();
    mockProfile = {
      id: 'test-player',
      displayName: 'Test Player',
      currentElement: 'H',
      level: {
        atomicNumber: 1,
        atomicWeight: 0,
        gameLab: 1,
      },
      electrons: 0,
      unlockedGames: [],
      achievements: [],
      lastLogin: new Date(),
      tutorialCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  describe('getPeriodProgress', () => {
    it('should return correct progress data for period 1', () => {
      const progress = service.getPeriodProgress(mockProfile);

      expect(progress).toMatchObject({
        currentPeriod: 1,
        completedInPeriod: 1,
        percentComplete: expect.any(Number),
        remainingElements: expect.any(Number),
      });
      expect(progress.elementsInPeriod).toContain('H');
      expect(progress.elementsInPeriod).toContain('He');
    });

    it('should calculate correct percentage completion', () => {
      const progress = service.getPeriodProgress(mockProfile);

      // Period 1 has 2 elements (H, He)
      // With H completed (atomicNumber 1), should be 50%
      expect(progress.percentComplete).toBe(50);
      expect(progress.remainingElements).toBe(1);
    });

    it('should identify correct next milestone', () => {
      const progress = service.getPeriodProgress(mockProfile);

      // In Period 1, after H, next milestone should be He
      expect(progress.nextMilestone).toBe('He');
    });

    it('should handle completed periods', () => {
      mockProfile = {
        ...mockProfile,
        currentElement: 'Li', // First element of period 2
        level: {
          ...mockProfile.level,
          atomicNumber: 3, // Completed period 1 (H, He)
        },
      };

      const progress = service.getPeriodProgress({
        ...mockProfile,
        currentElement: 'He',
      });

      expect(progress).toMatchObject({
        currentPeriod: 1,
        completedInPeriod: 2,
        percentComplete: 100,
        remainingElements: 0,
      });
      expect(progress.nextMilestone).toBeUndefined();
    });

    it('should cache progress calculations', () => {
      const firstProgress = service.getPeriodProgress(mockProfile);
      const secondProgress = service.getPeriodProgress(mockProfile);

      expect(secondProgress).toEqual(firstProgress);
    });

    it('should update cache when advancing to new element', () => {
      const initialProgress = service.getPeriodProgress(mockProfile);

      mockProfile = {
        ...mockProfile,
        currentElement: 'He',
        level: {
          ...mockProfile.level,
          atomicNumber: 2,
        },
      };

      const newProgress = service.getPeriodProgress(mockProfile);

      expect(newProgress).not.toEqual(initialProgress);
      expect(newProgress.completedInPeriod).toBe(2);
      expect(newProgress.percentComplete).toBe(100);
    });
  });
});
