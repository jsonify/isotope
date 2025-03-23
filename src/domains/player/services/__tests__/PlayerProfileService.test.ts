import { beforeEach, describe, expect, test, vi } from 'vitest';

import { INITIAL_PLAYER_PROFILE } from '../../../shared/constants/game-constants';
import type { PlayerProfile } from '../../../shared/models/domain-models';
import { PlayerProfileService } from '../PlayerProfileService';

describe('PlayerProfileService', () => {
  let service: PlayerProfileService;
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    // Mock localStorage
    mockLocalStorage = {};
    global.localStorage = {
      getItem: vi.fn((key: string) => mockLocalStorage[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockLocalStorage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockLocalStorage[key];
      }),
      clear: vi.fn(() => {
        mockLocalStorage = {};
      }),
      key: vi.fn((index: number) => Object.keys(mockLocalStorage)[index]),
      length: 0,
    };

    // Initialize service
    service = new PlayerProfileService();
  });

  test('creates new profile when localStorage is empty', () => {
    const profile = service.getProfile();
    expect(profile).toBeDefined();
    expect(profile.id).toBeDefined();
    expect(profile.displayName).toBe('New Scientist');
    expect(profile.electrons).toBe(INITIAL_PLAYER_PROFILE.electrons);
  });

  test('loads existing profile from localStorage', () => {
    // Create and save a profile
    const initialProfile = service.getProfile();
    service.updateProfile({
      displayName: 'Test Scientist',
      electrons: 100,
    });

    // Get a fresh instance and load the profile
    const newService = new PlayerProfileService();
    const loadedProfile = newService.getProfile();

    expect(loadedProfile.id).toBe(initialProfile.id);
    expect(loadedProfile.displayName).toBe('Test Scientist');
    expect(loadedProfile.electrons).toBe(100);
  });

  test('handles localStorage unavailability', () => {
    // Simulate localStorage being unavailable
    const error = new Error('localStorage unavailable');
    vi.spyOn(global.localStorage, 'getItem').mockImplementation(() => {
      throw error;
    });

    const profile = service.getProfile();
    expect(profile).toBeDefined();
    expect(profile.id).toBeDefined();
    expect(profile.electrons).toBe(INITIAL_PLAYER_PROFILE.electrons);
  });

  test('handles storage quota exceeded', () => {
    // Simulate quota exceeded error
    vi.spyOn(global.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    const success = service.saveProfile({
      ...INITIAL_PLAYER_PROFILE,
      id: 'test-id',
    });
    expect(success).toBe(false);
  });

  test('validates profile before saving', () => {
    // Create an invalid profile
    const invalidProfile = {
      id: 'test-id',
      displayName: 'Test Scientist',
      level: INITIAL_PLAYER_PROFILE.level,
      currentElement: INITIAL_PLAYER_PROFILE.currentElement,
      electrons: 'invalid' as unknown as number, // Type assertion to bypass TS
      unlockedGames: INITIAL_PLAYER_PROFILE.unlockedGames,
      achievements: INITIAL_PLAYER_PROFILE.achievements,
      lastLogin: new Date(),
      tutorialCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const success = service.saveProfile(invalidProfile as PlayerProfile);
    expect(success).toBe(false);
  });

  test('handles corrupted profile data', () => {
    // Store corrupted data
    mockLocalStorage['isotope_player_profile'] = 'invalid json';

    const profile = service.getProfile();
    expect(profile).toBeDefined();
    expect(profile.id).toBeDefined();
    expect(profile.electrons).toBe(INITIAL_PLAYER_PROFILE.electrons);
  });

  test('resets profile successfully', () => {
    // Create and save a profile with modifications
    service.updateProfile({
      displayName: 'Test Scientist',
      electrons: 100,
    });

    // Reset the profile
    const resetProfile = service.resetProfile();

    expect(resetProfile.displayName).toBe('New Scientist');
    expect(resetProfile.electrons).toBe(INITIAL_PLAYER_PROFILE.electrons);
    expect(resetProfile.id).not.toBe(undefined);
  });

  test('updates profile fields correctly', () => {
    const updates = {
      displayName: 'Updated Scientist',
      electrons: 200,
    };

    const updatedProfile = service.updateProfile(updates);

    expect(updatedProfile.displayName).toBe(updates.displayName);
    expect(updatedProfile.electrons).toBe(updates.electrons);
  });
});
