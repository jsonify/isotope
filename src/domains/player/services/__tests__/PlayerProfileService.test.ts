// src/domains/player/services/__tests__/PlayerProfileService.test.ts
import { expect, describe, test, beforeEach } from 'vitest';

import { INITIAL_PLAYER_PROFILE } from '../../../shared/constants/game-constants';
import { PlayerProfileService } from '../PlayerProfileService';

// Mock localStorage
const localStorageMock = (): Storage => {
  let store: Record<string, string> = {};

  return {
    length: Object.keys(store).length,
    key: (index: number): string | null => Object.keys(store)[index] || null,
    setItem: (key: string, value: string): void => {
      store[key] = value.toString();
    },
    getItem: (key: string): string | null => store[key] || null,
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    },
  };
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock() });

// Breaking up the test suite to avoid max-lines-per-function
describe('PlayerProfileService', () => {
  let service: PlayerProfileService;

  beforeEach(() => {
    localStorage.clear();
    service = new PlayerProfileService();
  });

  test('should create a new profile if none exists', () => {
    const profile = service.getProfile();

    expect(profile.id).toBeDefined();
    expect(profile.currentElement).toBe(INITIAL_PLAYER_PROFILE.currentElement);
    expect(profile.electrons).toBe(INITIAL_PLAYER_PROFILE.electrons);
    expect(profile.unlockedGames).toEqual(INITIAL_PLAYER_PROFILE.unlockedGames);
  });

  test('should retrieve an existing profile', () => {
    // Create a profile first
    const newProfile = service.getProfile();

    // Get it again
    const retrievedProfile = service.getProfile();

    expect(retrievedProfile.id).toBe(newProfile.id);
  });
});

// Separate describe block to avoid max-lines-per-function
describe('PlayerProfileService update operations', () => {
  let service: PlayerProfileService;

  beforeEach(() => {
    localStorage.clear();
    service = new PlayerProfileService();
  });

  test('should update a profile', () => {
    const profile = service.getProfile();
    const updatedProfile = service.updateProfile({ electrons: 10 });

    expect(updatedProfile.electrons).toBe(10);
    expect(updatedProfile.id).toBe(profile.id);
  });

  test('should reset a profile', () => {
    // Create and modify a profile
    const profile = service.getProfile();
    service.updateProfile({ electrons: 50 });

    // Reset it
    const resetProfile = service.resetProfile();

    expect(resetProfile.electrons).toBe(INITIAL_PLAYER_PROFILE.electrons);
    expect(resetProfile.id).not.toBe(profile.id);
  });

  test('should mark tutorial as completed', () => {
    const updatedProfile = service.completeTutorial();
    expect(updatedProfile.tutorialCompleted).toBe(true);
  });
});
