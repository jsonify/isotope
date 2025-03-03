import type { PlayerProfile, ElementSymbol } from '../../../../shared/models/domain-models';
import { GameMode } from '../../../../shared/models/domain-models';
import { ProgressionService } from '../../ProgressionService';

interface TestContext {
  service: ProgressionService;
  baseProfile: PlayerProfile;
}

export const setupTest = (): TestContext => {
  const service = new ProgressionService();
  const baseProfile: PlayerProfile = {
    id: 'test-id',
    displayName: 'Test Player',
    level: {
      atomicNumber: 1,
      atomicWeight: 0,
      gameLab: 1,
    },
    currentElement: 'H',
    electrons: 0,
    unlockedGames: [GameMode.TUTORIAL],
    achievements: [],
    lastLogin: new Date(),
    tutorialCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return { service, baseProfile };
};

export const createAdvancedProfile = (
  currentElement: ElementSymbol,
  atomicNumber: number,
  atomicWeight: number,
  gameLab: number
): PlayerProfile => {
  const { baseProfile } = setupTest();
  return {
    ...baseProfile,
    currentElement,
    level: {
      atomicNumber,
      atomicWeight,
      gameLab,
    },
  };
};
