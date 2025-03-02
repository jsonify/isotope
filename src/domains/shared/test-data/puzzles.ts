// src/domains/shared/test-data/puzzles.ts
import { v4 as uuidv4 } from 'uuid';

import type { Puzzle, PuzzleResult } from '../models/domain-models';
import { GameMode } from '../models/domain-models';

/**
 * Test puzzles for development
 */
export const TEST_PUZZLES: Record<GameMode, Puzzle[]> = {
  [GameMode.TUTORIAL]: [
    {
      id: uuidv4(),
      type: GameMode.TUTORIAL,
      difficulty: 1,
      elements: ['H'],
      instructions: 'Welcome to Isotope! Follow these steps to learn the basics.',
      completed: false,
      perfectSolve: false,
      attempts: 0,
    },
  ],

  [GameMode.ELEMENT_MATCH]: [
    {
      id: uuidv4(),
      type: GameMode.ELEMENT_MATCH,
      difficulty: 2,
      elements: ['H', 'He', 'Li', 'Be'],
      instructions: 'Match each element to its correct atomic number and properties.',
      timeLimit: 60,
      completed: false,
      perfectSolve: false,
      attempts: 0,
    },
    {
      id: uuidv4(),
      type: GameMode.ELEMENT_MATCH,
      difficulty: 4,
      elements: ['Na', 'Mg', 'Al', 'Si', 'P', 'S'],
      instructions:
        'Match elements with their correct properties by dragging them to the appropriate slots.',
      timeLimit: 90,
      completed: false,
      perfectSolve: false,
      attempts: 0,
    },
  ],

  [GameMode.PERIODIC_SORT]: [
    {
      id: uuidv4(),
      type: GameMode.PERIODIC_SORT,
      difficulty: 3,
      elements: ['Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'],
      instructions: 'Arrange these Period 2 elements in the correct order by atomic number.',
      timeLimit: 45,
      completed: false,
      perfectSolve: false,
      attempts: 0,
    },
  ],

  [GameMode.ELECTRON_SHELL]: [
    {
      id: uuidv4(),
      type: GameMode.ELECTRON_SHELL,
      difficulty: 3,
      elements: ['H', 'He', 'Li', 'Be', 'B', 'C'],
      instructions: 'Build the correct electron shell configuration for each element.',
      completed: false,
      perfectSolve: false,
      attempts: 0,
    },
  ],

  [GameMode.COMPOUND_BUILD]: [
    {
      id: uuidv4(),
      type: GameMode.COMPOUND_BUILD,
      difficulty: 5,
      elements: ['H', 'O', 'N', 'C'],
      instructions:
        'Create these compounds: H2O, NH3, and CH4 by combining elements according to their valence.',
      completed: false,
      perfectSolve: false,
      attempts: 0,
    },
  ],

  [GameMode.ELEMENT_QUIZ]: [
    {
      id: uuidv4(),
      type: GameMode.ELEMENT_QUIZ,
      difficulty: 4,
      elements: ['Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'],
      instructions: 'Answer questions about Period 3 element properties to earn points.',
      timeLimit: 120,
      completed: false,
      perfectSolve: false,
      attempts: 0,
    },
  ],

  [GameMode.REACTION_BALANCE]: [
    {
      id: uuidv4(),
      type: GameMode.REACTION_BALANCE,
      difficulty: 6,
      elements: ['H', 'O', 'C'],
      instructions: 'Balance the combustion reaction: CH4 + O2 -> CO2 + H2O',
      completed: false,
      perfectSolve: false,
      attempts: 0,
    },
  ],

  [GameMode.ORBITAL_PUZZLE]: [
    {
      id: uuidv4(),
      type: GameMode.ORBITAL_PUZZLE,
      difficulty: 7,
      elements: ['Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'],
      instructions: 'Fill the electron orbitals according to the Aufbau principle.',
      completed: false,
      perfectSolve: false,
      attempts: 0,
    },
  ],

  [GameMode.ISOTOPE_BUILDER]: [
    {
      id: uuidv4(),
      type: GameMode.ISOTOPE_BUILDER,
      difficulty: 8,
      elements: ['H', 'C', 'O'],
      instructions: 'Build these isotopes: deuterium (H-2), C-14, and O-18.',
      completed: false,
      perfectSolve: false,
      attempts: 0,
    },
  ],

  [GameMode.ELECTRON_FLOW]: [
    {
      id: uuidv4(),
      type: GameMode.ELECTRON_FLOW,
      difficulty: 9,
      elements: ['Na', 'Cl'],
      instructions: 'Guide electrons through energy levels to complete the ionic bond in NaCl.',
      completed: false,
      perfectSolve: false,
      attempts: 0,
    },
  ],
};

/**
 * Test puzzle results for development
 */
export const TEST_PUZZLE_RESULTS: PuzzleResult[] = [
  {
    puzzleId: Object.values(TEST_PUZZLES)[0][0].id,
    playerId: 'test-player-1',
    score: 100,
    timeTaken: 120,
    dateCompleted: new Date(Date.now() - 604800000), // 1 week ago
    isPerfect: true,
  },
  {
    puzzleId: Object.values(TEST_PUZZLES)[1][0].id,
    playerId: 'test-player-1',
    score: 85,
    timeTaken: 45,
    dateCompleted: new Date(Date.now() - 432000000), // 5 days ago
    isPerfect: false,
  },
  {
    puzzleId: Object.values(TEST_PUZZLES)[2][0].id,
    playerId: 'test-player-1',
    score: 92,
    timeTaken: 38,
    dateCompleted: new Date(Date.now() - 259200000), // 3 days ago
    isPerfect: false,
  },
];

/**
 * Get a random puzzle of a specific game mode
 */
export const getRandomPuzzle = (gameMode: GameMode): Puzzle => {
  const puzzles = TEST_PUZZLES[gameMode];
  const randomIndex = Math.floor(Math.random() * puzzles.length);

  // Return a copy with a new ID to ensure uniqueness
  return {
    ...puzzles[randomIndex],
    id: uuidv4(),
  };
};

export default TEST_PUZZLES;
