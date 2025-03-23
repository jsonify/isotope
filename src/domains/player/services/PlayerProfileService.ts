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
import { LogService } from '../../shared/services/LogService';
import { TransitionService } from '../../shared/services/TransitionService';
import { ValidationService } from '../../shared/services/ValidationService';

export class PlayerProfileService {
  private readonly storageKey = 'isotope_player_profile';
  private readonly logPrefix = 'PlayerProfileService';
  private validationService: ValidationService;
  private logService: LogService;

  public constructor() {
    this.validationService = ValidationService.getInstance();
    this.logService = LogService.getInstance();
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
    let storedData = null;

    try {
      if (this.isLocalStorageAvailable()) {
        storedData = localStorage.getItem(this.storageKey);
      }
    } catch {
      this.logService.error(this.logPrefix, 'Storage Error: localStorage is not available');
      return this.createNewPersistedProfile();
    }

    if (!storedData) {
      return this.createNewPersistedProfile();
    }

    try {
      return this.deserializeProfile(storedData);
    } catch (error) {
      this.logService.error(this.logPrefix, 'Profile Load Error', {
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      return this.createNewPersistedProfile();
    }
  }

  /**
   * Save the player profile to localStorage
   * @throws Error if profile validation fails
   */
  public saveProfile(profile: PlayerProfile): boolean {
    const now = new Date();

    try {
      if (!this.isLocalStorageAvailable()) {
        this.logService.error(
          this.logPrefix,
          'Storage Error: Cannot save profile - localStorage unavailable'
        );
        return false;
      }

      const profileToSave = {
        // Ensure we have a valid profile structure
        ...(profile || {}), // Apply null-safe spread
        schemaVersion: CURRENT_PROFILE_VERSION,
        updatedAt: now,
        validation: {
          lastValidated: now,
        },
      };

      // Pre-save validation
      const validationResult = this.validationService.validatePlayerProfile(profileToSave);
      if (!validationResult.isValid) {
        const errors =
          validationResult.errors.length > 0
            ? validationResult.errors
            : ['Invalid player profile structure'];

        // Debug: log raw validation errors
        this.logService.info(this.logPrefix, 'Raw validation errors', { errors });

        // Check for any error mentioning 'id' field
        const idError = errors.find(error => error.toLowerCase().includes('id'));
        this.logService.error(this.logPrefix, 'Validation Error', {
          errors: idError ? ['Missing required field: id'] : errors,
          timestamp: new Date().toISOString(),
        });
        return false;
      }

      const persistedProfile = profileToSave;
      const serializedProfile = this.serializeProfile(persistedProfile);

      localStorage.setItem(this.storageKey, serializedProfile);
      this.logService.info(this.logPrefix, 'Profile saved successfully');

      return true;
    } catch (error) {
      this.logService.error(this.logPrefix, 'Save Error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  /**
   * Serialize a player profile to a JSON string
   * Handles Date objects and includes schema version
   */
  public serializeProfile(profile: PlayerProfile | PersistedPlayerProfile): string {
    const now = new Date();
    const profileToSerialize =
      'schemaVersion' in profile
        ? profile
        : {
            ...profile,
            schemaVersion: CURRENT_PROFILE_VERSION,
            validation: {
              lastValidated: now,
            },
          };

    // Validate achievement dates
    for (const achievement of profileToSerialize.achievements || []) {
      if (
        !(achievement.dateUnlocked instanceof Date) ||
        isNaN(achievement.dateUnlocked.getTime())
      ) {
        const errorMessage = `Invalid achievement date: ${achievement.dateUnlocked}`;
        this.logService.error(this.logPrefix, 'Serialization Error', { error: errorMessage });
        throw new Error(errorMessage);
      }
    }

    const validationResult = this.validationService.validatePlayerProfile(
      profileToSerialize as PersistedPlayerProfile
    );
    if (!validationResult.isValid) {
      const errorMessage = `Profile validation failed: ${validationResult.errors.join(', ')}`;
      this.logService.error(this.logPrefix, 'Serialization Error', { error: errorMessage });

      throw new Error(errorMessage);
    }

    return JSON.stringify(profileToSerialize, (_key, value) => {
      return value instanceof Date ? value.toISOString() : value;
    });
  }

  /**
   * Deserialize a JSON string to a player profile
   * Handles Date objects and validates schema version
   */
  public deserializeProfile(serializedProfile: string): PersistedPlayerProfile {
    const now = new Date();
    try {
      const parsedData = JSON.parse(serializedProfile);

      // Warn if schema version is missing
      if (!('schemaVersion' in parsedData)) {
        this.logService.warn(this.logPrefix, 'Schema Version Missing', {
          message: 'Profile loaded without schema version',
        });
      }

      // Reconstruct profile with proper date objects
      const profile: PersistedPlayerProfile = {
        ...parsedData,
        lastLogin: new Date(parsedData.lastLogin),
        createdAt: new Date(parsedData.createdAt),
        updatedAt: new Date(parsedData.updatedAt),
        achievements: (parsedData.achievements || []).map((a: Achievement) => ({
          ...a,
          dateUnlocked: new Date(a.dateUnlocked),
        })),
        validation: {
          lastValidated: now,
        },
        schemaVersion: parsedData.schemaVersion || CURRENT_PROFILE_VERSION,
      };

      // Handle version migrations if needed
      if (profile.schemaVersion < CURRENT_PROFILE_VERSION) {
        // Remove console.log if present
        // console.log('Schema version mismatch warning is about to be logged');

        // Ensure this warning is called directly
        this.logService.warn(this.logPrefix, 'Schema Version Mismatch', {
          current: profile.schemaVersion,
          expected: CURRENT_PROFILE_VERSION,
        });

        // Update version but preserve data
        profile.schemaVersion = CURRENT_PROFILE_VERSION;
        profile.updatedAt = now;
      }

      // Validate profile after migration or if no migration was needed
      const validationResult = this.validationService.validatePersistedProfile(profile);
      if (!validationResult.isValid || !validationResult.profile) {
        const errorMessage = `Profile validation failed: ${validationResult.errors.join(', ')}`;
        this.logService.error(this.logPrefix, 'Deserialization Error', { error: errorMessage });

        throw new Error(errorMessage);
      }

      return profile;
    } catch (error) {
      this.logService.error(this.logPrefix, 'Deserialization Error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Check if localStorage is available
   */
  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
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
    const now = new Date();
    this.logService.info(this.logPrefix, 'Creating new profile', { displayName });

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

    // Only attempt to save if we have a valid new profile
    const validationResult = this.validationService.validatePlayerProfile(persistedProfile);
    if (!validationResult.isValid) {
      this.logService.error(this.logPrefix, 'Validation Error: Invalid new profile structure', {
        errors: validationResult.errors,
      });
      return persistedProfile;
    }

    this.saveProfile(persistedProfile);
    return persistedProfile;
  }

  /**
   * Extract PlayerProfile from PersistedPlayerProfile
   */
  private extractPlayerProfile(persistedProfile: PersistedPlayerProfile): PlayerProfile {
    // Explicitly omit persistence metadata
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      schemaVersion,
      validation /* eslint-enable @typescript-eslint/no-unused-vars */,
      ...playerProfile
    } = persistedProfile;

    return playerProfile;
  }

  /**
   * Update specific fields in the player profile
   */
  public updateProfile(updates: Partial<PlayerProfile>): PlayerProfile {
    const currentProfile = this.getProfile();
    const updatedProfile = {
      ...currentProfile,
      ...(updates || {}),
      updatedAt: this.parseDate(),
    };

    if (!this.saveProfile(updatedProfile)) {
      this.logService.error(this.logPrefix, 'Update Error: Failed to save profile updates');
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
    this.logService.warn(this.logPrefix, 'Resetting profile');
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
    try {
      if (value instanceof Date) {
        return new Date(value.getTime());
      }
      return new Date(value);
    } catch (error) {
      this.logService.error(this.logPrefix, 'Date Parse Error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return new Date();
    }
  }
}
