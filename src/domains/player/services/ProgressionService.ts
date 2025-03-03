// src/domains/player/services/ProgressionService.ts
// src/domains/shared/constants/game-constants.ts
import { ELEMENTS_DATA, PROGRESSION_THRESHOLDS } from '../../shared/constants/game-constants';
import type {
  ElementSymbol,
  PlayerProfile,
  PlayerProgress,
  ProgressThreshold,
  Element,
} from '../../shared/models/domain-models';
import { GameMode } from '../../shared/models/domain-models';
import type {
  ElementAdvanceTransition,
  GameModeUnlockTransition,
  AtomicWeightAwardedTransition,
  PeriodCompleteTransition,
} from '../../shared/models/transition-models';
import { TransitionType } from '../../shared/models/transition-models';
import { TransitionService } from '../../shared/services/TransitionService';

export class ProgressionService {
  // Define which games unlock at which periods
  private readonly periodGameUnlocks: Record<number, GameMode[]> = {
    1: [GameMode.TUTORIAL, GameMode.ELEMENT_MATCH],
    2: [GameMode.PERIODIC_SORT, GameMode.ELECTRON_SHELL],
    3: [GameMode.COMPOUND_BUILD, GameMode.ELEMENT_QUIZ],
    4: [GameMode.REACTION_BALANCE],
    5: [GameMode.ORBITAL_PUZZLE],
    6: [GameMode.ISOTOPE_BUILDER],
    7: [GameMode.ELECTRON_FLOW],
  };

  /**
   * Determines if player has met requirements to advance to the next element
   */
  public canAdvanceElement(profile: PlayerProfile): boolean {
    const currentElement = this.getElementBySymbol(profile.currentElement);
    const nextElement = this.getNextElementByAtomicNumber(currentElement.atomicNumber);

    if (!nextElement) return false; // Already at max element

    // Must have threshold defined to progress
    const threshold = this.getProgressionThreshold(profile.currentElement, nextElement.symbol);
    if (!threshold) {
      return false; // No progression path defined
    }

    const puzzlesCompletedTowardNext =
      profile.level.atomicWeight - this.getPreviousThresholdTotal(profile.currentElement);

    return puzzlesCompletedTowardNext >= threshold.puzzlesRequired;
  }

  /**
   * Advances the player to the next element if requirements are met
   */
  public advanceElement(profile: PlayerProfile): PlayerProfile {
    // Must pass all progression checks to advance
    if (!this.canAdvanceElement(profile)) return profile;

    const currentElement = this.getElementBySymbol(profile.currentElement);
    const nextElement = this.getNextElementByAtomicNumber(currentElement.atomicNumber);

    if (!nextElement) return profile;

    const transitionService = TransitionService.getInstance();
    const advanceTransition = this.createAdvanceTransition(profile, currentElement, nextElement);
    transitionService.createTransition(TransitionType.ELEMENT_ADVANCE, advanceTransition);

    const updatedProfile = {
      ...profile,
      currentElement: nextElement.symbol,
      level: {
        ...profile.level,
        atomicNumber: profile.level.atomicNumber + 1,
        atomicWeight: 0, // Reset atomicWeight when advancing to new element
      },
    };

    // Check if this advances to a new period and update gameLab if needed
    if (nextElement.period > currentElement.period) {
      return this.handlePeriodAdvancement(
        updatedProfile,
        nextElement,
        currentElement,
        transitionService
      );
    }

    return updatedProfile;
  }

  private createAdvanceTransition(
    profile: PlayerProfile,
    currentElement: Element,
    nextElement: Element
  ): ElementAdvanceTransition {
    return {
      type: TransitionType.ELEMENT_ADVANCE,
      fromElement: currentElement.symbol,
      toElement: nextElement.symbol,
      newLevel: {
        atomicNumber: profile.level.atomicNumber + 1,
        atomicWeight: 0, // Reset atomicWeight when advancing to new element
      },
    };
  }

  /**
   * Handles advancement to a new period in the periodic table
   * @param updatedProfile The player's profile with updated element
   * @param nextElement The element being advanced to
   * @param currentElement Reserved for future use in transition animations and progress tracking
   * @param transitionService Service for managing transition effects
   */
  private handlePeriodAdvancement(
    updatedProfile: PlayerProfile,
    nextElement: Element,
    _currentElement: Element,
    transitionService: TransitionService
  ): PlayerProfile {
    updatedProfile.level.gameLab++;

    const periodTransition: PeriodCompleteTransition = {
      type: TransitionType.PERIOD_COMPLETE,
      periodNumber: nextElement.period,
      // Explicitly check if the array exists and is not empty
      unlockedGameModes: Array.isArray(this.periodGameUnlocks[nextElement.period])
        ? this.periodGameUnlocks[nextElement.period]
        : [],
    };

    transitionService.createTransition(TransitionType.PERIOD_COMPLETE, periodTransition);

    return this.unlockPeriodGames(updatedProfile, nextElement.period);
  }

  /**
   * Awards atomic weight to the player and checks for element advancement
   * @param profile The player's profile
   * @param atomicWeightAwarded The amount of atomic weight to award
   * @returns Updated player profile
   */
  public awardAtomicWeight(profile: PlayerProfile, atomicWeightAwarded: number): PlayerProfile {
    if (atomicWeightAwarded <= 0) {
      return profile; // No atomic weight awarded
    }

    const transitionService = TransitionService.getInstance();

    // Create atomic weight awarded transition
    const awardTransition: AtomicWeightAwardedTransition = {
      type: TransitionType.ATOMIC_WEIGHT_AWARDED,
      amount: atomicWeightAwarded,
      elementSymbol: profile.currentElement,
      currentTotal: profile.level.atomicWeight + atomicWeightAwarded,
    };

    transitionService.createTransition(TransitionType.ATOMIC_WEIGHT_AWARDED, awardTransition);

    // Update profile with new atomic weight
    const updatedProfile = {
      ...profile,
      level: {
        ...profile.level,
        atomicWeight: profile.level.atomicWeight + atomicWeightAwarded,
      },
    };

    // Check if player can advance to next element and handle advancement if possible
    return this.canAdvanceElement(updatedProfile)
      ? this.advanceElement(updatedProfile)
      : updatedProfile;
  }

  /**
   * Unlocks games associated with reaching a new period
   */
  public unlockPeriodGames(profile: PlayerProfile, period?: number): PlayerProfile {
    const currentElement = this.getElementBySymbol(profile.currentElement);

    // Get games to unlock for this period
    const periodToUse = period ?? currentElement.period;
    const availableGames = this.periodGameUnlocks[periodToUse];
    const gamesToUnlock = availableGames ?? [];

    const transitionService = TransitionService.getInstance();

    // Add any new games not already unlocked
    const updatedUnlockedGames = [...profile.unlockedGames];

    gamesToUnlock.forEach((gameMode: GameMode) => {
      if (!updatedUnlockedGames.includes(gameMode)) {
        // Create transition for each newly unlocked game mode
        const unlockTransition: GameModeUnlockTransition = {
          type: TransitionType.GAME_MODE_UNLOCK,
          gameMode,
        };

        transitionService.createTransition(TransitionType.GAME_MODE_UNLOCK, unlockTransition);
        updatedUnlockedGames.push(gameMode);
      }
    });

    return {
      ...profile,
      unlockedGames: updatedUnlockedGames,
    };
  }

  /**
   * Calculates puzzles needed to advance to next element
   */
  public calculateRequiredPuzzles(currentElement: ElementSymbol): number {
    const element = this.getElementBySymbol(currentElement);
    const nextElement = this.getNextElementByAtomicNumber(element.atomicNumber);

    // For final element, use its threshold requirement or last defined threshold
    if (!nextElement) {
      const threshold = PROGRESSION_THRESHOLDS.find(t => t.fromElement === currentElement);
      if (threshold) {
        return threshold.puzzlesRequired;
      }
      return PROGRESSION_THRESHOLDS[PROGRESSION_THRESHOLDS.length - 1].puzzlesRequired;
    }

    const threshold = this.getProgressionThreshold(currentElement, nextElement.symbol);
    return threshold ? threshold.puzzlesRequired : 0;
  }

  /**
   * Checks if a game mode is unlocked for a player
   */
  public isGameModeUnlocked(profile: PlayerProfile, gameMode: GameMode): boolean {
    return profile.unlockedGames.includes(gameMode);
  }

  /**
   * Unlocks a specific game mode for a player
   */
  public unlockGameMode(profile: PlayerProfile, gameMode: GameMode): PlayerProfile {
    if (this.isGameModeUnlocked(profile, gameMode)) {
      return profile;
    }

    return {
      ...profile,
      unlockedGames: [...profile.unlockedGames, gameMode],
    };
  }

  /**
   * Gets detailed progress information for UI
   */
  public getPlayerProgress(profile: PlayerProfile): PlayerProgress {
    const currentElement = this.getElementBySymbol(profile.currentElement);
    const nextElement = this.getNextElementByAtomicNumber(currentElement.atomicNumber);

    // Calculate puzzles completed toward next element
    const previousThresholdTotal = this.getPreviousThresholdTotal(profile.currentElement);
    const puzzlesCompletedTowardNext = profile.level.atomicWeight - previousThresholdTotal;

    // Calculate puzzles required for next element
    const puzzlesRequiredForNext = nextElement
      ? this.calculateRequiredPuzzles(profile.currentElement)
      : 0;

    // Calculate percentage to next element
    const percentToNextElement =
      puzzlesRequiredForNext > 0
        ? Math.min(100, (puzzlesCompletedTowardNext / puzzlesRequiredForNext) * 100)
        : 100;

    // Get elements in current period
    const elementsInCurrentPeriod = ELEMENTS_DATA.filter(
      element => element.period === currentElement.period
    ).map(element => element.symbol);

    // Get periods unlocked
    const maxPeriodUnlocked = Math.max(
      ...ELEMENTS_DATA.filter(
        element =>
          ELEMENTS_DATA.findIndex(e => e.symbol === element.symbol) <=
          ELEMENTS_DATA.findIndex(e => e.symbol === profile.currentElement)
      ).map(element => element.period)
    );

    return {
      currentElement: profile.currentElement,
      totalPuzzlesCompleted: profile.level.atomicWeight,
      puzzlesCompletedTowardNext,
      puzzlesRequiredForNext,
      percentToNextElement,
      currentPeriod: currentElement.period,
      elementsInCurrentPeriod,
      periodsUnlocked: maxPeriodUnlocked,
    };
  }

  /**
   * Calculate percentage progress to next element
   */
  public getPercentToNextElement(profile: PlayerProfile): number {
    const currentElement = this.getElementBySymbol(profile.currentElement);
    const nextElement = this.getNextElementByAtomicNumber(currentElement.atomicNumber);

    if (!nextElement) return 100; // Already at max element

    const threshold = this.getProgressionThreshold(profile.currentElement, nextElement.symbol);
    if (!threshold) return 0;

    const previousTotal = this.getPreviousThresholdTotal(profile.currentElement);
    const puzzlesCompletedTowardNext = profile.level.atomicWeight - previousTotal;

    return Math.min(
      100,
      Math.floor((puzzlesCompletedTowardNext / threshold.puzzlesRequired) * 100)
    );
  }

  /**
   * Get information about the current period progress
   */
  public getPeriodProgress(profile: PlayerProfile): {
    currentPeriod: number;
    elementsInPeriod: ElementSymbol[];
    completedInPeriod: number;
  } {
    const currentElement = this.getElementBySymbol(profile.currentElement);
    const period = currentElement.period;

    // Get all elements in this period
    const elementsInPeriod = ELEMENTS_DATA.filter(element => element.period === period).map(
      element => element.symbol
    );

    // Count completed elements in this period
    const completedInPeriod = ELEMENTS_DATA.filter(
      element => element.period === period && element.atomicNumber <= currentElement.atomicNumber
    ).length;

    return {
      currentPeriod: period,
      elementsInPeriod,
      completedInPeriod,
    };
  }

  /**
   * Gets the total number of puzzles required to reach a specific element
   */
  private getPreviousThresholdTotal(elementSymbol: ElementSymbol): number {
    const element = this.getElementBySymbol(elementSymbol);
    let total = 0;

    // Sum up all thresholds before this element
    PROGRESSION_THRESHOLDS.forEach(threshold => {
      const toElement = this.getElementBySymbol(threshold.toElement);
      if (toElement.atomicNumber < element.atomicNumber) {
        total += threshold.puzzlesRequired;
      }
    });

    return total;
  }

  /**
   * Gets the progression threshold between two elements
   */
  private getProgressionThreshold(
    fromElement: ElementSymbol,
    toElement: ElementSymbol
  ): ProgressThreshold | undefined {
    // Check if the threshold exists
    return PROGRESSION_THRESHOLDS.find(
      t => t.fromElement === fromElement && t.toElement === toElement
    );
  }

  /**
   * Gets an element by its symbol
   */
  private getElementBySymbol(symbol: ElementSymbol): Element {
    const element = ELEMENTS_DATA.find(element => element.symbol === symbol);

    if (!element) {
      throw new Error(`Element with symbol ${symbol} not found`);
    }

    return element;
  }

  /**
   * Gets the next element by atomic number
   */
  private getNextElementByAtomicNumber(currentAtomicNumber: number): Element | undefined {
    return ELEMENTS_DATA.find(element => element.atomicNumber === currentAtomicNumber + 1);
  }
}
