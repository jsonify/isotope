// import { v4 as uuidv4 } from 'uuid';
// import {
//   Puzzle,
//   GameMode,
//   ElementSymbol,
//   PlayerProfile,
//   Element,
//   PuzzleResult,
//   RewardResult
// } from '../models/domain-models';
// import { ELEMENTS_DATA } from '../constants/game-constants';
// import { ElectronService } from '../../economy/services/ElectronService';

// export class PuzzleService {
//   private electronService: ElectronService;

//   constructor(electronService: ElectronService) {
//     this.electronService = electronService;
//   }

//   /**
//    * Generates a new puzzle based on game mode and difficulty
//    */
//   generatePuzzle(gameMode: GameMode, difficulty: number, elements: ElementSymbol[]): Puzzle {
//     // Create base puzzle
//     const puzzle: Puzzle = {
//       id: uuidv4(),
//       type: gameMode,
//       difficulty,
//       elements,
//       instructions: this.getInstructionsForGameMode(gameMode),
//       completed: false,
//       perfectSolve: false,
//       attempts: 0
//     };

//     // Add time limit for certain game modes
//     if (
//       gameMode === GameMode.ELEMENT_MATCH ||
//       gameMode === GameMode.PERIODIC_SORT
//     ) {
//       puzzle.timeLimit = 60 + (difficulty * 10); // Base time + difficulty bonus
//     }

//     return puzzle;
//   }

//   /**
//    * Records completion of a puzzle and returns rewards
//    */
//   completePuzzle(
//     puzzle: Puzzle,
//     profile: PlayerProfile,
//     score: number,
//     timeRemaining?: number
//   ): { result: PuzzleResult; reward: RewardResult; updatedProfile: PlayerProfile } {
//     // Calculate whether this was a perfect solve
//     const isPerfect = this.isPerfectSolve(puzzle, score, timeRemaining);

//     // Create the puzzle result
//     const result: PuzzleResult = {
//       puzzleId: puzzle.id,
//       playerId: profile.id,
//       score,
//       timeTaken: puzzle.timeLimit ? (puzzle.timeLimit - (timeRemaining || 0)) : 0,
//       dateCompleted: new Date(),
//       isPerfect
//     };

//     // Calculate rewards
//     const reward = this.electronService.calculatePuzzleReward(
//       profile,
//       isPerfect,
//       puzzle.difficulty
//     );

//     // Update player profile
//     const updatedProfile = {
//       ...profile,
//       level: {
//         ...profile.level,
//         atomicWeight: profile.level.atomicWeight + reward.progressGain.atomicWeight
//       },
//       updatedAt: new Date()
//     };

//     // Award electrons
//     const { profile: profileWithElectrons } = this.electronService.awardElectrons(
//       updatedProfile,
//       reward.electrons,
//       isPerfect ? 'perfect' : 'puzzle',
//       `Completed ${GameMode[puzzle.type]} puzzle`
//     );

//     return {
//       result,
//       reward,
//       updatedProfile: profileWithElectrons
//     };
//   }

//   /**
//    * Gets puzzles suitable for a specific element
//    */
//   getPuzzlesForElement(element: ElementSymbol, gameMode: GameMode, count: number = 1): Puzzle[] {
//     const elementData = this.getElementBySymbol(element);

//     // Generate puzzles based on the element and game mode
//     const puzzles: Puzzle[] = [];
//     const difficulty = this.calculateDifficultyForElement(elementData);

//     for (let i = 0; i < count; i++) {
//       // For element match, use the current element and some other unlocked elements
//       if (gameMode === GameMode.ELEMENT_MATCH) {
//         // Select elements with atomic numbers close to the current element
//         const relatedElements = this.getRelatedElements(elementData, 5);
//         puzzles.push(this.generatePuzzle(gameMode, difficulty, [element, ...relatedElements]));
//       }
//       // For periodic sort, use elements from the same period
//       else if (gameMode === GameMode.PERIODIC_SORT) {
//         const periodElements = ELEMENTS_DATA
//           .filter(e => e.period === elementData.period)
//           .map(e => e.symbol);
//         puzzles.push(this.generatePuzzle(gameMode, difficulty, periodElements));
//       }
//       // For electron shell puzzles, use elements with different electron configurations
//       else if (gameMode === GameMode.ELECTRON_SHELL) {
//         const differentShellElements = ELEMENTS_DATA
//           .filter(e => e.period <= elementData.period)
//           .slice(0, 6)
//           .map(e => e.symbol);
//         puzzles.push(this.generatePuzzle(gameMode, difficulty, differentShellElements));
//       }
//       // Default case - just use the current element
//       else {
//         puzzles.push(this.generatePuzzle(gameMode, difficulty, [element]));
//       }
//     }

//     return puzzles;
//   }

//   /**
//    * Calculates difficulty based on element
//    */
//   private calculateDifficultyForElement(element: Element): number {
//     // Base difficulty on atomic number
//     const baseDifficulty = Math.max(1, Math.floor(element.atomicNumber / 2));

//     // Cap at a reasonable maximum
//     return Math.min(10, baseDifficulty);
//   }

//   /**
//    * Determines if a solve was perfect based on score and time
//    */
//   private isPerfectSolve(puzzle: Puzzle, score: number, timeRemaining?: number): boolean {
//     // Perfect score is required
//     if (score < 100) return false;

//     // For timed puzzles, check if enough time remained
//     if (puzzle.timeLimit && timeRemaining !== undefined) {
//       // Perfect if at least 50% of time remains
//       return timeRemaining >= (puzzle.timeLimit / 2);
//     }

//     // For untimed puzzles, just check score
//     return score === 100;
//   }

//   /**
//    * Get a list of related elements by atomic number proximity
//    */
//   private getRelatedElements(element: Element, count: number): ElementSymbol[] {
//     // Get elements close to the current element in atomic number
//     return ELEMENTS_DATA
//       .filter(e => e.atomicNumber !== element.atomicNumber) // Exclude current element
//       .sort((a, b) =>
//         Math.abs(a.atomicNumber - element.atomicNumber) -
//         Math.abs(b.atomicNumber - element.atomicNumber)
//       )
//       .slice(0, count)
//       .map(e => e.symbol);
//   }

//   /**
//    * Gets instructions for a specific game mode
//    */
//   private getInstructionsForGameMode(gameMode: GameMode): string {
//     switch (gameMode) {
//       case GameMode.TUTORIAL:
//         return "Follow the on-screen instructions to learn the basics of the game.";
//       case GameMode.ELEMENT_MATCH:
//         return "Match elements with their correct properties by dragging them to the appropriate slots.";
//       case GameMode.PERIODIC_SORT:
//         return "Arrange the elements in correct order based on their atomic number.";
//       case GameMode.ELECTRON_SHELL:
//         return "Build the correct electron shell configuration for each element.";
//       case GameMode.COMPOUND_BUILD:
//         return "Create compounds by combining elements according to their valence.";
//       case GameMode.ELEMENT_QUIZ:
//         return "Answer questions about element properties to earn points.";
//       case GameMode.REACTION_BALANCE:
//         return "Balance the chemical equations by adjusting the coefficients.";
//       case GameMode.ORBITAL_PUZZLE:
//         return "Fill the electron orbitals according to the Aufbau principle.";
//       case GameMode.ISOTOPE_BUILDER:
//         return "Build isotopes by adding the correct number of neutrons to the nucleus.";
//       case GameMode.ELECTRON_FLOW:
//         return "Guide electrons through the energy levels to complete the circuit.";
//       default:
//         return "Complete the puzzle to earn electrons and advance.";
//     }
//   }

//   /**
//    * Gets an element by its symbol
//    */
//   private getElementBySymbol(symbol: ElementSymbol): Element {
//     const element = ELEMENTS_DATA.find(element => element.symbol === symbol);

//     if (!element) {
//       throw new Error(`Element with symbol ${symbol} not found`);
//     }

//     return element;
//   }
// }
