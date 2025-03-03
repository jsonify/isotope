import { describe, it, expect, beforeEach } from 'vitest';

import { setupTest } from './setup';
import { PlayerProfileService } from '../../PlayerProfileService';

describe('PlayerProfileService - Electron Management', () => {
  let service: PlayerProfileService;

  beforeEach(() => {
    setupTest();
    service = new PlayerProfileService();
  });

  it('should award electrons', () => {
    const initialProfile = service.getProfile();
    const awardAmount = 50;
    const profile = service.awardElectrons(awardAmount);

    expect(profile.electrons).toBe(initialProfile.electrons + awardAmount);
  });

  describe('electron spending', () => {
    it('should successfully spend electrons when sufficient', () => {
      service.awardElectrons(100);
      const { success, profile } = service.spendElectrons(50);

      expect(success).toBe(true);
      expect(profile.electrons).toBe(50);
    });

    it('should fail to spend electrons when insufficient', () => {
      const initialProfile = service.getProfile();
      const { success, profile } = service.spendElectrons(initialProfile.electrons + 1);

      expect(success).toBe(false);
      expect(profile.electrons).toBe(initialProfile.electrons);
    });

    it('should maintain electron balance after multiple transactions', () => {
      service.awardElectrons(100);
      service.spendElectrons(30);
      const { success, profile } = service.spendElectrons(50);

      expect(success).toBe(true);
      expect(profile.electrons).toBe(20);
    });
  });
});
