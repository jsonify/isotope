import { describe, expect, it } from 'vitest';

import { PlayerProfileService } from '../domains/player/services/PlayerProfileService';
import { INITIAL_PLAYER_PROFILE } from '../domains/shared/constants/game-constants';
import { CURRENT_PROFILE_VERSION } from '../domains/shared/models/domain-models';

describe('PlayerProfileService', () => {
  let service: PlayerProfileService;

  beforeEach(() => {
    service = new PlayerProfileService();
  });

  describe('serializeProfile', () => {
    it('should serialize a PlayerProfile to a JSON string', () => {
      const profile = { ...INITIAL_PLAYER_PROFILE, id: 'test-id', displayName: 'Test Player' };
      const serialized = service.serializeProfile(profile);
      expect(typeof serialized).toBe('string');
      expect(serialized).toContain('"id":"test-id"');
      expect(serialized).toContain('"displayName":"Test Player"');
    });

    it('should handle Date objects correctly', () => {
      const now = new Date();
      const profile = { ...INITIAL_PLAYER_PROFILE, id: 'date-test-id', lastLogin: now };
      const serialized = service.serializeProfile(profile);
      expect(serialized).toContain(`"lastLogin":"${now.toISOString()}"`);

      const deserialized = service.deserializeProfile(serialized);
      expect(deserialized.lastLogin.toISOString()).toBe(now.toISOString());
    });
  });

  describe('deserializeProfile', () => {
    it('should deserialize a JSON string to a PersistedPlayerProfile', () => {
      const serializedProfile = service.serializeProfile({
        ...INITIAL_PLAYER_PROFILE,
        id: 'test-id',
        displayName: 'Test Player',
      });
      const deserialized = service.deserializeProfile(serializedProfile);
      expect(deserialized).toBeDefined();
      expect(deserialized.id).toBe('test-id');
      expect(deserialized.displayName).toBe('Test Player');
      expect(deserialized.schemaVersion).toBe(CURRENT_PROFILE_VERSION);
    });

    it('should handle profile with older schema version', () => {
      const serializedProfile = JSON.stringify({
        ...INITIAL_PLAYER_PROFILE,
        id: 'old-schema-profile-id', // Add a valid id for older schema version
        schemaVersion: 0,
      });
      const deserialized = service.deserializeProfile(serializedProfile);
      expect(deserialized).toBeDefined();
      expect(deserialized.schemaVersion).toBe(CURRENT_PROFILE_VERSION); // Should update to current version
    });

    it('should throw error if validation fails after deserialization', () => {
      const invalidProfile = JSON.stringify({ ...INITIAL_PLAYER_PROFILE, id: null }); // id is required
      expect(() => {
        service.deserializeProfile(invalidProfile);
      }).toThrowError('Profile validation failed');
    });
  });
});
