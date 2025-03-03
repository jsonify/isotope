import { describe, it, expect } from 'vitest';

import { GameMode } from '../../domain-models';

describe('GameMode Enum', () => {
  it('should have all required game modes', () => {
    expect(GameMode.TUTORIAL).toBe(0);
    expect(GameMode.ELEMENT_MATCH).toBe(1);
    expect(GameMode.PERIODIC_SORT).toBe(2);
    expect(GameMode.ELECTRON_SHELL).toBe(3);
    expect(GameMode.COMPOUND_BUILD).toBe(4);
    expect(GameMode.ELEMENT_QUIZ).toBe(5);
    expect(GameMode.REACTION_BALANCE).toBe(6);
    expect(GameMode.ORBITAL_PUZZLE).toBe(7);
    expect(GameMode.ISOTOPE_BUILDER).toBe(8);
    expect(GameMode.ELECTRON_FLOW).toBe(9);
  });
});
