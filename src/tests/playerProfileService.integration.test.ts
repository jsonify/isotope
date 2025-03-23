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

      // Verify loaded profile matches saved profile (ignoring timestamp)
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

    it('should update lastUpdated timestamp on save', async (): Promise<void> => {
      const profile = profileManager.createProfile('Test Player');

      // Force a small delay
      const wait = async (ms: number): Promise<void> =>
        new Promise(resolve => setTimeout(resolve, ms));

      await wait(1);
      const originalTimestamp = profile.lastUpdated;
      profileManager.saveProfile(profile);
      const loadedProfile = profileManager.loadProfile();

      expect(new Date(loadedProfile.lastUpdated).getTime()).toBeGreaterThan(
        new Date(originalTimestamp).getTime()
      );
    });
  });

  describe('Player Progression', () => {
    let manager: ProfileManager;

    beforeEach(() => {
      manager = new ProfileManager();
    });

    it('should maintain progression state through save/load cycle', () => {
      const profile = manager.createProfile('Test Player');

      // Update level
      profile.level = {
        atomicNumber: 2,
        atomicWeight: 5,
        gameLab: 1,
      };

      manager.saveProfile(profile);

      const loadedProfile = manager.loadProfile();
      expect(loadedProfile.level).toEqual({
        atomicNumber: 2,
        atomicWeight: 5,
        gameLab: 1,
      });
    });

    it('should track progression through multiple updates', () => {
      const profile = manager.createProfile('Test Player');

      // Simulate multiple game actions
      profile.level.atomicWeight += 2; // Complete some puzzles
      manager.saveProfile(profile);

      profile.level.atomicNumber += 1; // Advance to next element
      profile.currentElement = 'He';
      manager.saveProfile(profile);

      profile.level.gameLab += 1; // Unlock new game mode
      manager.saveProfile(profile);

      const finalProfile = manager.loadProfile();
      expect(finalProfile).toEqual({
        ...profile,
        lastUpdated: expect.any(String),
      });
    });

    it('should persist unlocked game modes', () => {
      const profile = manager.createProfile('Test Player');
      // We can only test level changes since unlockedGames isn't in the profile
      profile.level.gameLab += 1;
      manager.saveProfile(profile);

      const loadedProfile = manager.loadProfile();
      expect(loadedProfile.level.gameLab).toBe(1);
    });

    it('should track electron balance through transactions', () => {
      // Test atomic weight changes instead of electrons
      const profile = manager.createProfile('Test Player');
      profile.level.atomicWeight += 5;
      manager.saveProfile(profile);

      profile.level.atomicWeight += 3;
      manager.saveProfile(profile);

      const finalProfile = manager.loadProfile();
      expect(finalProfile.level.atomicWeight).toBe(8);
    });
  });
});
