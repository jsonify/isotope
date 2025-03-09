import { v4 as uuidv4 } from 'uuid';

import { calculatePuzzleReward, awardElectrons } from '../../economy/services/ElectronService';
import type { PlayerProfile } from '../../player/models/PlayerProfile';
import { ProgressionService } from '../../player/services/ProgressionService';
import { ELEMENTS_DATA } from '../../shared/constants/game-constants';
import { GameMode, ElectronSource } from '../../shared/models/domain-models';
import type {
  Puzzle,
  ElementSymbol,
  Element,
  PuzzleResult,
  RewardResult,
} from '../../shared/models/domain-models';

type CompletionResult = {
  result: PuzzleResult;
  reward: RewardResult;
  updatedProfile: PlayerProfile;
};

export class PuzzleService {
  // Remove duplicate declaration
  private readonly progressionService: ProgressionService;

  public constructor() {
    this.progressionService = new ProgressionService();
  }

  public generatePuzzle(gameMode: GameMode, difficulty: number, elements: ElementSymbol[]): Puzzle {
    const puzzle: Puzzle = {
      id: uuidv4(),
      type: gameMode,
      difficulty,
      elements,
      instructions: this.getInstructionsForGameMode(gameMode),
      completed: false,
      perfectSolve: false,
      attempts: 0,
    };

    const isTimedGameMode =
      gameMode === GameMode.ELEMENT_MATCH || gameMode === GameMode.PERIODIC_SORT;

    if (isTimedGameMode) {
      puzzle.timeLimit = 60 + difficulty * 10;
    }

    return puzzle;
  }

  public completePuzzle(
    puzzle: Puzzle,
    profile: PlayerProfile,
    score: number,
    timeRemaining?: number
  ): CompletionResult {
    const isPerfect = this.isPerfectSolve(puzzle, score, timeRemaining);
    const timeTaken = this.calculateTimeTaken(puzzle.timeLimit, timeRemaining);

    const result = this.createPuzzleResult(puzzle, profile, score, timeTaken, isPerfect);
    const reward = calculatePuzzleReward(profile, isPerfect, puzzle.difficulty);
    const updatedProfile = this.applyRewards(profile, reward, puzzle, isPerfect);

    return { result, reward, updatedProfile };
  }

  private createPuzzleResult(
    puzzle: Puzzle,
    profile: PlayerProfile,
    score: number,
    timeTaken: number,
    isPerfect: boolean
  ): PuzzleResult {
    return {
      puzzleId: puzzle.id,
      playerId: profile.id,
      score,
      timeTaken,
      dateCompleted: new Date(),
      isPerfect,
    };
  }

  private applyRewards(
    profile: PlayerProfile,
    reward: RewardResult,
    puzzle: Puzzle,
    isPerfect: boolean
  ): PlayerProfile {
    const profileWithAtomicWeight = this.progressionService.awardAtomicWeight(
      profile,
      reward.progressGain.atomicWeight
    );

    const electronSource = isPerfect
      ? ElectronSource.PERFECT_SOLVE
      : ElectronSource.PUZZLE_COMPLETION;
    // Assuming awardElectrons is meant to be called directly
    const { profile: finalProfile } = awardElectrons(
      profileWithAtomicWeight,
      reward.electrons,
      electronSource,
      `Completed ${GameMode[puzzle.type]} puzzle`
    );

    return finalProfile;
  }

  public getPuzzlesForElement(element: ElementSymbol, gameMode: GameMode, count = 1): Puzzle[] {
    const elementData = this.getElementBySymbol(element);
    const puzzles: Puzzle[] = [];
    const difficulty = this.calculateDifficultyForElement(elementData);

    for (let i = 0; i < count; i++) {
      const puzzle = this.generatePuzzleForGameMode(gameMode, elementData, difficulty);
      puzzles.push(puzzle);
    }

    return puzzles;
  }

  private calculateDifficultyForElement(element: Element): number {
    const baseDifficulty = Math.max(1, Math.floor(element.atomicNumber / 2));
    return Math.min(10, baseDifficulty);
  }

  private isPerfectSolve(puzzle: Puzzle, score: number, timeRemaining?: number): boolean {
    const isPerfectScore = score === 100;
    if (!isPerfectScore) return false;

    if (puzzle.timeLimit !== undefined && typeof timeRemaining === 'number') {
      const minimumTimeRequired = puzzle.timeLimit / 2;
      return timeRemaining >= minimumTimeRequired;
    }

    return true;
  }

  private calculateTimeTaken(
    timeLimit: number | undefined,
    timeRemaining: number | undefined
  ): number {
    if (timeLimit === undefined || typeof timeRemaining !== 'number') {
      return 0;
    }
    return timeLimit - timeRemaining;
  }

  private getRelatedElements(element: Element, count: number): ElementSymbol[] {
    return ELEMENTS_DATA.filter(e => e.atomicNumber !== element.atomicNumber)
      .sort(
        (a, b) =>
          Math.abs(a.atomicNumber - element.atomicNumber) -
          Math.abs(b.atomicNumber - element.atomicNumber)
      )
      .slice(0, count)
      .map(e => e.symbol);
  }

  private generatePuzzleForGameMode(
    gameMode: GameMode,
    elementData: Element,
    difficulty: number
  ): Puzzle {
    switch (gameMode) {
      case GameMode.ELEMENT_MATCH: {
        const relatedElements = this.getRelatedElements(elementData, 5);
        return this.generatePuzzle(gameMode, difficulty, [elementData.symbol, ...relatedElements]);
      }
      case GameMode.PERIODIC_SORT: {
        const periodElements = ELEMENTS_DATA.filter(e => e.period === elementData.period).map(
          e => e.symbol
        );
        return this.generatePuzzle(gameMode, difficulty, periodElements);
      }
      case GameMode.ELECTRON_SHELL: {
        const differentShellElements = ELEMENTS_DATA.filter(e => e.period <= elementData.period)
          .slice(0, 6)
          .map(e => e.symbol);
        return this.generatePuzzle(gameMode, difficulty, differentShellElements);
      }
      default:
        return this.generatePuzzle(gameMode, difficulty, [elementData.symbol]);
    }
  }

  private getInstructionsForGameMode(gameMode: GameMode): string {
    const instructionsMap: Record<GameMode, string> = {
      [GameMode.TUTORIAL]: 'Follow the on-screen instructions to learn the basics of the game.',
      [GameMode.ELEMENT_MATCH]:
        'Match elements with their correct properties by dragging them to the appropriate slots.',
      [GameMode.PERIODIC_SORT]:
        'Arrange the elements in correct order based on their atomic number.',
      [GameMode.ELECTRON_SHELL]: 'Build the correct electron shell configuration for each element.',
      [GameMode.COMPOUND_BUILD]:
        'Create compounds by combining elements according to their valence.',
      [GameMode.ELEMENT_QUIZ]: 'Answer questions about element properties to earn points.',
      [GameMode.REACTION_BALANCE]: 'Balance the chemical equations by adjusting the coefficients.',
      [GameMode.ORBITAL_PUZZLE]: 'Fill the electron orbitals according to the Aufbau principle.',
      [GameMode.ISOTOPE_BUILDER]:
        'Build isotopes by adding the correct number of neutrons to the nucleus.',
      [GameMode.ELECTRON_FLOW]:
        'Guide electrons through the energy levels to complete the circuit.',
    };
    return instructionsMap[gameMode] ?? 'Complete the puzzle to earn electrons and advance.';
  }

  private getElementBySymbol(symbol: ElementSymbol): Element {
    const element = ELEMENTS_DATA.find(element => element.symbol === symbol);

    if (!element) {
      throw new Error(`Element with symbol ${symbol} not found`);
    }

    return element;
  }
}
