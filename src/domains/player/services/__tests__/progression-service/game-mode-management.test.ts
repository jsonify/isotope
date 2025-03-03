import { describe, it, expect } from 'vitest';

import { setupTest } from './setup';
import { GameMode } from '../../../../shared/models/domain-models';

describe('ProgressionService - Game Mode Management', () => {
  const { service, baseProfile } = setupTest();

  describe('period-based game unlocking', () => {
    it('should unlock correct games for period 1', () => {
      const result = service.unlockPeriodGames(baseProfile, 1);
      expect(result.unlockedGames).toContain(GameMode.TUTORIAL);
      expect(result.unlockedGames).toContain(GameMode.ELEMENT_MATCH);
    });

    it('should unlock correct games for period 2', () => {
      const result = service.unlockPeriodGames(baseProfile, 2);
      expect(result.unlockedGames).toContain(GameMode.PERIODIC_SORT);
      expect(result.unlockedGames).toContain(GameMode.ELECTRON_SHELL);
    });

    it('should not duplicate already unlocked games', () => {
      const profile = {
        ...baseProfile,
        unlockedGames: [GameMode.TUTORIAL, GameMode.ELEMENT_MATCH],
      };

      const result = service.unlockPeriodGames(profile, 1);
      expect(result.unlockedGames.filter(g => g === GameMode.TUTORIAL)).toHaveLength(1);
      expect(result.unlockedGames.filter(g => g === GameMode.ELEMENT_MATCH)).toHaveLength(1);
    });
  });

  describe('individual game management', () => {
    it('should correctly check if game mode is unlocked', () => {
      expect(service.isGameModeUnlocked(baseProfile, GameMode.TUTORIAL)).toBe(true);
      expect(service.isGameModeUnlocked(baseProfile, GameMode.ELEMENT_MATCH)).toBe(false);
    });

    it('should unlock a specific game mode', () => {
      const result = service.unlockGameMode(baseProfile, GameMode.ELEMENT_MATCH);
      expect(result.unlockedGames).toContain(GameMode.ELEMENT_MATCH);
    });

    it('should preserve existing unlocked games when unlocking new one', () => {
      const initial = service.unlockGameMode(baseProfile, GameMode.ELEMENT_MATCH);
      const result = service.unlockGameMode(initial, GameMode.PERIODIC_SORT);

      expect(result.unlockedGames).toContain(GameMode.ELEMENT_MATCH);
      expect(result.unlockedGames).toContain(GameMode.PERIODIC_SORT);
      expect(result.unlockedGames.length).toBe(initial.unlockedGames.length + 1);
    });
  });
});
