import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';

import { PlayerProfileService } from '../domains/player/services/PlayerProfileService';
import { INITIAL_PLAYER_PROFILE } from '../domains/shared/constants/game-constants';
import type { PlayerProfile } from '../domains/shared/models/domain-models';

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

describe('PlayerProfileService - Basic Features', () => {
  let service: PlayerProfileService;
  let logServiceErrorSpy: ReturnType<typeof vi.spyOn>;
  let logServiceInfoSpy: ReturnType<typeof vi.spyOn>;

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
    logServiceInfoSpy = vi.spyOn(mockLogService, 'info');
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
  });
});
