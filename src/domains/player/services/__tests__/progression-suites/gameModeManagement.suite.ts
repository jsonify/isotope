// src/domains/player/services/__tests__/progression-suites/gameModeManagement.suite.ts
import { describe, it, expect } from 'vitest';

import type { PlayerProfile } from '../../../../shared/models/domain-models';
import { GameMode } from '../../../../shared/models/domain-models';

interface TestService {
  isGameModeUnlocked: (profile: PlayerProfile, mode: GameMode) => boolean;
  unlockGameMode: (profile: PlayerProfile, mode: GameMode) => PlayerProfile;
}

interface TestContext {
  service: TestService;
  baseProfile: PlayerProfile;
}

type SetupFn = () => TestContext;

export function testGameModeManagement(setupFn: SetupFn): void {
  describe('game mode management', () => {
    describe('isGameModeUnlocked', () => {
      it('should return true for unlocked game modes', () => {
        const { service, baseProfile } = setupFn();
        expect(service.isGameModeUnlocked(baseProfile, GameMode.TUTORIAL)).toBe(true);
        expect(service.isGameModeUnlocked(baseProfile, GameMode.ELEMENT_MATCH)).toBe(true);
      });

      it('should return false for locked game modes', () => {
        const { service, baseProfile } = setupFn();
        expect(service.isGameModeUnlocked(baseProfile, GameMode.PERIODIC_SORT)).toBe(false);
        expect(service.isGameModeUnlocked(baseProfile, GameMode.ELECTRON_SHELL)).toBe(false);
      });
    });

    describe('unlockGameMode', () => {
      it('should unlock a specific game mode', () => {
        const { service, baseProfile } = setupFn();
        const updated = service.unlockGameMode(baseProfile, GameMode.PERIODIC_SORT);
        expect(updated.unlockedGames).toContain(GameMode.PERIODIC_SORT);
      });

      it('should not modify profile if game is already unlocked', () => {
        const { service, baseProfile } = setupFn();
        const updated = service.unlockGameMode(baseProfile, GameMode.TUTORIAL);
        expect(updated).toEqual(baseProfile);
      });
    });
  });
}
