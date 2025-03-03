import { describe, it, expect } from 'vitest';

import { setupTest, createAdvancedProfile } from './setup';
import { PROGRESSION_THRESHOLDS } from '../../../../shared/constants/game-constants';
import type { ElementSymbol } from '../../../../shared/models/domain-models';

class ProgressCalculationsTests {
  private service!: ReturnType<typeof setupTest>['service'];
  private baseProfile!: ReturnType<typeof setupTest>['baseProfile'];

  public beforeEach(): void {
    const setup = setupTest();
    this.service = setup.service;
    this.baseProfile = setup.baseProfile;
  }

  public testPuzzleRequirements(): void {
    describe('puzzle requirements', () => {
      it('should calculate required puzzles for next element', () => {
        const threshold = PROGRESSION_THRESHOLDS.find(
          t => t.fromElement === 'H' && t.toElement === 'He'
        );
        const required = this.service.calculateRequiredPuzzles('H' as ElementSymbol);
        expect(required).toBe(threshold!.puzzlesRequired);
      });

      it('should handle final element puzzle requirements', () => {
        const required = this.service.calculateRequiredPuzzles('Ca' as ElementSymbol);
        expect(required).toBeGreaterThan(0);
      });
    });
  }

  public testProgressPercentage(): void {
    describe('progress percentage', () => {
      it('should calculate percentage progress to next element', () => {
        const threshold = PROGRESSION_THRESHOLDS.find(
          t => t.fromElement === 'H' && t.toElement === 'He'
        );
        const profile = {
          ...this.baseProfile,
          level: {
            ...this.baseProfile.level,
            atomicWeight: Math.floor(threshold!.puzzlesRequired / 2),
          },
        };

        const percent = this.service.getPercentToNextElement(profile);
        expect(percent).toBe(50);
      });

      it('should return 100% progress for final element', () => {
        const profile = createAdvancedProfile('Ca', 20, 1000, 4);

        const percent = this.service.getPercentToNextElement(profile);
        expect(percent).toBe(100);
      });
    });
  }

  public testOverallProgressTracking(): void {
    describe('overall progress tracking', () => {
      it('should calculate detailed player progress', () => {
        const progress = this.service.getPlayerProgress(this.baseProfile);

        expect(progress).toEqual({
          currentElement: 'H',
          totalPuzzlesCompleted: 0,
          puzzlesCompletedTowardNext: 0,
          puzzlesRequiredForNext: expect.any(Number),
          percentToNextElement: 0,
          currentPeriod: 1,
          elementsInCurrentPeriod: ['H', 'He'],
          periodsUnlocked: 1,
        });
      });

      it('should track progress for advanced elements', () => {
        const profile = createAdvancedProfile('He', 2, 5, 1);
        const progress = this.service.getPlayerProgress(profile);

        expect(progress).toEqual({
          currentElement: 'He',
          totalPuzzlesCompleted: 5,
          puzzlesCompletedTowardNext: 5,
          puzzlesRequiredForNext: expect.any(Number),
          percentToNextElement: expect.any(Number),
          currentPeriod: 1,
          elementsInCurrentPeriod: ['H', 'He'],
          periodsUnlocked: 1,
        });
      });
    });
  }
}

const tests = new ProgressCalculationsTests();
describe('ProgressionService - Progress Calculations', () => {
  beforeEach(() => tests.beforeEach());
  tests.testPuzzleRequirements();
  tests.testProgressPercentage();
  tests.testOverallProgressTracking();
});
