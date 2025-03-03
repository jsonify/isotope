import { describe, it, expect } from 'vitest';

import { ElectronSource } from '../../domain-models';

describe('ElectronSource Enum', () => {
  it('should have all required electron sources', () => {
    expect(ElectronSource.TUTORIAL_COMPLETION).toBe('tutorial');
    expect(ElectronSource.PUZZLE_COMPLETION).toBe('puzzle');
    expect(ElectronSource.DAILY_LOGIN).toBe('daily');
    expect(ElectronSource.ACHIEVEMENT).toBe('achievement');
    expect(ElectronSource.PERFECT_SOLVE).toBe('perfect');
  });
});
