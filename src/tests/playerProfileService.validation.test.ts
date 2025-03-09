import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';

import { PlayerProfileService } from '../domains/player/services/PlayerProfileService';
import { INITIAL_PLAYER_PROFILE } from '../domains/shared/constants/game-constants';
import { CURRENT_PROFILE_VERSION } from '../domains/shared/models/domain-models';
import type { PlayerProfile, PersistedPlayerProfile } from '../domains/shared/models/domain-models';

const mockLogService = {
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
};

vi.mock('../domains/shared/services/LogService', () => ({
  LogService: {
    getInstance: (): typeof mockLogService => mockLogService,
  },
}));

describe('PlayerProfileService - Validation and Serialization', () => {
  let service: PlayerProfileService;
  let logServiceErrorSpy: ReturnType<typeof vi.spyOn>;

  const createTestProfile = (overrides: Partial<PlayerProfile> = {}): PlayerProfile => ({
    ...INITIAL_PLAYER_PROFILE,
    id: 'test-id',
    displayName: 'Test Player',
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    logServiceErrorSpy = vi.spyOn(mockLogService, 'error');
    service = new PlayerProfileService();
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Validation Behavior', () => {
    it('should reject profile with missing required fields', () => {
      const invalidProfile = { ...createTestProfile() };
      delete (invalidProfile as Partial<PlayerProfile>).id;

      const result = service.saveProfile(invalidProfile);
      expect(result).toBe(false);
      expect(logServiceErrorSpy).toHaveBeenCalledWith(
        'PlayerProfileService',
        'Validation Error',
        expect.objectContaining({
          errors: expect.arrayContaining(['Missing required field: id']),
        })
      );
    });

    it('should reject profile with invalid field types', () => {
      const invalidProfile = createTestProfile({
        electrons: '100' as unknown as number,
      });

      const result = service.saveProfile(invalidProfile);
      expect(result).toBe(false);
      expect(logServiceErrorSpy).toHaveBeenCalledWith(
        'PlayerProfileService',
        'Validation Error',
        expect.any(Object)
      );
    });
  });

  describe('Schema Version Handling', () => {
    it('should handle missing schema version', async () => {
      const noVersionProfile = createTestProfile();
      delete (noVersionProfile as Partial<PersistedPlayerProfile>).schemaVersion;
      const serialized = JSON.stringify(noVersionProfile);

      const result = service.deserializeProfile(serialized);
      expect(result.schemaVersion).toBe(CURRENT_PROFILE_VERSION);
      expect(mockLogService.warn).toHaveBeenCalledWith(
        'PlayerProfileService',
        'Schema Version Missing',
        {
          message: 'Profile loaded without schema version',
        }
      );
    });

    it('should handle outdated schema version', () => {
      const oldVersionProfile = createTestProfile({
        schemaVersion: CURRENT_PROFILE_VERSION - 1,
      } as Partial<PersistedPlayerProfile>);

      const serialized = JSON.stringify(oldVersionProfile);
      const result = service.deserializeProfile(serialized);

      expect(result.schemaVersion).toBe(CURRENT_PROFILE_VERSION);
    });
  });

  describe('Date Handling', () => {
    it('should handle invalid date strings', () => {
      const invalidDateProfile = createTestProfile({
        lastLogin: 'invalid-date' as unknown as Date,
      });

      expect(() => service.serializeProfile(invalidDateProfile)).toThrow();
      expect(logServiceErrorSpy).toHaveBeenCalled();
    });

    it('should handle null dates', () => {
      const nullDateProfile = createTestProfile({
        lastLogin: null as unknown as Date,
      });

      expect(() => service.serializeProfile(nullDateProfile)).toThrow();
      expect(logServiceErrorSpy).toHaveBeenCalled();
    });

    it('should correctly parse valid dates', () => {
      const now = new Date();
      const validDateProfile = createTestProfile({
        lastLogin: now,
      });

      const serialized = service.serializeProfile(validDateProfile);
      const deserialized = service.deserializeProfile(serialized);
      expect(deserialized.lastLogin.toISOString()).toBe(now.toISOString());
    });
  });
});
