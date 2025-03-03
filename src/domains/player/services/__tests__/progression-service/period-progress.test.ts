import { describe, it, expect } from 'vitest';

import { setupTest, createAdvancedProfile } from './setup';
import { ELEMENTS_DATA } from '../../../../shared/constants/game-constants';

describe('ProgressionService - Period Progress', () => {
  const { service, baseProfile } = setupTest();

  describe('period tracking', () => {
    it('should track elements completed in current period', () => {
      const progress = service.getPeriodProgress(baseProfile);

      expect(progress).toEqual({
        currentPeriod: 1,
        elementsInPeriod: ['H', 'He'],
        completedInPeriod: 1,
      });
    });

    it('should handle progress in higher periods', () => {
      const profile = createAdvancedProfile('O', 8, 0, 2);
      const progress = service.getPeriodProgress(profile);
      const periodElements = ELEMENTS_DATA.filter(e => e.period === 2).map(e => e.symbol);

      expect(progress).toEqual({
        currentPeriod: 2,
        elementsInPeriod: periodElements,
        completedInPeriod: periodElements.findIndex(e => e === 'O') + 1,
      });
    });
  });

  describe('period completion', () => {
    it('should correctly identify start of period', () => {
      const profile = createAdvancedProfile('Li', 3, 0, 2);
      const progress = service.getPeriodProgress(profile);

      expect(progress.currentPeriod).toBe(2);
      expect(progress.completedInPeriod).toBe(1);
    });

    it('should correctly identify end of period', () => {
      const profile = createAdvancedProfile('Ne', 10, 0, 2);
      const progress = service.getPeriodProgress(profile);
      const periodElements = ELEMENTS_DATA.filter(e => e.period === 2).map(e => e.symbol);

      expect(progress.currentPeriod).toBe(2);
      expect(progress.completedInPeriod).toBe(periodElements.length);
    });
  });
});
