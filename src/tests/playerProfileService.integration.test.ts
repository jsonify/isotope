import { describe, it, expect, beforeEach } from 'vitest';

import { ProfileManager } from '../domains/player/services/ProfileManager';

describe('ProfileManager Integration Tests', () => {
  let profileManager: ProfileManager;
  let mockLocalStorage: { [key: string]: string };

  // Mock localStorage
  beforeEach(() => {
    mockLocalStorage = {};

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => mockLocalStorage[key] || null,
        setItem: (key: string, value: string) => {
          mockLocalStorage[key] = value;
        },
        removeItem: (key: string) => {
          delete mockLocalStorage[key];
        },
      },
      writable: true,
    });

    profileManager = new ProfileManager();
  });

  describe('Save/Load Cycle', () => {
    it('should successfully complete a full save/load cycle', () => {
      // Create a new profile
      const profile = profileManager.createProfile('Test Player');

      // Verify profile structure
      expect(profile).toEqual({
        id: expect.any(String),
        displayName: 'Test Player',
        currentElement: 'H',
        level: {
          atomicNumber: 1,
          atomicWeight: 0,
          gameLab: 0,
        },
        lastUpdated: expect.any(String),
      });

      // Save the profile
      const saveResult = profileManager.saveProfile(profile);
      expect(saveResult).toBe(true);

      // Load the profile
      const loadedProfile = profileManager.loadProfile();

      // Verify loaded profile matches saved profile
      expect(loadedProfile).toEqual({
        ...profile,
        lastUpdated: expect.any(String),
      });
    });

    it('should create a new profile when none exists', () => {
      const profile = profileManager.loadProfile();

      expect(profile).toEqual({
        id: expect.any(String),
        displayName: 'Player',
        currentElement: 'H',
        level: {
          atomicNumber: 1,
          atomicWeight: 0,
          gameLab: 0,
        },
        lastUpdated: expect.any(String),
      });
    });

    it('should update lastUpdated timestamp on save', () => {
      const profile = profileManager.createProfile('Test Player');
      const originalTimestamp = profile.lastUpdated;

      // Wait briefly to ensure timestamp changes
      setTimeout(() => {
        profileManager.saveProfile(profile);
        const loadedProfile = profileManager.loadProfile();

        expect(loadedProfile.lastUpdated).not.toBe(originalTimestamp);
        expect(new Date(loadedProfile.lastUpdated).getTime()).toBeGreaterThan(
          new Date(originalTimestamp).getTime()
        );
      }, 1);
    });
  });
});
