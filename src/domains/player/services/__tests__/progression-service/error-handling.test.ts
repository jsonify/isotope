import { describe, it, expect } from 'vitest';

import { setupTest, createAdvancedProfile } from './setup';
import type { ElementSymbol } from '../../../../shared/models/domain-models';
import { TEST_PROGRESSION_THRESHOLDS } from '../../../../shared/test-data';

describe('ProgressionService - Error Handling', () => {
  const { service, baseProfile } = setupTest();

  describe('invalid inputs', () => {
    it('should handle invalid element symbols', () => {
      const invalidProfile = {
        ...baseProfile,
        currentElement: 'XX' as ElementSymbol,
      };

      expect(() => service.getPlayerProgress(invalidProfile)).toThrow();
    });

    it('should reject non-existent elements', () => {
      expect(() => service.calculateRequiredPuzzles('ZZ' as ElementSymbol)).toThrow();
    });
  });

  describe('edge cases', () => {
    it('should handle missing progression thresholds', () => {
      // Temporarily remove H -> He threshold for this test
      const originalThresholds = [...TEST_PROGRESSION_THRESHOLDS];
      TEST_PROGRESSION_THRESHOLDS.splice(0, 1);

      const profile = createAdvancedProfile('H', 1, 1000, 1);

      const result = service.advanceElement(profile);

      // Restore original thresholds
      TEST_PROGRESSION_THRESHOLDS.splice(
        0,
        TEST_PROGRESSION_THRESHOLDS.length,
        ...originalThresholds
      );
      expect(result).toEqual(profile);
    });

    it('should handle invalid period numbers', () => {
      const invalidPeriod = 10;
      const result = service.unlockPeriodGames(baseProfile, invalidPeriod);
      expect(result.unlockedGames).toEqual(baseProfile.unlockedGames);
    });

    it('should handle zero atomic weight gracefully', () => {
      const profile = createAdvancedProfile('He', 2, 0, 1);
      const percent = service.getPercentToNextElement(profile);
      expect(percent).toBe(0);
    });
  });
});
