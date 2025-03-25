/***********************************************
 * FILE: src/domains/player/services/PlayerProfileService.ts
 * CREATED: 2025-03-24 15:32:28
 *
 * PURPOSE:
 * Manages player profile data and progression, including AW score updates
 *
 * METHODS:
 * - getInstance(): Gets the singleton instance
 * - updateAWScore(): Updates the player's Atomic Weight score
 * - getCurrentAWScore(): Gets the current AW score
 * - getProfile(): Gets the current player profile
 * - saveProfile(): Saves the current profile state
 * - updateProfile(): Updates specific profile attributes
 * - resetProfile(): Resets the profile to default state
 * - addAchievement(): Adds a new achievement
 * - unlockGameMode(): Unlocks a new game mode
 * - updateLevel(): Updates the player level
 * - recordLogin(): Records a player login
 *****************/

/***********************************************
 * FILE: src/domains/player/services/PlayerProfileService.ts
 * CREATED: 2025-03-24 07:41:39 (Must be todays date from environment details)
 *
 * PURPOSE:
 * Manages player profile data and progression, implementing the PlayerProfile interface.
 *
 * METHODS:
 * - getInstance(): Gets the singleton instance
 * - getProfile(): Gets the current player profile
 * - saveProfile(): Saves the current profile state
 * - updateProfile(): Updates specific profile attributes
 * - resetProfile(): Resets the profile to default state
 * - addAchievement(): Adds a new achievement
 * - unlockGameMode(): Unlocks a new game mode
 * - updateLevel(): Updates the player level
 * - recordLogin(): Records a player login
 * - updateAWScore(): Updates the player's Atomic Weight score
 * - getCurrentAWScore(): Gets the current AW score
 *****************/
import { v4 as uuidv4 } from 'uuid';

import type {
  Achievement,
  PlayerLevel,
  PlayerProfile,
  ElementSymbol,
} from '../../shared/models/domain-models';
import { GameMode } from '../../shared/models/domain-models';

export class PlayerProfileService {
  private static instance: PlayerProfileService;
  protected awScore: number = 0;
  protected id: string;
  protected displayName: string = 'New Scientist';
  protected level: PlayerLevel = { atomicNumber: 1, atomicWeight: 0, gameLab: 1 };
  protected currentElement: ElementSymbol = 'H';
  protected electrons: number = 0;
  protected unlockedGames: GameMode[] = [GameMode.TUTORIAL];
  protected achievements: Achievement[] = [];
  protected lastLogin: Date = new Date();
  protected tutorialCompleted: boolean = false;
  protected createdAt: Date = new Date();
  protected updatedAt: Date = new Date();

  protected constructor() {
    this.id = uuidv4();
  }

  public static getInstance(): PlayerProfileService {
    if (!PlayerProfileService.instance) {
      PlayerProfileService.instance = new PlayerProfileService();
    }
    return PlayerProfileService.instance;
  }

  /**
   * Gets the current player profile
   */
  public async getProfile(): Promise<PlayerProfile> {
    return {
      id: this.id,
      displayName: this.displayName,
      level: this.level,
      currentElement: this.currentElement,
      electrons: this.electrons,
      unlockedGames: this.unlockedGames,
      achievements: this.achievements,
      lastLogin: this.lastLogin,
      tutorialCompleted: this.tutorialCompleted,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Saves the current profile state
   */
  public async saveProfile(
    profile: PlayerProfile
  ): Promise<{ success: boolean; profile: PlayerProfile }> {
    try {
      // Save the profile (placeholder for actual persistence logic)
      const savedProfile: PlayerProfile = {
        ...profile,
        updatedAt: new Date(),
      };

      return { success: true, profile: savedProfile };
    } catch (error) {
      console.error('Failed to save profile:', error);
      return { success: false, profile };
    }
  }

  /**
   * Updates specific profile attributes
   */
  public async updateProfile(
    updates: Partial<PlayerProfile>
  ): Promise<{ success: boolean; profile: PlayerProfile }> {
    try {
      const currentProfile = await this.getProfile();
      const updatedProfile: PlayerProfile = {
        ...currentProfile,
        ...updates,
        updatedAt: new Date(),
      };

      // Update local state if needed
      if (updates.level?.atomicWeight !== undefined) {
        this.awScore = updates.level.atomicWeight;
      }

      return { success: true, profile: updatedProfile };
    } catch (error) {
      console.error('Failed to update profile:', error);
      return { success: false, profile: await this.getProfile() };
    }
  }

  /**
   * Resets the profile to default state
   */
  public async resetProfile(
    profile: PlayerProfile
  ): Promise<{ success: boolean; profile: PlayerProfile }> {
    const resetProfile: PlayerProfile = {
      ...profile,
      level: { atomicNumber: 1, atomicWeight: 0, gameLab: 1 },
      currentElement: 'H',
      electrons: 0,
      unlockedGames: [GameMode.TUTORIAL],
      achievements: [],
      tutorialCompleted: false,
      lastLogin: new Date(),
      updatedAt: new Date(),
    };

    // Reset local state
    this.awScore = 0;

    return { success: true, profile: resetProfile };
  }

  /**
   * Adds a new achievement
   * @param profile Current player profile
   * @param achievement Achievement to add
   */
  public async addAchievement(
    profile: PlayerProfile,
    achievement: Achievement
  ): Promise<{ success: boolean; profile: PlayerProfile }> {
    try {
      const updatedProfile = {
        ...profile,
        achievements: [...profile.achievements, achievement],
        updatedAt: new Date(),
      };

      return { success: true, profile: updatedProfile };
    } catch (error) {
      console.error('Failed to add achievement:', error);
      return { success: false, profile };
    }
  }

  /**
   * Unlocks a new game mode
   */
  public async unlockGameMode(): Promise<boolean> {
    return true;
  }

  /**
   * Updates the player level
   */
  public async updateLevel(): Promise<boolean> {
    return true;
  }

  /**
   * Records a player login
   */
  public async recordLogin(): Promise<boolean> {
    return true;
  }

  /**
   * Updates the player's Atomic Weight (AW) score by adding the provided points
   * @param points - The number of AW points to add
   * @returns Promise resolving to the new total score
   */
  public async updateAWScore(points: number): Promise<number> {
    this.awScore += points;
    return this.awScore;
  }

  /**
   * Gets the current Atomic Weight (AW) score
   * @returns The current AW score
   */
  public getCurrentAWScore(): number {
    return this.awScore;
  }
}
