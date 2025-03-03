import { describe, it, expect, beforeEach } from 'vitest';

import { setupTest } from './setup';
import type { Achievement } from '../../../../shared/models/domain-models';
import { PlayerProfileService } from '../../PlayerProfileService';

describe('PlayerProfileService - Achievement Management', () => {
  let service: PlayerProfileService;

  beforeEach(() => {
    setupTest();
    service = new PlayerProfileService();
  });

  const testAchievement: Achievement = {
    id: 'test-achievement',
    name: 'Test Achievement',
    description: 'Achievement for testing',
    dateUnlocked: new Date(0), // Service should override this with current date
    category: 'progression',
    electronReward: 100,
  };

  it('should add new achievement', () => {
    const profile = service.addAchievement(testAchievement);

    expect(profile.achievements).toHaveLength(1);
    expect(profile.achievements[0].id).toBe(testAchievement.id);
  });

  it('should not add duplicate achievements', () => {
    service.addAchievement(testAchievement);
    const profile = service.addAchievement(testAchievement);

    expect(profile.achievements).toHaveLength(1);
  });

  it('should properly store achievement unlock date', () => {
    const beforeUnlock = new Date();
    const profile = service.addAchievement(testAchievement);
    const afterUnlock = new Date();

    const achievement = profile.achievements[0];
    const unlockTime = achievement.dateUnlocked.getTime();

    expect(unlockTime).toBeGreaterThanOrEqual(beforeUnlock.getTime());
    expect(unlockTime).toBeLessThanOrEqual(afterUnlock.getTime());
  });
});
