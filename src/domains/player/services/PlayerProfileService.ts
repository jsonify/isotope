// src/domains/player/services/PlayerProfileService.ts
import { v4 as uuidv4 } from 'uuid';

import { INITIAL_PLAYER_PROFILE } from '../../shared/constants/game-constants';
import type {
  PlayerProfile,
  PersistedPlayerProfile,
  PlayerLevel,
  ElementSymbol,
  Achievement,
  GameMode,
} from '../../shared/models/domain-models';
import { CURRENT_PROFILE_VERSION } from '../../shared/models/domain-models';
import type {
  ElementUnlockTransition,
  AchievementUnlockTransition,
  GameModeUnlockTransition,
} from '../../shared/models/transition-models';
import { TransitionType } from '../../shared/models/transition-models';
import { TransitionService } from '../../shared/services/TransitionService';
import { ValidationService } from '../../shared/services/ValidationService';

export class PlayerProfileService {
  private storageKey = 'isotope_player_profile';
  private validationService: ValidationService;

  public constructor() {
    this.validationService = ValidationService.getInstance();
  }

  /**
   * Get the current player profile from localStorage or create a new one
   * @throws Error if profile validation fails
   */
  public getProfile(): PlayerProfile {
    const persistedProfile = this.loadPersistedProfile();
    return this.extractPlayerProfile(persistedProfile);
  }

  /**
   * Loads the persisted profile from localStorage
   */
  private loadPersistedProfile(): PersistedPlayerProfile {
    const storedProfile = localStorage.getItem(this.storageKey);

    if (storedProfile !== null) {
      try {
        const parsedProfile = JSON.parse(storedProfile);
        const validationResult = this.validationService.validatePersistedProfile(parsedProfile);

        if (!validationResult.isValid || !validationResult.profile) {
          console.error('Profile validation failed:', validationResult.errors);
          return this.createNewPersistedProfile();
        }

        // Convert date strings back to Date objects
        const convertedProfile = {
          ...validationResult.profile,
          lastLogin: this.parseDate(parsedProfile.lastLogin),
          createdAt: this.parseDate(parsedProfile.createdAt),
          updatedAt: this.parseDate(parsedProfile.updatedAt),
          achievements: parsedProfile.achievements.map((achievement: Achievement) => ({
            ...achievement,
            dateUnlocked: this.parseDate(achievement.dateUnlocked),
          })),
        };

        convertedProfile.validation.lastValidated = new Date();

        return convertedProfile;
      } catch (error) {
        console.error('Error parsing stored profile:', error);
        return this.createNewPersistedProfile();
      }
    }

    return this.createNewPersistedProfile();
  }

  /**
   * Save the player profile to localStorage
   * @throws Error if profile validation fails
   */
  public saveProfile(profile: PlayerProfile): boolean {
    try {
      // Create persisted profile with validation metadata
      const persistedProfile: PersistedPlayerProfile = {
        ...profile,
        schemaVersion: CURRENT_PROFILE_VERSION,
        updatedAt: this.parseDate(),
        validation: {
          lastValidated: new Date(),
        },
      };

      // Validate before saving
      const validationResult = this.validationService.validatePersistedProfile(persistedProfile);
      if (!validationResult.isValid) {
        console.error('Profile validation failed:', validationResult.errors);
        return false;
      }

      localStorage.setItem(this.storageKey, JSON.stringify(persistedProfile));
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
    return this.extractPlayerProfile(this.createNewPersistedProfile(displayName));
  }

  /**
   * Create a new persisted player profile
   */
  private createNewPersistedProfile(displayName: string = 'New Scientist'): PersistedPlayerProfile {
    const now = this.parseDate();
    const persistedProfile: PersistedPlayerProfile = {
      ...INITIAL_PLAYER_PROFILE,
      id: uuidv4(),
      displayName,
      lastLogin: now,
      createdAt: now,
      updatedAt: now,
      schemaVersion: CURRENT_PROFILE_VERSION,
      validation: {
        lastValidated: now,
      },
    };

    this.saveProfile(persistedProfile);
    return persistedProfile;
  }

  /**
   * Extract PlayerProfile from PersistedPlayerProfile
   */
  private extractPlayerProfile(persistedProfile: PersistedPlayerProfile): PlayerProfile {
    // Omit persistence metadata
    const { ...playerProfile } = persistedProfile;

    return playerProfile;
  }

  /**
   * Update specific fields in the player profile
   */
  public updateProfile(updates: Partial<PlayerProfile>): PlayerProfile {
    const currentProfile = this.getProfile();
    const updatedProfile = {
      ...currentProfile,
      ...updates,
      updatedAt: this.parseDate(),
    };

    if (!this.saveProfile(updatedProfile)) {
      console.error('Failed to save profile updates, returning current profile');
      return currentProfile;
    }

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
