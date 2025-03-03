import { describe, it, expect } from 'vitest';

import type { PlayerLevel } from '../../domain-models';

describe('PlayerLevel Interface', () => {
  const validLevel: PlayerLevel = {
    atomicNumber: 1,
    atomicWeight: 5,
    gameLab: 1,
  };

  it('should validate level constraints', () => {
    expect(validLevel.atomicNumber).toBeGreaterThanOrEqual(0);
    expect(validLevel.atomicNumber).toBeLessThanOrEqual(118);
    expect(validLevel.atomicWeight).toBeGreaterThanOrEqual(0);
    expect(validLevel.gameLab).toBeGreaterThanOrEqual(0);
  });
});
