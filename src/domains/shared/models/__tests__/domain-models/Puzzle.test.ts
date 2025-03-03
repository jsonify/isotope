import { describe, it, expect } from 'vitest';

import type { Puzzle } from '../../domain-models';
import { GameMode } from '../../domain-models';

describe('Puzzle Interface', () => {
  const testPuzzle: Puzzle = {
    id: 'puzzle-1',
    type: GameMode.ELEMENT_MATCH,
    difficulty: 1,
    elements: ['H', 'He'],
    instructions: 'Match the elements',
    completed: false,
    perfectSolve: false,
    attempts: 0,
  };

  it('should validate puzzle structure', () => {
    expect(testPuzzle).toHaveProperty('id');
    expect(testPuzzle).toHaveProperty('type');
    expect(testPuzzle).toHaveProperty('difficulty');
    expect(testPuzzle).toHaveProperty('elements');
    expect(testPuzzle).toHaveProperty('instructions');
  });

  it('should validate puzzle elements are valid ElementSymbols', () => {
    testPuzzle.elements.forEach(element => {
      expect([
        'H',
        'He',
        'Li',
        'Be',
        'B',
        'C',
        'N',
        'O',
        'F',
        'Ne',
        'Na',
        'Mg',
        'Al',
        'Si',
        'P',
        'S',
        'Cl',
        'Ar',
        'K',
        'Ca',
      ]).toContain(element);
    });
  });
});
