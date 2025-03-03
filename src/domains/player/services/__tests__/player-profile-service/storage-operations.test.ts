import { describe, it, expect, beforeEach, vi } from 'vitest';

import { setupTest } from './setup';
import { PlayerProfileService } from '../../PlayerProfileService';

class StorageOperationsTests {
  private service!: PlayerProfileService;

  public beforeEach(): void {
    setupTest();
    this.service = new PlayerProfileService();
  }

  public testStorageOperations(): void {
    describe('Storage Operations', () => {
      it('should handle storage save failures', () => {
        // Mock localStorage.setItem to throw an error
        const mockError = new Error('Storage quota exceeded');
        localStorage.setItem = vi.fn().mockImplementation(() => {
          throw mockError;
        });

        const success = this.service.saveProfile(this.service.getProfile());

        expect(success).toBe(false);
        expect(console.error).toHaveBeenCalled();
      });

      it('should preserve date objects when saving and loading', () => {
        const initialProfile = this.service.getProfile();
        const loadedProfile = this.service.getProfile();

        expect(loadedProfile.lastLogin).toBeInstanceOf(Date);
        expect(loadedProfile.createdAt).toBeInstanceOf(Date);
        expect(loadedProfile.updatedAt).toBeInstanceOf(Date);

        expect(loadedProfile.lastLogin.getTime()).toBe(initialProfile.lastLogin.getTime());
        expect(loadedProfile.createdAt.getTime()).toBe(initialProfile.createdAt.getTime());
        expect(loadedProfile.updatedAt.getTime()).toBe(initialProfile.updatedAt.getTime());
      });

      it('should reset profile to initial state', () => {
        // Set up some changes first
        this.service.updateProfile({
          displayName: 'Test Name',
          tutorialCompleted: true,
        });
        this.service.awardElectrons(100);

        // Reset profile
        const resetProfile = this.service.resetProfile();

        expect(resetProfile.displayName).toBe('New Scientist');
        expect(resetProfile.electrons).toBe(0);
        expect(resetProfile.tutorialCompleted).toBe(false);
        expect(resetProfile.achievements).toEqual([]);
      });
    });
  }
}

const tests = new StorageOperationsTests();
describe('PlayerProfileService - Storage Operations', () => {
  beforeEach(() => tests.beforeEach());
  tests.testStorageOperations();
});
