import { describe, it, expect } from 'vitest';

import type { PlayerProfile, PlayerLevel } from '../../../../shared/models/domain-models';
import { GameMode } from '../../../../shared/models/domain-models';

interface TestService {
  unlockPeriodGames: (profile: PlayerProfile, period?: number) => PlayerProfile;
}

interface TestContext {
  service: TestService;
  createProfile: (data: Partial<PlayerProfile>) => PlayerProfile;
  baseProfile: PlayerProfile;
}

type SetupFn = () => TestContext;

const testPeriodUnlocks = (setupFn: SetupFn): void => {
  describe('unlocking period games', () => {
    it('should unlock Period 2 games', () => {
      const { service, createProfile } = setupFn();
      const period2Profile = createProfile({
        currentElement: 'Li',
        level: {
          atomicNumber: 3,
          atomicWeight: 0,
          gameLab: 1,
        } as PlayerLevel,
      });

      const updated = service.unlockPeriodGames(period2Profile);
      expect(updated.unlockedGames!).toContain(GameMode.PERIODIC_SORT);
      expect(updated.unlockedGames!).toContain(GameMode.ELECTRON_SHELL);
    });

    it('should unlock Period 3 games', () => {
      const { service, createProfile } = setupFn();
      const period3Profile = createProfile({
        currentElement: 'Na',
        level: {
          atomicNumber: 11,
          atomicWeight: 0,
          gameLab: 2,
        } as PlayerLevel,
      });

      const updated = service.unlockPeriodGames(period3Profile);
      expect(updated.unlockedGames!).toContain(GameMode.COMPOUND_BUILD);
      expect(updated.unlockedGames!).toContain(GameMode.ELEMENT_QUIZ);
    });
  });
};

const testGameModeHandling = (setupFn: SetupFn): void => {
  it('should not duplicate already unlocked games', () => {
    const { service, createProfile } = setupFn();
    const profileWithGames = createProfile({
      currentElement: 'Li',
      level: {
        atomicNumber: 3,
        atomicWeight: 0,
        gameLab: 1,
      } as PlayerLevel,
      unlockedGames: [
        GameMode.TUTORIAL,
        GameMode.ELEMENT_MATCH,
        GameMode.PERIODIC_SORT, // Already unlocked
      ],
    });

    const updated = service.unlockPeriodGames(profileWithGames);
    const periodicSortCount = updated.unlockedGames!.filter(
      game => game === GameMode.PERIODIC_SORT
    ).length;

    expect(periodicSortCount).toBe(1);
    expect(updated.unlockedGames!).toContain(GameMode.ELECTRON_SHELL);
    expect(updated.unlockedGames!.length).toBe(4);
  });
};

const testEdgeCases = (setupFn: SetupFn): void => {
  it('should handle non-existent period gracefully', () => {
    const { service, baseProfile } = setupFn();
    const updated = service.unlockPeriodGames(baseProfile, 99);
    expect(updated.unlockedGames).toEqual(baseProfile.unlockedGames);
  });
};

export function testUnlockPeriodGames(setupFn: SetupFn): void {
  describe('unlockPeriodGames', () => {
    testPeriodUnlocks(setupFn);
    testGameModeHandling(setupFn);
    testEdgeCases(setupFn);
  });
}
