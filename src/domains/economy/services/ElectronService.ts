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
