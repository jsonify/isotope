// src/domains/player/services/PlayerProfileService.ts
import { v4 as uuidv4 } from 'uuid';

import { INITIAL_PLAYER_PROFILE } from '../../shared/constants/game-constants';
import type { PlayerProfile } from '../../shared/models/domain-models';

export class PlayerProfileService {
  private storageKey = 'isotope_player_profile';

  /**
   * Get the current player profile from localStorage or create a new one
   */
  public getProfile(): PlayerProfile {
    const storedProfile = localStorage.getItem(this.storageKey);

    if (storedProfile !== null) {
      try {
        const parsedProfile = JSON.parse(storedProfile) as PlayerProfile;

        // Convert date strings back to Date objects
        return {
          ...parsedProfile,
          lastLogin: new Date(parsedProfile.lastLogin),
          createdAt: new Date(parsedProfile.createdAt),
          updatedAt: new Date(parsedProfile.updatedAt),
          achievements: parsedProfile.achievements.map(achievement => ({
            ...achievement,
            dateUnlocked: new Date(achievement.dateUnlocked),
          })),
        };
      } catch (error) {
        console.error('Error parsing stored profile:', error);
        return this.createNewProfile();
      }
    }

    return this.createNewProfile();
  }

  /**
   * Save the player profile to localStorage
   */
  public saveProfile(profile: PlayerProfile): void {
    // Update the lastLogin and updatedAt dates
    const updatedProfile = {
      ...profile,
      updatedAt: new Date(),
    };

    localStorage.setItem(this.storageKey, JSON.stringify(updatedProfile));
  }

  /**
   * Create a new player profile
   */
  private createNewProfile(): PlayerProfile {
    const now = new Date();
    const newProfile: PlayerProfile = {
      ...INITIAL_PLAYER_PROFILE,
      id: uuidv4(),
      lastLogin: now,
      createdAt: now,
      updatedAt: now,
    };

    this.saveProfile(newProfile);
    return newProfile;
  }

  /**
   * Update specific fields in the player profile
   */
  public updateProfile(updates: Partial<PlayerProfile>): PlayerProfile {
    const currentProfile = this.getProfile();

    const updatedProfile = {
      ...currentProfile,
      ...updates,
      updatedAt: new Date(),
    };

    this.saveProfile(updatedProfile);
    return updatedProfile;
  }

  /**
   * Reset the player profile (for testing or user request)
   */
  public resetProfile(): PlayerProfile {
    localStorage.removeItem(this.storageKey);
    return this.createNewProfile();
  }

  /**
   * Update last login time
   */
  public recordLogin(): PlayerProfile {
    return this.updateProfile({ lastLogin: new Date() });
  }

  /**
   * Mark tutorial as completed
   */
  public completeTutorial(): PlayerProfile {
    return this.updateProfile({ tutorialCompleted: true });
  }
}
