import { describe, it, expect } from 'vitest';

import type { PlayerProfile } from '../../domain-models';
import { GameMode } from '../../domain-models';

describe('PlayerProfile Interface', () => {
  const testProfile: PlayerProfile = {
    id: 'test-id',
    displayName: 'Test Player',
    level: {
      atomicNumber: 1,
      atomicWeight: 5,
      gameLab: 1,
    },
    currentElement: 'H',
    electrons: 100,
    unlockedGames: [GameMode.TUTORIAL],
    achievements: [],
    lastLogin: new Date(),
    tutorialCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should validate profile data structure', () => {
    expect(testProfile).toHaveProperty('id');
    expect(testProfile).toHaveProperty('displayName');
    expect(testProfile).toHaveProperty('level');
    expect(testProfile).toHaveProperty('currentElement');
    expect(testProfile).toHaveProperty('electrons');
    expect(testProfile).toHaveProperty('unlockedGames');
    expect(testProfile).toHaveProperty('achievements');
  });

  it('should validate date fields', () => {
    expect(testProfile.lastLogin).toBeInstanceOf(Date);
    expect(testProfile.createdAt).toBeInstanceOf(Date);
    expect(testProfile.updatedAt).toBeInstanceOf(Date);
  });
});
