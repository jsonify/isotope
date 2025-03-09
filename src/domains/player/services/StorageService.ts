import type { PlayerProfile } from '../models/PlayerProfile';

/**
 * Handles local storage operations for player profiles
 */
export class StorageService {
  private readonly STORAGE_KEY = 'isotope_player';

  /**
   * Save player profile to local storage
   * @param data The player profile to save
   * @returns boolean indicating success or failure
   */
  public save(data: PlayerProfile): boolean {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('[Storage] Save failed:', error);
      return false;
    }
  }

  /**
   * Load player profile from local storage
   * @returns The loaded player profile or null if not found/error
   */
  public load(): PlayerProfile | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('[Storage] Load failed:', error);
      return null;
    }
  }
}
