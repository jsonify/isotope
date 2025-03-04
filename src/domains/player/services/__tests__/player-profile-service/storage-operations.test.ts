import { describe, it, expect, beforeEach, vi } from 'vitest';

import { setupTest, mockDateWith, getTestDate } from './setup';
import { PlayerProfileService } from '../../PlayerProfileService';

class StorageOperationsTests {
  private service!: PlayerProfileService;
  private readonly TEST_STORAGE_KEY = 'isotope_player_profile_test';

  public beforeEach(): void {
    setupTest();
    this.service = new PlayerProfileService();
  }

  private testStorageSaveFailure(): void {
    it('should handle storage save failures gracefully', () => {
      // Mock localStorage.setItem to throw an error
      const mockError = new Error('Storage quota exceeded');
      localStorage.setItem = vi.fn().mockImplementation(() => {
        throw mockError;
      });

      const success = this.service.saveProfile(this.service.getProfile());

      expect(success).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  }

  private testDatePreservation(): void {
    it('should preserve date objects with correct timestamps when saving and loading', () => {
      const testDate = getTestDate();
      const cleanupDateMock = mockDateWith(testDate);
      setupTest();

      try {
        this.service['storageKey'] = this.TEST_STORAGE_KEY;
        localStorage.removeItem(this.TEST_STORAGE_KEY);
        const profile = this.service.resetProfile();

        // Verify created profile dates
        expect(profile.lastLogin).toBeInstanceOf(Date);
        expect(profile.createdAt).toBeInstanceOf(Date);
        expect(profile.lastLogin.getTime()).toBe(testDate.getTime());
        expect(profile.createdAt.getTime()).toBe(testDate.getTime());

        // Verify loaded profile dates
        const loadedProfile = this.service.getProfile();
        expect(loadedProfile.lastLogin).toBeInstanceOf(Date);
        expect(loadedProfile.createdAt).toBeInstanceOf(Date);
        expect(loadedProfile.lastLogin.getTime()).toBe(testDate.getTime());
        expect(loadedProfile.createdAt.getTime()).toBe(testDate.getTime());
      } finally {
        cleanupDateMock();
        localStorage.removeItem(this.TEST_STORAGE_KEY);
      }
    });
  }

  private testProfileReset(): void {
    it('should reset profile to initial state correctly', () => {
      // Set up some changes first
      this.service.updateProfile({
        displayName: 'Test Name',
        tutorialCompleted: true,
      });
      this.service.awardElectrons(100);

      const resetProfile = this.service.resetProfile();

      expect(resetProfile.displayName).toBe('New Scientist');
      expect(resetProfile.electrons).toBe(0);
      expect(resetProfile.tutorialCompleted).toBe(false);
      expect(resetProfile.achievements).toEqual([]);
    });
  }

  public runAllTests(): void {
    describe('Storage Operations', () => {
      describe('Save Operations', () => {
        this.testStorageSaveFailure();
      });

      describe('Date Handling', () => {
        this.testDatePreservation();
      });

      describe('Profile Management', () => {
        this.testProfileReset();
      });
    });
  }
}

const tests = new StorageOperationsTests();
describe('PlayerProfileService - Storage Operations', () => {
  beforeEach(() => tests.beforeEach());
  tests.runAllTests();
});
