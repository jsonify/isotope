import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { PlayerProfileService } from '../domains/player/services/PlayerProfileService';
import { INITIAL_PLAYER_PROFILE } from '../domains/shared/constants/game-constants';
import type { ElementSymbol, PlayerProfile } from '../domains/shared/models/domain-models';
import { GameMode } from '../domains/shared/models/domain-models';

// Type to help with mocking private methods
type PrivatePlayerProfileService = PlayerProfileService & {
  isLocalStorageAvailable: () => boolean;
};

describe('PlayerProfileService Integration Tests', () => {
  let service: PlayerProfileService;

  beforeEach(() => {
    service = new PlayerProfileService();
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clear localStorage after each test
    localStorage.clear();
    vi.restoreAllMocks(); // Restore mocks to avoid interference between tests
  });

  describe('Full Save/Load Cycle', () => {
    it('should save and load a player profile correctly', () => {
      const originalProfile = {
        ...INITIAL_PLAYER_PROFILE,
        id: 'integration-test-id',
        displayName: 'Integration Test Player',
      };
      service.saveProfile(originalProfile);

      const loadedService = new PlayerProfileService(); // Create a new service instance to simulate load
      // Mock the private method using our helper type
      vi.spyOn(
        loadedService as PrivatePlayerProfileService,
        'isLocalStorageAvailable'
      ).mockReturnValue(true);

      const loadedProfile = loadedService.getProfile();

      // Remove timestamp fields before comparison since they'll differ
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { updatedAt, ...restOriginalProfile } = originalProfile;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { updatedAt: updatedAtLoaded, ...restLoadedProfile } = loadedProfile;

      expect(loadedProfile).toBeDefined();
      expect(restLoadedProfile).toEqual(restOriginalProfile);
    });
  });

  describe('Storage Layer Integration', () => {
    it('should call localStorage.setItem when saving profile', () => {
      const setItemSpy = vi.spyOn(localStorage, 'setItem');
      vi.spyOn(service as PrivatePlayerProfileService, 'isLocalStorageAvailable').mockReturnValue(
        true
      );

      const now = new Date();
      const profile: PlayerProfile = {
        ...INITIAL_PLAYER_PROFILE,
        id: 'storage-test-id',
        displayName: 'Storage Test Player',
        level: {
          atomicNumber: 1,
          atomicWeight: 1,
          gameLab: 1,
        },
        currentElement: 'H' as ElementSymbol,
        unlockedGames: [GameMode.TUTORIAL],
        achievements: [],
        lastLogin: now,
        createdAt: now,
        updatedAt: now,
        tutorialCompleted: false,
        electrons: 0,
      };

      service.saveProfile(profile);

      expect(setItemSpy).toHaveBeenCalledTimes(1);
      expect(setItemSpy).toHaveBeenCalledWith('isotope_player_profile', expect.any(String));
    });

    it('should call localStorage.getItem when loading profile', () => {
      const getItemSpy = vi.spyOn(localStorage, 'getItem');
      vi.spyOn(service as PrivatePlayerProfileService, 'isLocalStorageAvailable').mockReturnValue(
        true
      );
      service.getProfile();

      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(getItemSpy).toHaveBeenCalledWith('isotope_player_profile');
    });

    it('should not call localStorage if localStorage is unavailable', () => {
      // Mock isLocalStorageAvailable to return false for this test
      vi.spyOn(service as PrivatePlayerProfileService, 'isLocalStorageAvailable').mockReturnValue(
        false
      );

      const setItemSpy = vi.spyOn(localStorage, 'setItem');
      const getItemSpy = vi.spyOn(localStorage, 'getItem');

      // Try to save and get profile
      service.saveProfile({ ...INITIAL_PLAYER_PROFILE, id: 'unavailable-test-id' });
      service.getProfile();

      // Verify localStorage methods were not called
      expect(setItemSpy).not.toHaveBeenCalled();
      expect(getItemSpy).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully when saving', () => {
      vi.spyOn(service as PrivatePlayerProfileService, 'isLocalStorageAvailable').mockReturnValue(
        true
      );
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('Mock storage error');
      });

      const profile = { ...INITIAL_PLAYER_PROFILE, id: 'error-test-id' };
      const result = service.saveProfile(profile);

      expect(result).toBe(false);
    });

    it('should create a new profile when localStorage is unavailable during load', () => {
      // First ensure we have nothing in storage
      localStorage.clear();

      // Mock isLocalStorageAvailable to return false
      vi.spyOn(service as PrivatePlayerProfileService, 'isLocalStorageAvailable').mockReturnValue(
        false
      );

      // Get profile should create a new one
      const profile = service.getProfile();

      // Verify we got a valid profile with expected structure
      expect(profile).toBeDefined();
      expect(profile.id).toBeDefined();
      expect(profile.displayName).toBe('New Scientist');
    });
  });
});
