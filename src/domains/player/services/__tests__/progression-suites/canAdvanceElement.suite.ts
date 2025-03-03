// src/domains/player/services/__tests__/progression-suites/canAdvanceElement.suite.ts
import { describe, it, expect } from 'vitest';

import { ELEMENTS_DATA } from '../../../../shared/constants/game-constants';
import type {
  ElementSymbol,
  PlayerProfile,
  PlayerLevel,
} from '../../../../shared/models/domain-models';

interface TestService {
  canAdvanceElement: (profile: PlayerProfile) => boolean;
}

interface TestContext {
  service: TestService;
  baseProfile: PlayerProfile;
  createProfile: (data: Partial<PlayerProfile>) => PlayerProfile;
}

type SetupFn = () => TestContext;

export function testCanAdvanceElement(setupFn: SetupFn): void {
  describe('canAdvanceElement', () => {
    it('should return false when puzzles completed are below threshold', () => {
      const { service, baseProfile } = setupFn();
      expect(service.canAdvanceElement(baseProfile)).toBe(false);
    });

    it('should return true when puzzles completed meet threshold', () => {
      const { service, createProfile } = setupFn();
      const readyProfile = createProfile({
        level: {
          atomicNumber: 1,
          atomicWeight: 4,
          gameLab: 0,
        } as PlayerLevel,
      });
      expect(service.canAdvanceElement(readyProfile)).toBe(true);
    });

    it('should return false when at maximum element', () => {
      const { service, createProfile } = setupFn();
      const lastElement = ELEMENTS_DATA[ELEMENTS_DATA.length - 1];
      const maxElementProfile = createProfile({
        currentElement: lastElement.symbol as ElementSymbol,
        level: {
          atomicNumber: lastElement.atomicNumber,
          atomicWeight: 0,
          gameLab: 7,
        },
      });
      expect(service.canAdvanceElement(maxElementProfile)).toBe(false);
    });

    it('should handle edge case with invalid element', () => {
      const { service, createProfile } = setupFn();
      const mockInvalidProfile = createProfile({
        currentElement: 'XX' as ElementSymbol,
        level: {
          atomicNumber: 0,
          atomicWeight: 0,
          gameLab: 0,
        },
      });
      expect(() => service.canAdvanceElement(mockInvalidProfile)).toThrow();
    });
  });
}
