import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';

import { PlayerProfileService } from '../domains/player/services/PlayerProfileService';
import { INITIAL_PLAYER_PROFILE } from '../domains/shared/constants/game-constants';
import { CURRENT_PROFILE_VERSION } from '../domains/shared/models/domain-models';
import type {
  PlayerProfile,
  Achievement,
  PersistedPlayerProfile,
} from '../domains/shared/models/domain-models';
const mockLogService = {
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
};

vi.mock('../domains/shared/services/LogService', () => {
  return {
    LogService: {
      getInstance: (): typeof mockLogService => mockLogService,
    },
  };
});

describe('PlayerProfileService', () => {
  let service: PlayerProfileService;
  let logServiceErrorSpy: ReturnType<typeof vi.spyOn>;
  let logServiceInfoSpy: ReturnType<typeof vi.spyOn>;

  const createTestProfile = (overrides: Partial<PlayerProfile> = {}): PlayerProfile => ({
    ...INITIAL_PLAYER_PROFILE,
    id: 'test-id',
    displayName: 'Test Player',
    ...overrides,
  });

  const createTestAchievement = (overrides: Partial<Achievement> = {}): Achievement => ({
    id: 'test-achievement',
    name: 'Test Achievement',
    description: 'Achievement for testing',
    category: 'progression',
    electronReward: 100,
    dateUnlocked: new Date(),
    ...overrides,
  });

  beforeEach(() => {
    // Reset mocks and storage
    vi.clearAllMocks();
    localStorage.clear();

    // Assign spies
    logServiceErrorSpy = vi.spyOn(mockLogService, 'error');
    logServiceInfoSpy = vi.spyOn(mockLogService, 'info');

    // Create new service instance
    service = new PlayerProfileService();
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Error Logging', () => {
    it('should log errors with correct format and timestamp', () => {
      const invalidProfile = JSON.stringify({ ...createTestProfile(), id: null });

      try {
        service.deserializeProfile(invalidProfile);
      } catch {
        // Error should be caught and logged
      }

      expect(logServiceErrorSpy).toHaveBeenCalled();
      expect(logServiceErrorSpy).toHaveBeenCalledWith(
        'PlayerProfileService',
        expect.any(String),
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it('should log successful operations with correct format', () => {
      const profile = createTestProfile();
      service.saveProfile(profile);

      expect(logServiceInfoSpy).toHaveBeenCalled();
      expect(logServiceInfoSpy).toHaveBeenCalledWith(
        'PlayerProfileService',
        'Profile saved successfully'
      );
    });
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
        electrons: '100' as unknown as number, // Type assertion for test case
      });

      const result = service.saveProfile(invalidProfile);
      expect(result).toBe(false);
      expect(logServiceErrorSpy).toHaveBeenCalledWith(
        'PlayerProfileService',
        'Validation Error',
        expect.any(Object)
      );
    });

    it('should validate dates in achievements', () => {
      const invalidProfile = createTestProfile({
        achievements: [createTestAchievement({ dateUnlocked: 'invalid-date' as unknown as Date })],
      });

      expect(() => service.serializeProfile(invalidProfile)).toThrow();
      expect(logServiceErrorSpy).toHaveBeenCalled();
    });
  });

  describe('Recovery Mechanisms', () => {
    it('should create new profile when localStorage is corrupted', () => {
      localStorage.setItem('isotope_player_profile', 'corrupted-data{]}');
      const profile = service.getProfile();

      expect(profile).toBeDefined();
      expect(profile.id).toBeDefined();
      expect(logServiceErrorSpy).toHaveBeenCalledWith(
        'PlayerProfileService',
        'Profile Load Error',
        expect.any(Object)
      );
    });

    it('should handle localStorage unavailability', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage unavailable');
      });

      const profile = service.getProfile();
      expect(profile).toBeDefined();
      expect(profile.id).toBeDefined();
      expect(logServiceErrorSpy).toHaveBeenCalledWith(
        'PlayerProfileService',
        'Storage Error: Cannot save profile - localStorage unavailable'
      );

      setItemSpy.mockRestore();
    });

    it('should maintain data integrity during recovery', () => {
      // Corrupt the storage
      localStorage.setItem('isotope_player_profile', 'corrupted-data');

      const profile = service.getProfile();
      expect(profile).toEqual(
        expect.objectContaining({
          ...INITIAL_PLAYER_PROFILE,
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          lastLogin: expect.any(Date),
        })
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
      // Focus on verifying that the schema version gets updated correctly
      const oldVersionProfile = createTestProfile({
        schemaVersion: CURRENT_PROFILE_VERSION - 1,
      } as Partial<PersistedPlayerProfile>);

      const serialized = JSON.stringify(oldVersionProfile);
      const result = service.deserializeProfile(serialized);

      // The primary functionality we care about is that the schema gets updated
      expect(result.schemaVersion).toBe(CURRENT_PROFILE_VERSION);
    });
  });

  describe('Date Parsing', () => {
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
