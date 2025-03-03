import { describe, it, expect, beforeEach } from 'vitest';

import { setupTest } from './setup';
import { GameMode } from '../../../../shared/models/domain-models';
import { PlayerProfileService } from '../../PlayerProfileService';

describe('PlayerProfileService - Game Mode Management', () => {
  let service: PlayerProfileService;

  beforeEach(() => {
    setupTest();
    service = new PlayerProfileService();
  });

  it('should unlock new game mode', () => {
    const profile = service.unlockGameMode(GameMode.ELEMENT_MATCH);

    expect(profile.unlockedGames).toContain(GameMode.ELEMENT_MATCH);
  });

  it('should not duplicate unlocked game modes', () => {
    service.unlockGameMode(GameMode.ELEMENT_MATCH);
    const profile = service.unlockGameMode(GameMode.ELEMENT_MATCH);

    expect(profile.unlockedGames.filter(mode => mode === GameMode.ELEMENT_MATCH)).toHaveLength(1);
  });

  it('should maintain order of unlocked games', () => {
    const initialProfile = service.getProfile();
    expect(initialProfile.unlockedGames).toEqual([GameMode.TUTORIAL]);

    service.unlockGameMode(GameMode.ELEMENT_MATCH);
    service.unlockGameMode(GameMode.PERIODIC_SORT);
    const profile = service.unlockGameMode(GameMode.ELECTRON_SHELL);

    // Verify that new games are added in order after the tutorial
    expect(profile.unlockedGames.slice(1)).toEqual([
      GameMode.ELEMENT_MATCH,
      GameMode.PERIODIC_SORT,
      GameMode.ELECTRON_SHELL,
    ]);
  });

  it('should preserve existing unlocked games when adding new one', () => {
    const initialGames = service.unlockGameMode(GameMode.ELEMENT_MATCH).unlockedGames;
    const updatedProfile = service.unlockGameMode(GameMode.PERIODIC_SORT);

    expect(updatedProfile.unlockedGames).toContain(GameMode.ELEMENT_MATCH);
    expect(updatedProfile.unlockedGames).toContain(GameMode.PERIODIC_SORT);
    expect(updatedProfile.unlockedGames.length).toBe(initialGames.length + 1);
  });
});
