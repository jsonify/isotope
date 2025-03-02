// src/domains/economy/models/economy-models.ts

import type { GameMode, ElementSymbol } from '../../shared/models/domain-models';

/**
 * Sources from which a player can earn electrons
 */
export enum ElectronSource {
  TUTORIAL_COMPLETION = 'tutorial',
  PUZZLE_COMPLETION = 'puzzle',
  DAILY_LOGIN = 'daily',
  ACHIEVEMENT = 'achievement',
  PERFECT_SOLVE = 'perfect',
  ELEMENT_UNLOCK = 'element_unlock',
  PERIOD_COMPLETE = 'period_complete',
}

/**
 * Record of an electron transaction (earning or spending)
 */
export interface ElectronTransaction {
  id: string;
  playerId: string;
  amount: number; // Positive for earning, negative for spending
  source: ElectronSource;
  timestamp: Date;
  balance: number; // Player's balance after transaction
  description?: string;
  metadata?: Record<string, unknown>; // Additional transaction data
}

/**
 * Types of items available in the store
 */
export type StoreItemType = 'hint' | 'powerup' | 'gameUnlock' | 'cosmetic';

/**
 * Purchasable item in the game store
 */
export interface StoreItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: StoreItemType;
  gameMode?: GameMode; // For game unlocks
  imageUrl?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary';
  unlockRequirement?: {
    elementSymbol?: ElementSymbol; // Must have reached this element
    minAtomicNumber?: number; // Must have reached this atomic number
    minAtomicWeight?: number; // Must have completed this many puzzles
  };
}

/**
 * Player's owned items and inventory
 */
export interface PlayerInventory {
  playerId: string;
  ownedItems: string[]; // IDs of owned items
  activeItems: string[]; // IDs of currently active items
  hintCredits: number; // Available hints
  powerupCharges: Record<string, number>; // Map of powerup ID to number of charges
  lastUpdated: Date;
}

/**
 * Result of a purchase attempt
 */
export interface PurchaseResult {
  success: boolean;
  item?: StoreItem;
  transaction?: ElectronTransaction;
  newBalance?: number;
  failureReason?:
    | 'insufficient_electrons'
    | 'already_owned'
    | 'requirement_not_met'
    | 'invalid_item';
}

/**
 * Rewards given to player for completing actions
 */
export interface RewardResult {
  electrons: number;
  unlockedItems?: StoreItem[];
  progressGain: {
    atomicWeight: number;
    atomicNumber?: number;
    gameLab?: number;
  };
  achievement?: Achievement;
  message?: string;
}

/**
 * Configuration for electron rewards from different sources
 */
export interface ElectronRewardConfig {
  baseRewards: Record<ElectronSource, number>;
  difficultyMultiplier: number; // For difficulty-based reward scaling
  perfectBonus: number; // Additional reward for perfect solves
  periodMultiplier: number; // Reward multiplier based on period
}

/**
 * Achievement for player milestones
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  dateUnlocked: Date;
  category: 'progression' | 'puzzle' | 'collection' | 'special';
  electronReward: number;
  requirementDescription?: string;
}

/**
 * Electron Economy Service interface
 */
export interface IElectronService {
  getBalance(playerId: string): number;

  awardElectrons(
    playerId: string,
    amount: number,
    source: ElectronSource,
    description?: string
  ): ElectronTransaction;

  spendElectrons(
    playerId: string,
    amount: number,
    reason: string
  ): { success: boolean; transaction?: ElectronTransaction };

  getTransactions(playerId: string, limit?: number): ElectronTransaction[];

  calculateReward(source: ElectronSource, difficulty?: number, isPerfect?: boolean): number;

  getAvailableStoreItems(playerId: string): StoreItem[];

  purchaseItem(playerId: string, itemId: string): PurchaseResult;
}
