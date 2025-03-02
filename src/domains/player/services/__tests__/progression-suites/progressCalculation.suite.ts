import { describe, it, expect } from 'vitest';

import { ELEMENTS_DATA } from '../../../../shared/constants/game-constants';
import type {
  ElementSymbol,
  PlayerProfile,
  PlayerLevel,
} from '../../../../shared/models/domain-models';

interface PlayerProgress {
  currentElement: string;
  totalPuzzlesCompleted: number;
  puzzlesRequiredForNext: number;
  currentPeriod: number;
  percentToNextElement: number;
}

interface PeriodProgress {
  currentPeriod: number;
  elementsInPeriod: string[];
  completedInPeriod: number;
}

interface TestService {
  getPlayerProgress: (profile: PlayerProfile) => PlayerProgress;
  getPercentToNextElement: (profile: PlayerProfile) => number;
  getPeriodProgress: (profile: PlayerProfile) => PeriodProgress;
}

interface TestContext {
  service: TestService;
  baseProfile: PlayerProfile;
  createProfile: (data: Partial<PlayerProfile>) => PlayerProfile;
}

type SetupFn = () => TestContext;

const testGeneralProgress = (setupFn: SetupFn): void => {
  it('should return correct progress information', () => {
    const { service, baseProfile } = setupFn();
    const progress = service.getPlayerProgress(baseProfile);

    expect(progress.currentElement).toBe('H');
    expect(progress.totalPuzzlesCompleted).toBe(3);
    expect(progress.puzzlesRequiredForNext).toBe(4);
    expect(progress.currentPeriod).toBe(1);
    expect(progress.percentToNextElement).toBe(75);
  });
};

const testMaximumElement = (setupFn: SetupFn): void => {
  it('should handle edge case when at maximum element', () => {
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

    const progress = service.getPlayerProgress(maxElementProfile);
    expect(progress.puzzlesRequiredForNext).toBe(0);
    expect(progress.percentToNextElement).toBe(100);
  });
};

const testProgressPercentages = (setupFn: SetupFn): void => {
  it('should calculate correct percentage for partial progress', () => {
    const { service, baseProfile } = setupFn();
    expect(service.getPercentToNextElement(baseProfile)).toBe(75);
  });

  it('should return 100% when completed all required puzzles', () => {
    const { service, createProfile } = setupFn();
    const completedProfile = createProfile({
      level: {
        atomicNumber: 1,
        atomicWeight: 4,
        gameLab: 0,
      } as PlayerLevel,
    });
    expect(service.getPercentToNextElement(completedProfile)).toBe(100);
  });
};

const testPeriodProgress = (setupFn: SetupFn): void => {
  it('should return correct period progress information', () => {
    const { service, baseProfile } = setupFn();
    const periodProgress = service.getPeriodProgress(baseProfile);

    expect(periodProgress.currentPeriod).toBe(1);
    expect(Array.isArray(periodProgress.elementsInPeriod)).toBe(true);
    expect(periodProgress.elementsInPeriod).toContain('H');
    expect(periodProgress.completedInPeriod).toBe(1);
  });
};

export function testProgressCalculation(setupFn: SetupFn): void {
  describe('progress calculation', () => {
    describe('getPlayerProgress', () => {
      testGeneralProgress(setupFn);
      testMaximumElement(setupFn);
    });

    describe('getPercentToNextElement', () => {
      testProgressPercentages(setupFn);
    });

    describe('getPeriodProgress', () => {
      testPeriodProgress(setupFn);
    });
  });
}
