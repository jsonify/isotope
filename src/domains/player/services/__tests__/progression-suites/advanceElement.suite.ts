import { describe, it, expect, vi } from 'vitest';

import { ELEMENTS_DATA } from '../../../../shared/constants/game-constants';
import type {
  ElementSymbol,
  PlayerProfile,
  PlayerLevel,
} from '../../../../shared/models/domain-models';

interface TestService {
  advanceElement: (profile: PlayerProfile) => PlayerProfile;
  canAdvanceElement: (profile: PlayerProfile) => boolean;
}

interface TestContext {
  service: TestService;
  baseProfile: PlayerProfile;
  createProfile: (data: Partial<PlayerProfile>) => PlayerProfile;
}

type SetupFn = () => TestContext;

const testBasicAdvancement = (setupFn: SetupFn): void => {
  describe('basic advancement', () => {
    it('should not advance when requirements are not met', () => {
      const { service, baseProfile } = setupFn();
      const notReadyProfile = baseProfile;
      const result = service.advanceElement(notReadyProfile);
      expect(result).toEqual(notReadyProfile);
      expect(result.currentElement).toBe('H');
      expect(result.level.atomicNumber).toBe(1);
    });

    it('should advance to next element when requirements are met', () => {
      const { service, createProfile } = setupFn();
      const readyProfile = createProfile({
        level: { atomicNumber: 1, atomicWeight: 4, gameLab: 0 } as PlayerLevel,
      });
      const advanced = service.advanceElement(readyProfile);
      expect(advanced.currentElement).toBe('He');
      expect(advanced.level.atomicNumber).toBe(2);
    });
  });
};

const testPeriodTransitions = (setupFn: SetupFn): void => {
  describe('period transitions', () => {
    it('should handle period transitions correctly', () => {
      const { service, createProfile } = setupFn();
      const readyForPeriod2 = createProfile({
        currentElement: 'He',
        level: {
          atomicNumber: 2,
          atomicWeight: 10,
          gameLab: 0,
        },
      });
      const canAdvanceSpy = vi.spyOn(service, 'canAdvanceElement');
      canAdvanceSpy.mockReturnValue(true);
      const advanced = service.advanceElement(readyForPeriod2);
      expect(advanced.currentElement).toBe('Li');
      expect(advanced.level.gameLab).toBe(1);
      canAdvanceSpy.mockRestore();
    });
  });
};

const testEdgeCases = (setupFn: SetupFn): void => {
  describe('edge cases', () => {
    it('should not advance if already at maximum element', () => {
      const { service, createProfile } = setupFn();
      const lastElement = ELEMENTS_DATA[ELEMENTS_DATA.length - 1];
      const maxElementProfile = createProfile({
        currentElement: lastElement.symbol as ElementSymbol,
        level: {
          atomicNumber: lastElement.atomicNumber,
          atomicWeight: 999,
          gameLab: 7,
        },
      });
      const result = service.advanceElement(maxElementProfile);
      expect(result).toEqual(maxElementProfile);
    });
  });
};

export function testAdvanceElement(setupFn: SetupFn): void {
  describe('advanceElement', () => {
    testBasicAdvancement(setupFn);
    testPeriodTransitions(setupFn);
    testEdgeCases(setupFn);
  });
}
