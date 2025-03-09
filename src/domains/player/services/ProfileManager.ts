import { StorageService } from './StorageService';
import type { ElementSymbol } from '../../shared/models/ElementTypes';
import type { PlayerProfile } from '../models/PlayerProfile';

/**
 * Manages player profile lifecycle operations
 */
export class ProfileManager {
  private storage: StorageService;

  public constructor() {
    this.storage = new StorageService();
  }

  /**
   * Create a new player profile
   * @param displayName The player's display name
   * @returns A new player profile
   */
  public createProfile(displayName: string): PlayerProfile {
    return {
      id: crypto.randomUUID(),
      displayName,
      currentElement: 'H' as ElementSymbol,
      level: {
        atomicNumber: 1,
        atomicWeight: 0,
        gameLab: 0,
      },
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Save a player profile
   * @param profile The profile to save
   * @returns boolean indicating success or failure
   */
  public saveProfile(profile: PlayerProfile): boolean {
    const updatedProfile = {
      ...profile,
      lastUpdated: new Date().toISOString(),
    };

    return this.storage.save(updatedProfile);
  }

  /**
   * Load a player profile or create a new one if none exists
   * @returns The loaded or newly created player profile
   */
  public loadProfile(): PlayerProfile {
    const saved = this.storage.load();
    return saved || this.createProfile('Player');
  }
}
