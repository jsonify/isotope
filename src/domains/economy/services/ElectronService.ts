import { v4 as uuidv4 } from 'uuid';

import { ELECTRON_REWARDS } from '../../shared/constants/game-constants';
import type {
  ElectronSource,
  ElectronTransaction,
  PlayerProfile,
  RewardResult,
} from '../../shared/models/domain-models';

export class ElectronService {
  /**
   * Awards electrons to a player profile
   */
  public awardElectrons(
    profile: PlayerProfile,
    amount: number,
    source: ElectronSource,
    description?: string
  ): { success: boolean; profile: PlayerProfile; transaction?: ElectronTransaction } {
    if (amount <= 0) {
      return { success: false, profile };
    }

    const transaction: ElectronTransaction = {
      id: uuidv4(),
      playerId: profile.id,
      amount,
      source,
      timestamp: new Date(),
      balance: profile.electrons + amount,
      description,
    };

    const updatedProfile = {
      ...profile,
      electrons: profile.electrons + amount,
      updatedAt: new Date(),
    };

    return {
      success: true,
      profile: updatedProfile,
      transaction,
    };
  }

  /**
   * Calculates reward for completing a puzzle
   */
  public calculatePuzzleReward(
    profile: PlayerProfile,
    isPerfect: boolean,
    difficulty: number
  ): RewardResult {
    const baseElectrons = ELECTRON_REWARDS[isPerfect ? 'perfect' : 'puzzle'];
    const difficultyBonus = Math.floor(difficulty * 0.5);

    return {
      electrons: baseElectrons + difficultyBonus,
      progressGain: {
        atomicWeight: this.calculateAtomicWeightGain(difficulty, isPerfect),
      },
    };
  }

  /**
   * Calculate atomic weight gain based on difficulty and performance
   */
  private calculateAtomicWeightGain(difficulty: number, isPerfect: boolean): number {
    // Base gain is difficulty level
    let gain = difficulty;

    // Perfect solve bonus
    if (isPerfect) {
      gain *= 1.5;
    }

    // Round to nearest whole number
    return Math.round(gain);
  }
}
