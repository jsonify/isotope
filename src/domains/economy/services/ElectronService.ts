import {
  BASE_REWARD,
  DIFFICULTY_MULTIPLIERS,
  PERFECT_SOLVE_MULTIPLIER,
  type DifficultyLevel,
} from './economy-constants';
import type { PlayerProfile } from '../../shared/models/domain-models';
import type { ElectronSource, RewardResult } from '../../shared/models/domain-models';

interface ElectronTransaction {
  timestamp: Date;
  type: 'add' | 'remove' | 'initialize';
  amount: number;
  previousBalance: number;
  newBalance: number;
}

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
 * In-memory storage for player electron transaction histories
 * @private
 */
const transactionHistory = new Map<string, ElectronTransaction[]>();

/**
 * Clear all transaction histories (for testing purposes)
 * @private
 */
export function clearTransactionHistory(): void {
  transactionHistory.clear();
}

/**
 * Clear all electron balances (for testing purposes)
 * @private
 */
/**
 * Clear all electron balances (for testing purposes)
 * @private
 */
function clearElectronBalances(): void {
  electronBalances.clear();
}

/**
 * Clear both electron balances and transaction history (for testing purposes)
 * @private - but exported for test file usage
 */
export function clearAllElectronServiceData(): void {
  clearElectronBalances();
  clearTransactionHistory();
}

/**
 * Record a new electron transaction for a player
 * @private
 * @param playerId - The unique identifier of the player
 * @param transaction - The transaction details to record
 */
function recordTransaction(playerId: string, transaction: ElectronTransaction): void {
  const history = transactionHistory.get(playerId) ?? [];
  history.push(transaction);
  transactionHistory.set(playerId, history);
}

/**
 * Get the transaction history for a player
 * @param playerId - The unique identifier of the player
 * @returns Array of electron transactions, or empty array if no history exists
 */
export function getElectronTransactionHistory(playerId: string): ElectronTransaction[] {
  return transactionHistory.get(playerId) ?? [];
}

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

  const previousBalance = getElectronBalance(playerId);
  const newBalance = previousBalance + amount;
  electronBalances.set(playerId, newBalance);

  recordTransaction(playerId, {
    timestamp: new Date(),
    type: 'add',
    amount,
    previousBalance,
    newBalance,
  });

  return true;
}

/**
 * Remove electrons from a player's balance
 * @param playerId - The unique identifier of the player
 * @param amount - The amount of electrons to remove (must be positive)
 * @returns true if successful, false if amount is invalid or insufficient balance
 */
export function removeElectrons(playerId: string, amount: number): boolean {
  const previousBalance = getElectronBalance(playerId);
  if (amount <= 0) {
    return false;
  }

  if (previousBalance < amount) {
    return false;
  }

  const newBalance = previousBalance - amount;
  electronBalances.set(playerId, newBalance);

  const transaction = {
    // Inlined recordTransaction code
    timestamp: new Date(),
    type: 'remove' as ElectronTransaction['type'], // Explicitly cast to ElectronTransaction['type']
    amount,
    previousBalance,
    newBalance,
  };
  const history = transactionHistory.get(playerId) ?? [];
  history.push(transaction);
  transactionHistory.set(playerId, history);

  return true;
}

/**
 * Initialize or reset a player's electron balance
 * @param playerId - The unique identifier of the player
 * @param initialBalance - Optional initial balance (defaults to 0)
 */
export function initializePlayerBalance(playerId: string, initialBalance = 0): void {
  const previousBalance = getElectronBalance(playerId);
  const newBalance = Math.max(0, initialBalance);
  electronBalances.set(playerId, newBalance);

  recordTransaction(playerId, {
    timestamp: new Date(),
    type: 'initialize',
    amount: initialBalance,
    previousBalance,
    newBalance,
  });
}

/**
 * Calculate electron reward for completing a puzzle
 * @param isPerfect - Whether it was a perfect solve
 * @param difficulty - Puzzle difficulty level
 * @returns RewardResult - Electron reward details
 */
export function calculatePuzzleReward(
  isPerfect: boolean,
  difficulty: DifficultyLevel
): RewardResult {
  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[difficulty];
  const perfectMultiplier = isPerfect ? PERFECT_SOLVE_MULTIPLIER : 1;

  const totalReward = BASE_REWARD * difficultyMultiplier * perfectMultiplier;

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
