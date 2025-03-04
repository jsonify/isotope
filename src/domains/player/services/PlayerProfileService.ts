// src/domains/player/services/PlayerProfileService.ts
import { v4 as uuidv4 } from 'uuid';

import { INITIAL_PLAYER_PROFILE } from '../../shared/constants/game-constants';
import type {
  PlayerProfile,
  PlayerLevel,
  ElementSymbol,
  Achievement,
  GameMode,
} from '../../shared/models/domain-models';
import type {
  ElementUnlockTransition,
  AchievementUnlockTransition,
  GameModeUnlockTransition,
} from '../../shared/models/transition-models';
import { TransitionType } from '../../shared/models/transition-models';
import { TransitionService } from '../../shared/services/TransitionService';

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
        const convertedProfile = {
          ...parsedProfile,
          lastLogin: this.parseDate(parsedProfile.lastLogin),
          createdAt: this.parseDate(parsedProfile.createdAt),
          updatedAt: this.parseDate(parsedProfile.updatedAt),
          achievements: parsedProfile.achievements.map(achievement => ({
            ...achievement,
            dateUnlocked: this.parseDate(achievement.dateUnlocked),
          })),
        };

        return convertedProfile;
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
        updatedAt: this.parseDate(),
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
    const now = this.parseDate();
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
    const updatedProfile = {
      ...this.getProfile(),
      ...updates,
      updatedAt: this.parseDate(),
    };

    this.saveProfile(updatedProfile);
    return updatedProfile;
  }

  /**
   * Updates the player's level
   */
  public updateLevel(levelUpdates: Partial<PlayerLevel>): PlayerProfile {
    return this.updateProfile({
      level: {
        ...this.getProfile().level,
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
    return this.updateProfile({ lastLogin: this.parseDate() });
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
    const transitionService = TransitionService.getInstance();

    const transitionData: ElementUnlockTransition = {
      type: TransitionType.ELEMENT_UNLOCK,
      element,
    };

    transitionService.createTransition(TransitionType.ELEMENT_UNLOCK, transitionData);

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

    const achievementWithDate: Achievement = {
      ...achievement,
      dateUnlocked: this.parseDate(),
    };

    const transitionService = TransitionService.getInstance();
    const transitionData: AchievementUnlockTransition = {
      type: TransitionType.ACHIEVEMENT_UNLOCK,
      achievement: achievementWithDate,
    };

    transitionService.createTransition(TransitionType.ACHIEVEMENT_UNLOCK, transitionData);

    return this.updateProfile({
      achievements: [...currentProfile.achievements, achievementWithDate],
    });
  }

  /**
   * Unlocks a game mode for the player
   */
  public unlockGameMode(gameMode: GameMode): PlayerProfile {
    const currentProfile = this.getProfile();

    // Check if game mode is already unlocked
    if (currentProfile.unlockedGames.includes(gameMode)) {
      return currentProfile;
    }

    const transitionService = TransitionService.getInstance();
    const transitionData: GameModeUnlockTransition = {
      type: TransitionType.GAME_MODE_UNLOCK,
      gameMode,
    };

    transitionService.createTransition(TransitionType.GAME_MODE_UNLOCK, transitionData);

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

  private parseDate(value?: string | number | Date): Date {
    if (value === undefined) {
      return new Date();
    }

    if (value instanceof Date) {
      return new Date(value.getTime());
    }

    return new Date(value);
  }
}
