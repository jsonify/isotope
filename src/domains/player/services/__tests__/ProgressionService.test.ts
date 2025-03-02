// src/domains/player/services/__tests__/ProgressionService.test.ts
import { describe } from 'vitest';

// Import test suites
import { ProgressionService } from '../ProgressionService';
import { testAdvanceElement } from './progression-suites/advanceElement.suite';
import { testCanAdvanceElement } from './progression-suites/canAdvanceElement.suite';
import { testGameModeManagement } from './progression-suites/gameModeManagement.suite';
import { testProgressCalculation } from './progression-suites/progressCalculation.suite';
import { testRequiredPuzzlesCalculation } from './progression-suites/requiredPuzzles.suite';
import { testUnlockPeriodGames } from './progression-suites/unlockPeriodGames.suite';
import { GameMode } from '../../../shared/models/domain-models';
import type { PlayerProfile } from '../../../shared/models/domain-models';

// Setup common test objects and helper functions
function setupTestEnvironment(): {
  service: ProgressionService;
  baseProfile: PlayerProfile;
  createProfile: (overrides: Partial<PlayerProfile>) => PlayerProfile;
} {
  const service = new ProgressionService();

  // Base profile for testing
  const baseProfile: PlayerProfile = {
    id: 'test-id',
    displayName: 'Test User',
    level: {
      atomicNumber: 1,
      atomicWeight: 3, // 3 puzzles completed
      gameLab: 0,
    },
    currentElement: 'H',
    electrons: 10,
    unlockedGames: [GameMode.TUTORIAL, GameMode.ELEMENT_MATCH],
    achievements: [],
    lastLogin: new Date(),
    tutorialCompleted: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Helper function to create profile with specific attributes
  const createProfile = (overrides: Partial<PlayerProfile> = {}): PlayerProfile => {
    return {
      ...baseProfile,
      ...overrides,
      level: {
        ...baseProfile.level,
        ...(overrides.level || {}),
      },
    };
  };

  return { service, baseProfile, createProfile };
}

// Main test suite
describe('ProgressionService', () => {
  // Use the describe-as-a-function pattern to keep each group modular
  testCanAdvanceElement(setupTestEnvironment);
  testAdvanceElement(setupTestEnvironment);
  testUnlockPeriodGames(setupTestEnvironment);
  testGameModeManagement(setupTestEnvironment);
  testProgressCalculation(setupTestEnvironment);
  testRequiredPuzzlesCalculation(setupTestEnvironment);
});
