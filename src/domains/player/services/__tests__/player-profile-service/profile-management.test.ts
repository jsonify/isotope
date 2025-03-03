import { describe, it, expect, beforeEach } from 'vitest';

import { setupTest } from './setup';
import { INITIAL_PLAYER_PROFILE } from '../../../../shared/constants/game-constants';
import { PlayerProfileService } from '../../PlayerProfileService';

class ProfileManagementTests {
  private service!: PlayerProfileService;

  public beforeEach(): void {
    setupTest();
    this.service = new PlayerProfileService();
  }

  public testProfileCreation(): void {
    describe('Profile Creation and Retrieval', () => {
      it('should create a new profile with default values', () => {
        const profile = this.service.getProfile();

        expect(profile).toHaveProperty('id');
        expect(profile.displayName).toBe('New Scientist');
        expect(profile.level).toEqual(INITIAL_PLAYER_PROFILE.level);
        expect(profile.currentElement).toBe(INITIAL_PLAYER_PROFILE.currentElement);
        expect(profile.electrons).toBe(INITIAL_PLAYER_PROFILE.electrons);
        expect(profile.unlockedGames).toEqual(INITIAL_PLAYER_PROFILE.unlockedGames);
        expect(profile.achievements).toEqual([]);
        expect(profile.tutorialCompleted).toBe(false);
        expect(profile.lastLogin).toBeInstanceOf(Date);
        expect(profile.createdAt).toBeInstanceOf(Date);
        expect(profile.updatedAt).toBeInstanceOf(Date);
      });

      it('should retrieve an existing profile from localStorage', () => {
        const initialProfile = this.service.getProfile();
        const retrievedProfile = this.service.getProfile();

        expect(retrievedProfile.id).toBe(initialProfile.id);
        expect(retrievedProfile.displayName).toBe(initialProfile.displayName);
      });

      it('should handle corrupted localStorage data', () => {
        localStorage.setItem('isotope_player_profile', 'invalid json');
        const profile = this.service.getProfile();

        expect(profile).toHaveProperty('id');
        expect(console.error).toHaveBeenCalled();
      });
    });
  }

  public testProfileUpdates(): void {
    describe('Profile Updates', () => {
      it('should update profile fields', () => {
        const updates = {
          displayName: 'Updated Name',
          tutorialCompleted: true,
        };

        const updatedProfile = this.service.updateProfile(updates);

        expect(updatedProfile.displayName).toBe(updates.displayName);
        expect(updatedProfile.tutorialCompleted).toBe(updates.tutorialCompleted);
        expect(updatedProfile.updatedAt).toBeInstanceOf(Date);
      });

      it('should update player level', () => {
        const levelUpdates = {
          atomicNumber: 2,
          atomicWeight: 10,
        };

        const updatedProfile = this.service.updateLevel(levelUpdates);

        expect(updatedProfile.level.atomicNumber).toBe(levelUpdates.atomicNumber);
        expect(updatedProfile.level.atomicWeight).toBe(levelUpdates.atomicWeight);
      });

      it('should record login time', () => {
        const beforeLogin = new Date();
        const profile = this.service.recordLogin();
        const afterLogin = new Date();

        expect(profile.lastLogin.getTime()).toBeGreaterThanOrEqual(beforeLogin.getTime());
        expect(profile.lastLogin.getTime()).toBeLessThanOrEqual(afterLogin.getTime());
      });
    });
  }
}

const tests = new ProfileManagementTests();
describe('PlayerProfileService', () => {
  beforeEach(() => tests.beforeEach());
  tests.testProfileCreation();
  tests.testProfileUpdates();
});
