// src/domains/player/services/PlayerProfileService.ts
import { v4 as uuidv4 } from 'uuid';

import { INITIAL_PLAYER_PROFILE } from '../../shared/constants/game-constants';
import type {
  PlayerProfile,
  PlayerLevel,
  ElementSymbol,
  Achievement,
} from '../../shared/models/domain-models';

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
  public saveProfile(profile: PlayerProfile): boolean {
    try {
      // Update the lastLogin and updatedAt dates
      const updatedProfile = {
        ...profile,
        updatedAt: new Date(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(updatedProfile));
      return true;
    } catch (error) {
      console.error('Failed to save player profile:', error);
      return false;
    }
  }

  /**
   * Create a new player profile
   */
  private createNewProfile(displayName: string = 'New Scientist'): PlayerProfile {
    const now = new Date();
    const newProfile: PlayerProfile = {
      ...INITIAL_PLAYER_PROFILE,
      id: uuidv4(),
      displayName,
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
   * Updates the player's level
   */
  public updateLevel(levelUpdates: Partial<PlayerLevel>): PlayerProfile {
    const currentProfile = this.getProfile();

    return this.updateProfile({
      level: {
        ...currentProfile.level,
        ...levelUpdates,
      },
    });
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

  /**
   * Updates the player's current element
   */
  public setCurrentElement(element: ElementSymbol): PlayerProfile {
    return this.updateProfile({ currentElement: element });
  }

  /**
   * Adds a new achievement to the player profile
   */
  public addAchievement(achievement: Achievement): PlayerProfile {
    const currentProfile = this.getProfile();

    // Check if achievement is already in the list
    if (currentProfile.achievements.some(a => a.id === achievement.id)) {
      return currentProfile;
    }

    return this.updateProfile({
      achievements: [...currentProfile.achievements, achievement],
    });
  }

  /**
   * Unlocks a game mode for the player
   */
  public unlockGameMode(gameMode: number): PlayerProfile {
    const currentProfile = this.getProfile();

    // Check if game mode is already unlocked
    if (currentProfile.unlockedGames.includes(gameMode)) {
      return currentProfile;
    }

    return this.updateProfile({
      unlockedGames: [...currentProfile.unlockedGames, gameMode],
    });
  }

  /**
   * Award electrons to the player
   */
  public awardElectrons(amount: number): PlayerProfile {
    const currentProfile = this.getProfile();

    return this.updateProfile({
      electrons: currentProfile.electrons + amount,
    });
  }

  /**
   * Spend electrons if the player has enough
   */
  public spendElectrons(amount: number): { success: boolean; profile: PlayerProfile } {
    const currentProfile = this.getProfile();

    if (currentProfile.electrons < amount) {
      return {
        success: false,
        profile: currentProfile,
      };
    }

    return {
      success: true,
      profile: this.updateProfile({
        electrons: currentProfile.electrons - amount,
      }),
    };
  }
}
