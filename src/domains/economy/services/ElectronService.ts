import type { PlayerProfile } from '../../shared/models/domain-models';
import type { ElectronSource, RewardResult } from '../../shared/models/domain-models';

interface RewardDetails {
  electronsAwarded: number;
  source: ElectronSource;
  description: string;
}

/**
 * In-memory storage for player electron balances
 * @private
 */
const electronBalances = new Map<string, number>();

/**
 * Get the current electron balance for a player
 * @param playerId - The unique identifier of the player
 * @returns The player's current electron balance, or 0 if not found
 */
export function getElectronBalance(playerId: string): number {
  return electronBalances.get(playerId) ?? 0;
}

/**
 * Add electrons to a player's balance
 * @param playerId - The unique identifier of the player
 * @param amount - The amount of electrons to add (must be positive)
 * @returns true if successful, false if amount is invalid
 */
export function addElectrons(playerId: string, amount: number): boolean {
  if (amount <= 0) {
    return false;
  }

  const currentBalance = getElectronBalance(playerId);
  electronBalances.set(playerId, currentBalance + amount);
  return true;
}

/**
 * Remove electrons from a player's balance
 * @param playerId - The unique identifier of the player
 * @param amount - The amount of electrons to remove (must be positive)
 * @returns true if successful, false if amount is invalid or insufficient balance
 */
export function removeElectrons(playerId: string, amount: number): boolean {
  if (amount <= 0) {
    return false;
  }

  const currentBalance = getElectronBalance(playerId);
  if (currentBalance < amount) {
    return false;
  }

  electronBalances.set(playerId, currentBalance - amount);
  return true;
}

/**
 * Initialize or reset a player's electron balance
 * @param playerId - The unique identifier of the player
 * @param initialBalance - Optional initial balance (defaults to 0)
 */
export function initializePlayerBalance(playerId: string, initialBalance = 0): void {
  electronBalances.set(playerId, Math.max(0, initialBalance));
}

/**
 * Calculate electron reward for completing a puzzle
 * @param isPerfect - Whether it was a perfect solve
 * @param difficulty - Puzzle difficulty level
 * @returns RewardResult - Electron reward details
 */
export function calculatePuzzleReward(isPerfect: boolean, difficulty: number): RewardResult {
  // Basic placeholder implementation - refine later
  const baseReward = 10;
  const difficultyFactor = difficulty * 0.5;
  const perfectSolveBonus = isPerfect ? 5 : 0;
  const totalReward = baseReward + difficultyFactor + perfectSolveBonus;

  return {
    electrons: Math.round(totalReward),
    progressGain: { atomicWeight: 0 }, // No atomic weight reward for now
  };
}

/**
 * Award electrons to player profile
 * @param profile - Player profile to award electrons to
 * @param electrons - Number of electrons to award
 * @param source - Source of electrons (e.g., puzzle completion)
 * @param description - Description of reward
 * @returns Updated PlayerProfile and reward details
 */
export function awardElectrons(
  profile: PlayerProfile,
  electrons: number,
  source: ElectronSource,
  description: string
): { profile: PlayerProfile; rewardDetails?: RewardDetails } {
  if (electrons > 0) {
    addElectrons(profile.id, electrons);
  }

  return {
    profile,
    rewardDetails: {
      electronsAwarded: electrons,
      source,
      description,
    },
  };
}
