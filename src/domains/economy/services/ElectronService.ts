import {
  BASE_REWARD,
  DIFFICULTY_MULTIPLIERS,
  PERFECT_SOLVE_MULTIPLIER,
  type DifficultyLevel,
} from './economy-constants';
import type {
  PlayerProfile,
  RewardResult,
  ElectronSource,
} from '../../shared/models/domain-models';

interface ElectronTransaction {
  timestamp: Date;
  type: 'add' | 'remove' | 'initialize' | 'earn';
  amount: number;
  previousBalance: number;
  newBalance: number;
  description: string;
}

export interface RewardDetails {
  electronsAwarded: number;
  source: ElectronSource;
  description: string;
}

const electronBalances = new Map<string, number>();
const transactionHistory = new Map<string, ElectronTransaction[]>();

export function clearTransactionHistory(): void {
  transactionHistory.clear();
}

function clearElectronBalances(): void {
  electronBalances.clear();
}

export function clearAllElectronServiceData(): void {
  clearElectronBalances();
  clearTransactionHistory();
}

function recordTransaction(playerId: string, transaction: ElectronTransaction): void {
  const history = transactionHistory.get(playerId) ?? [];
  history.push(transaction);
  transactionHistory.set(playerId, history);
}

export function getElectronTransactionHistory(playerId: string): ElectronTransaction[] {
  return transactionHistory.get(playerId) ?? [];
}

export function getElectronBalance(playerId: string): number {
  return electronBalances.get(playerId) ?? 0;
}

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
    description: 'Add electrons transaction',
  });

  return true;
}

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

  recordTransaction(playerId, {
    timestamp: new Date(),
    type: 'remove' as ElectronTransaction['type'],
    amount,
    previousBalance,
    newBalance,
    description: 'Remove electrons transaction',
  });

  return true;
}

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
    description: 'Initialize balance transaction',
  });
}

export function calculatePuzzleReward(
  isPerfect: boolean,
  difficulty: DifficultyLevel
): RewardResult {
  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[difficulty];
  const perfectMultiplier = isPerfect ? PERFECT_SOLVE_MULTIPLIER : 1;

  const totalReward = BASE_REWARD * difficultyMultiplier * perfectMultiplier;

  return {
    electrons: Math.round(totalReward),
    progressGain: { atomicWeight: 0 },
  };
}

export function earn(playerId: string, amount: number): boolean {
  if (amount <= 0) {
    return false;
  }

  const previousBalance = getElectronBalance(playerId);
  const newBalance = previousBalance + amount;
  electronBalances.set(playerId, newBalance);

  recordTransaction(playerId, {
    timestamp: new Date(),
    type: 'earn',
    amount,
    previousBalance,
    newBalance,
    description: 'Earn electrons transaction',
  });

  return true;
}

export function awardElectrons(
  profile: PlayerProfile,
  electrons: number,
  source: ElectronSource,
  description: string
): { profile: PlayerProfile; rewardDetails?: RewardDetails } {
  if (electrons > 0) {
    earn(profile.id, electrons);
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
