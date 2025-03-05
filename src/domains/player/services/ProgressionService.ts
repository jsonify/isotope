// src/domains/player/services/ProgressionService.ts

import { AtomicWeightService } from './AtomicWeightService';
import { ELEMENTS_DATA, PROGRESSION_THRESHOLDS } from '../../shared/constants/game-constants';
import type {
  ElementSymbol,
  PlayerProfile,
  PlayerProgress,
  ProgressThreshold,
  Element,
  Puzzle,
  PuzzleResult,
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
  private atomicWeightService: AtomicWeightService;

  private readonly periodGameUnlocks: Record<number, GameMode[]> = {
    1: [GameMode.TUTORIAL, GameMode.ELEMENT_MATCH],
    2: [GameMode.PERIODIC_SORT, GameMode.ELECTRON_SHELL],
    3: [GameMode.COMPOUND_BUILD, GameMode.ELEMENT_QUIZ],
    4: [GameMode.REACTION_BALANCE],
    5: [GameMode.ORBITAL_PUZZLE],
    6: [GameMode.ISOTOPE_BUILDER],
    7: [GameMode.ELECTRON_FLOW],
  };

  public constructor() {
    this.atomicWeightService = new AtomicWeightService();
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

    // Get elements in current period
    const elementsInPeriod = ELEMENTS_DATA.filter(element => element.period === period).map(
      element => element.symbol
    );

    // Count completed elements in this period
    const completedInPeriod = ELEMENTS_DATA.filter(
      element => element.period === period && element.atomicNumber <= profile.level.atomicNumber
    ).length;

    return {
      currentPeriod: period,
      elementsInPeriod,
      completedInPeriod,
    };
  }

  /**
   * Gets the percentage progress to the next element (0-100)
   */
  public getPercentToNextElement(profile: PlayerProfile): number {
    const currentElement = this.getElementBySymbol(profile.currentElement);
    const nextElement = this.getNextElementByAtomicNumber(currentElement.atomicNumber);

    if (!nextElement) {
      return 100; // Already at max element
    }

    const threshold = this.getProgressionThreshold(profile.currentElement, nextElement.symbol);
    if (!threshold) {
      return 0; // No valid threshold found
    }

    const previousTotal = this.getPreviousThresholdTotal(profile.currentElement);
    const puzzlesCompletedTowardNext = profile.level.atomicWeight - previousTotal;

    return Math.min(
      100,
      Math.round((puzzlesCompletedTowardNext / threshold.puzzlesRequired) * 100)
    );
  }

  /**
   * Gets detailed progress information for UI
   */
  public getPlayerProgress(profile: PlayerProfile): PlayerProgress {
    const currentElement = this.getElementBySymbol(profile.currentElement);
    const nextElement = this.getNextElementByAtomicNumber(currentElement.atomicNumber);

    const previousThresholdTotal = this.getPreviousThresholdTotal(profile.currentElement);
    const puzzlesCompletedTowardNext = profile.level.atomicWeight - previousThresholdTotal;
    const puzzlesRequiredForNext = nextElement
      ? this.calculateRequiredPuzzles(profile.currentElement)
      : 0;

    const percentToNextElement = this.getPercentToNextElement(profile);
    const periodProgress = this.getPeriodProgress(profile);

    return {
      currentElement: profile.currentElement,
      totalPuzzlesCompleted: profile.level.atomicWeight,
      puzzlesCompletedTowardNext,
      puzzlesRequiredForNext,
      percentToNextElement,
      currentPeriod: periodProgress.currentPeriod,
      elementsInCurrentPeriod: periodProgress.elementsInPeriod,
      periodsUnlocked: Math.max(
        ...ELEMENTS_DATA.filter(
          element =>
            ELEMENTS_DATA.findIndex(e => e.symbol === element.symbol) <=
            ELEMENTS_DATA.findIndex(e => e.symbol === profile.currentElement)
        ).map(element => element.period)
      ),
    };
  }

  // ... (rest of the methods from previous implementation)
  public handlePuzzleCompletion(
    profile: PlayerProfile,
    puzzle: Puzzle,
    result: PuzzleResult
  ): PlayerProfile {
    if (!this.isGameModeUnlocked(profile, puzzle.type)) {
      return profile;
    }

    const basePoints = this.atomicWeightService.calculatePuzzlePoints(
      puzzle,
      result,
      profile.level.atomicNumber
    );

    const totalPoints = this.atomicWeightService.calculateBonusPoints(basePoints, {
      isFirstCompletion: !puzzle.completed,
      isFlawlessStreak: result.isPerfect && puzzle.perfectSolve,
      streakLength: this.calculateFlawlessStreak(profile, puzzle.type),
    });

    return this.awardAtomicWeight(profile, totalPoints);
  }

  private calculateFlawlessStreak(_profile: PlayerProfile, _gameMode: GameMode): number {
    return 0;
  }

  public canAdvanceElement(profile: PlayerProfile): boolean {
    const currentElement = this.getElementBySymbol(profile.currentElement);
    const nextElement = this.getNextElementByAtomicNumber(currentElement.atomicNumber);

    if (!nextElement) return false;

    const threshold = this.getProgressionThreshold(profile.currentElement, nextElement.symbol);
    if (!threshold) return false;

    const puzzlesCompletedTowardNext =
      profile.level.atomicWeight - this.getPreviousThresholdTotal(profile.currentElement);

    return puzzlesCompletedTowardNext >= threshold.puzzlesRequired;
  }

  public advanceElement(profile: PlayerProfile): PlayerProfile {
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
        atomicWeight: 0,
      },
    };

    return nextElement.period > currentElement.period
      ? this.handlePeriodAdvancement(updatedProfile, nextElement, currentElement, transitionService)
      : updatedProfile;
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
        atomicWeight: 0,
      },
    };
  }

  public awardAtomicWeight(profile: PlayerProfile, atomicWeightAwarded: number): PlayerProfile {
    if (atomicWeightAwarded <= 0) return profile;

    const transitionService = TransitionService.getInstance();
    const awardTransition: AtomicWeightAwardedTransition = {
      type: TransitionType.ATOMIC_WEIGHT_AWARDED,
      amount: atomicWeightAwarded,
      elementSymbol: profile.currentElement,
      currentTotal: profile.level.atomicWeight + atomicWeightAwarded,
    };

    transitionService.createTransition(TransitionType.ATOMIC_WEIGHT_AWARDED, awardTransition);

    const updatedProfile = {
      ...profile,
      level: {
        ...profile.level,
        atomicWeight: profile.level.atomicWeight + atomicWeightAwarded,
      },
    };

    return this.canAdvanceElement(updatedProfile)
      ? this.advanceElement(updatedProfile)
      : updatedProfile;
  }

  private handlePeriodAdvancement(
    updatedProfile: PlayerProfile,
    nextElement: Element,
    currentElement: Element,
    transitionService: TransitionService
  ): PlayerProfile {
    updatedProfile.level.gameLab++;

    const periodTransition: PeriodCompleteTransition = {
      type: TransitionType.PERIOD_COMPLETE,
      periodNumber: nextElement.period,
      unlockedGameModes: Array.isArray(this.periodGameUnlocks[nextElement.period])
        ? this.periodGameUnlocks[nextElement.period]
        : [],
    };

    transitionService.createTransition(TransitionType.PERIOD_COMPLETE, periodTransition);
    return this.unlockPeriodGames(updatedProfile, nextElement.period);
  }

  public unlockPeriodGames(profile: PlayerProfile, period?: number): PlayerProfile {
    const currentElement = this.getElementBySymbol(profile.currentElement);
    const periodToUse = period ?? currentElement.period;
    const availableGames = this.periodGameUnlocks[periodToUse];
    const gamesToUnlock = availableGames ?? [];

    const transitionService = TransitionService.getInstance();
    const updatedUnlockedGames = [...profile.unlockedGames];

    gamesToUnlock.forEach(gameMode => {
      if (!updatedUnlockedGames.includes(gameMode)) {
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

  public isGameModeUnlocked(profile: PlayerProfile, gameMode: GameMode): boolean {
    return profile.unlockedGames.includes(gameMode);
  }

  public unlockGameMode(profile: PlayerProfile, gameMode: GameMode): PlayerProfile {
    if (this.isGameModeUnlocked(profile, gameMode)) {
      return profile;
    }

    return {
      ...profile,
      unlockedGames: [...profile.unlockedGames, gameMode],
    };
  }

  public calculateRequiredPuzzles(currentElement: ElementSymbol): number {
    const element = this.getElementBySymbol(currentElement);
    const nextElement = this.getNextElementByAtomicNumber(element.atomicNumber);

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

  private getPreviousThresholdTotal(elementSymbol: ElementSymbol): number {
    const element = this.getElementBySymbol(elementSymbol);
    let total = 0;

    PROGRESSION_THRESHOLDS.forEach(threshold => {
      const toElement = this.getElementBySymbol(threshold.toElement);
      if (toElement.atomicNumber < element.atomicNumber) {
        total += threshold.puzzlesRequired;
      }
    });

    return total;
  }

  private getProgressionThreshold(
    fromElement: ElementSymbol,
    toElement: ElementSymbol
  ): ProgressThreshold | undefined {
    return PROGRESSION_THRESHOLDS.find(
      t => t.fromElement === fromElement && t.toElement === toElement
    );
  }

  private getElementBySymbol(symbol: ElementSymbol): Element {
    const element = ELEMENTS_DATA.find(element => element.symbol === symbol);

    if (!element) {
      throw new Error(`Element with symbol ${symbol} not found`);
    }

    return element;
  }

  private getNextElementByAtomicNumber(currentAtomicNumber: number): Element | undefined {
    return ELEMENTS_DATA.find(element => element.atomicNumber === currentAtomicNumber + 1);
  }
}
