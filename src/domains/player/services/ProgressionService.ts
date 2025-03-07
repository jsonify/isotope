// src/domains/player/services/ProgressionService.ts

import { AtomicWeightService } from './AtomicWeightService';
import {
  ELEMENTS_DATA,
  PROGRESSION_THRESHOLDS,
  GAME_MODE_INFO,
} from '../../shared/constants/game-constants';
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
import {
  ProgressionEventEmitter,
  ProgressionEventType,
  type ProgressionEvent,
} from '../../shared/models/progression-events';
import type {
  ElementAdvanceTransition,
  GameModeUnlockTransition,
  AtomicWeightAwardedTransition,
  PeriodCompleteTransition,
} from '../../shared/models/transition-models';
import { TransitionType } from '../../shared/models/transition-models';
import { TransitionService } from '../../shared/services/TransitionService';

// Type guards for strict boolean expressions
function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

function isCacheValid<T>(
  cache: { timestamp: number; progress: T } | null | undefined,
  ttl: number
): cache is { timestamp: number; progress: T } {
  return (
    isDefined(cache) && typeof cache.timestamp === 'number' && Date.now() - cache.timestamp < ttl
  );
}

function isProfileDefined(profile: PlayerProfile | null | undefined): profile is PlayerProfile {
  return isDefined(profile);
}

interface PeriodProgressData {
  currentPeriod: number;
  elementsInPeriod: ElementSymbol[];
  completedInPeriod: number;
  percentComplete: number; // Percentage of elements completed in the period
  remainingElements: number; // Number of elements remaining to complete in the period
  nextMilestone?: ElementSymbol; // The next element to unlock in the period
}

interface CacheEntry {
  progress: PeriodProgressData;
  timestamp: number;
}

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

  private periodProgressCache: Map<string, CacheEntry>;
  private readonly CACHE_TTL = 5000; // 5 seconds cache time-to-live
  private eventEmitter: ProgressionEventEmitter;

  public constructor() {
    this.eventEmitter = ProgressionEventEmitter.getInstance();
    this.atomicWeightService = new AtomicWeightService();
    this.periodProgressCache = new Map();
  }

  /**
   * Get cached progress data
   */
  private getCachedProgress(key: string): CacheEntry | undefined {
    return this.periodProgressCache.get(key);
  }

  /**
   * Set progress data in cache
   */
  private setCachedProgress(key: string, progress: PeriodProgressData): void {
    this.periodProgressCache.set(key, {
      progress,
      timestamp: Date.now(),
    });
  }

  public getPeriodProgress(profile: PlayerProfile): PeriodProgressData {
    // Check cache first
    const cacheKey = `period_progress_${profile.id}_${profile.currentElement}`;
    const cached = this.getCachedProgress(cacheKey);

    // Use type guard instead of direct boolean condition
    if (isCacheValid(cached, this.CACHE_TTL)) {
      return cached.progress;
    }

    // Calculate if not in cache
    const currentElement = this.getElementBySymbol(profile.currentElement);
    const period = currentElement.period;

    // Get elements in current period
    const periodElements = ELEMENTS_DATA.filter(element => element.period === period);
    const elementsInPeriod = periodElements.map(element => element.symbol);

    // Count completed elements in this period
    const completedElements = periodElements.filter(
      element => element.period === period && element.atomicNumber <= profile.level.atomicNumber
    );
    const completedInPeriod = completedElements.length;

    // Calculate percent complete (rounded to nearest integer)
    const percentComplete = Math.round((completedInPeriod / elementsInPeriod.length) * 100);

    // Calculate remaining elements
    const remainingElements = elementsInPeriod.length - completedInPeriod;

    // Find next milestone (next uncompleted element in period)
    const nextMilestone = periodElements.find(
      element => element.period === period && element.atomicNumber > profile.level.atomicNumber
    )?.symbol;

    const progress: PeriodProgressData = {
      currentPeriod: period,
      elementsInPeriod,
      completedInPeriod,
      percentComplete,
      remainingElements,
      nextMilestone,
    };

    // Store in cache
    this.setCachedProgress(cacheKey, progress);

    return progress;
  }

  /**
   * Gets the percentage progress to the next element (0-100)
   */
  private emitProgressionEvent(event: ProgressionEvent): void {
    this.eventEmitter.emit(event);
  }

  /**
   * Gets the game mode info for unlocking in a period
   * @param period The period number
   * @returns Array of game modes with their info
   */
  public getGameModesForPeriod(
    period: number
  ): { mode: GameMode; info: (typeof GAME_MODE_INFO)[GameMode] }[] {
    const modes = this.periodGameUnlocks[period] ?? [];
    return modes.map(mode => ({ mode, info: GAME_MODE_INFO[mode] }));
  }

  public getPercentToNextElement(profile: PlayerProfile): number {
    const currentElement = this.getElementBySymbol(profile.currentElement);
    if (!currentElement) return 0;

    const nextElement = this.getNextElementByAtomicNumber(currentElement.atomicNumber);
    if (!nextElement) {
      return 100; // Already at max element
    }

    const threshold = this.getProgressionThreshold(profile.currentElement, nextElement.symbol);

    const previousTotal = this.getPreviousThresholdTotal(profile.currentElement);
    const puzzlesCompletedTowardNext = profile.level.atomicWeight - previousTotal;

    return Math.min(
      100,
      Math.round((puzzlesCompletedTowardNext / (threshold?.puzzlesRequired ?? 1)) * 100)
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

    // Emit atomic weight gained event
    this.emitProgressionEvent({
      type: ProgressionEventType.ATOMIC_WEIGHT_GAINED,
      playerId: profile.id,
      amount: atomicWeightAwarded,
      totalWeight: profile.level.atomicWeight + atomicWeightAwarded,
      element: profile.currentElement,
      timestamp: Date.now(),
    });

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
    _currentElement: Element,
    transitionService: TransitionService
  ): PlayerProfile {
    if (!isProfileDefined(updatedProfile) || !isDefined(nextElement)) return updatedProfile;

    updatedProfile.level.gameLab++;
    this.clearPeriodProgressCache(updatedProfile.id);

    const periodTransition: PeriodCompleteTransition = {
      type: TransitionType.PERIOD_COMPLETE,
      periodNumber: nextElement.period,
      unlockedGameModes: this.periodGameUnlocks[nextElement.period] ?? [],
    };

    transitionService.createTransition(TransitionType.PERIOD_COMPLETE, periodTransition);

    // Emit period completed event
    this.emitProgressionEvent({
      type: ProgressionEventType.PERIOD_COMPLETED,
      playerId: updatedProfile.id,
      periodNumber: nextElement.period,
      unlockedGameModes: this.periodGameUnlocks[nextElement.period] ?? [],
      timestamp: Date.now(),
    });

    return this.unlockPeriodGames(updatedProfile, nextElement.period);
  }

  /**
   * Unlock games for a specific period
   * @param profile Player profile to update
   * @param period Optional period number, uses current period if not specified
   */
  public unlockPeriodGames(profile: PlayerProfile, period?: number): PlayerProfile {
    if (!isProfileDefined(profile)) return profile;

    const currentElement = this.getElementBySymbol(profile.currentElement);
    const periodToUse = period ?? currentElement.period;
    const availableGames = this.periodGameUnlocks[periodToUse] ?? [];
    const newlyUnlockedGames = availableGames.filter(
      gameMode => !profile.unlockedGames.includes(gameMode)
    );

    const transitionService = TransitionService.getInstance();

    // Create transitions and emit events for newly unlocked games
    newlyUnlockedGames.forEach(gameMode => {
      const unlockTransition: GameModeUnlockTransition = {
        type: TransitionType.GAME_MODE_UNLOCK,
        gameMode,
      };
      transitionService.createTransition(TransitionType.GAME_MODE_UNLOCK, unlockTransition);

      // Emit game mode unlocked event
      this.emitProgressionEvent({
        type: ProgressionEventType.GAME_MODE_UNLOCKED,
        playerId: profile.id,
        gameMode,
        period: periodToUse,
        timestamp: Date.now(),
      });
    });

    return {
      ...profile,
      unlockedGames: [...profile.unlockedGames, ...newlyUnlockedGames],
    };
  }

  public isGameModeUnlocked(profile: PlayerProfile, gameMode: GameMode): boolean {
    return (
      isProfileDefined(profile) &&
      Array.isArray(profile.unlockedGames) &&
      profile.unlockedGames.includes(gameMode)
    );
  }

  public unlockGameMode(profile: PlayerProfile, gameMode: GameMode): PlayerProfile {
    // Use type guard for profile validation
    if (!isProfileDefined(profile) || this.isGameModeUnlocked(profile, gameMode)) {
      return profile;
    }

    return {
      ...profile,
      unlockedGames: [...profile.unlockedGames, gameMode],
    };
  }

  public calculateRequiredPuzzles(currentElement: ElementSymbol): number {
    const element = this.getElementBySymbol(currentElement);
    if (!element) return 0;

    const nextElement = this.getNextElementByAtomicNumber(element.atomicNumber);

    if (!nextElement) {
      const threshold = PROGRESSION_THRESHOLDS.find(t => t.fromElement === currentElement);
      return (
        threshold?.puzzlesRequired ??
        PROGRESSION_THRESHOLDS[PROGRESSION_THRESHOLDS.length - 1].puzzlesRequired
      );
    }

    const threshold = this.getProgressionThreshold(currentElement, nextElement.symbol);
    return threshold === null || threshold === undefined ? 0 : threshold.puzzlesRequired;
  }

  private getPreviousThresholdTotal(elementSymbol: ElementSymbol): number {
    const element = this.getElementBySymbol(elementSymbol);
    let total = 0;

    PROGRESSION_THRESHOLDS.forEach(threshold => {
      const toElement = this.getElementBySymbol(threshold.toElement);
      if (toElement?.atomicNumber < element?.atomicNumber) {
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

  /**
   * Clear period progress cache for a player
   * @param playerId The ID of the player whose cache to clear
   */
  private clearPeriodProgressCache(_playerId: string): void {
    // Clear all cached data for this player
    this.periodProgressCache.clear();
  }
}
