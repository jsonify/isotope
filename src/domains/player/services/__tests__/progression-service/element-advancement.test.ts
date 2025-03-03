import { describe, it, expect } from 'vitest';

import { setupTest, createAdvancedProfile } from './setup';
import { PROGRESSION_THRESHOLDS } from '../../../../shared/constants/game-constants';

class ElementAdvancementTests {
  private service!: ReturnType<typeof setupTest>['service'];
  private baseProfile!: ReturnType<typeof setupTest>['baseProfile'];

  public beforeEach(): void {
    const setup = setupTest();
    this.service = setup.service;
    this.baseProfile = setup.baseProfile;
  }

  public testAdvancementEligibility(): void {
    describe('advancement eligibility', () => {
      it('should not allow advancement when requirements not met', () => {
        const result = this.service.canAdvanceElement(this.baseProfile);
        expect(result).toBe(false);
      });

      it('should allow advancement when meeting puzzle requirements', () => {
        const threshold = PROGRESSION_THRESHOLDS.find(
          t => t.fromElement === 'H' && t.toElement === 'He'
        );
        const profile = {
          ...this.baseProfile,
          level: {
            ...this.baseProfile.level,
            atomicWeight: threshold!.puzzlesRequired,
          },
        };

        const result = this.service.canAdvanceElement(profile);
        expect(result).toBe(true);
      });

      it('should not advance beyond maximum element', () => {
        const profile = createAdvancedProfile('Ca', 20, 1000, 4);

        const result = this.service.canAdvanceElement(profile);
        expect(result).toBe(false);
      });
    });
  }

  public testAdvancementExecution(): void {
    describe('advancement execution', () => {
      it('should increase atomic number when advancing', () => {
        const threshold = PROGRESSION_THRESHOLDS.find(
          t => t.fromElement === 'H' && t.toElement === 'He'
        );
        const profile = {
          ...this.baseProfile,
          level: {
            ...this.baseProfile.level,
            atomicWeight: threshold!.puzzlesRequired,
          },
        };

        const result = this.service.advanceElement(profile);
        expect(result.level.atomicNumber).toBe(2);
        expect(result.currentElement).toBe('He');
      });

      it('should increase gameLab when advancing to new period', () => {
        const profile = createAdvancedProfile('He', 2, 1000, 1);

        const result = this.service.advanceElement(profile);
        expect(result.level.gameLab).toBe(2);
        expect(result.currentElement).toBe('Li');
      });
    });
  }
}

const tests = new ElementAdvancementTests();
describe('ProgressionService - Element Advancement', () => {
  beforeEach(() => tests.beforeEach());
  tests.testAdvancementEligibility();
  tests.testAdvancementExecution();
});
