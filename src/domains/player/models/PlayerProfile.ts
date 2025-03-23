import type { ElementSymbol } from '../../shared/models/ElementTypes';

/**
 * Represents the essential player profile data structure
 */
export interface PlayerProfile {
  /** Unique identifier for the player profile */
  id: string;

  /** Display name of the player */
  displayName: string;

  /** Current element the player is working with */
  currentElement: ElementSymbol;

  /** Player's progression levels */
  level: {
    /** Progress through atomic numbers (1-118) */
    atomicNumber: number;

    /** Accumulated atomic weight points */
    atomicWeight: number;

    /** Game lab progression level */
    gameLab: number;
  };

  /** Last update timestamp (ISO string) */
  lastUpdated: string;
}
