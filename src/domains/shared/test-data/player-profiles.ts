// src/domains/shared/test-data/player-profiles.ts
import { v4 as uuidv4 } from 'uuid';

import type { PlayerProfile } from '../models/domain-models';
import { GameMode } from '../models/domain-models';

/**
 * Test player profiles for development
 */
export const TEST_PLAYER_PROFILES: Record<string, PlayerProfile> = {
  // New player who just started
  newPlayer: {
    id: uuidv4(),
    displayName: 'New Scientist',
    level: {
      atomicNumber: 1,
      atomicWeight: 0,
      gameLab: 0,
    },
    currentElement: 'H',
    electrons: 0,
    unlockedGames: [GameMode.TUTORIAL],
    achievements: [],
    lastLogin: new Date(),
    tutorialCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Player who completed tutorial
  beginnerPlayer: {
    id: uuidv4(),
    displayName: 'Lab Assistant',
    level: {
      atomicNumber: 1,
      atomicWeight: 2,
      gameLab: 0,
    },
    currentElement: 'H',
    electrons: 15,
    unlockedGames: [GameMode.TUTORIAL, GameMode.ELEMENT_MATCH],
    achievements: [
      {
        id: 'achievement_tutorial',
        name: 'First Steps',
        description: 'Completed the tutorial',
        dateUnlocked: new Date(Date.now() - 86400000), // 1 day ago
        category: 'progression',
        electronReward: 10,
      },
    ],
    lastLogin: new Date(),
    tutorialCompleted: true,
    createdAt: new Date(Date.now() - 604800000), // 1 week ago
    updatedAt: new Date(),
  },

  // Intermediate player
  intermediatePlayer: {
    id: uuidv4(),
    displayName: 'Chemistry Student',
    level: {
      atomicNumber: 10,
      atomicWeight: 120,
      gameLab: 2,
    },
    currentElement: 'Ne',
    electrons: 350,
    unlockedGames: [
      GameMode.TUTORIAL,
      GameMode.ELEMENT_MATCH,
      GameMode.PERIODIC_SORT,
      GameMode.ELECTRON_SHELL,
      GameMode.COMPOUND_BUILD,
    ],
    achievements: [
      {
        id: 'achievement_tutorial',
        name: 'First Steps',
        description: 'Completed the tutorial',
        dateUnlocked: new Date(Date.now() - 2592000000), // 30 days ago
        category: 'progression',
        electronReward: 10,
      },
      {
        id: 'achievement_period1',
        name: 'Period 1 Master',
        description: 'Unlocked all elements in period 1',
        dateUnlocked: new Date(Date.now() - 1728000000), // 20 days ago
        category: 'progression',
        electronReward: 25,
      },
      {
        id: 'achievement_period2',
        name: 'Period 2 Explorer',
        description: 'Reached period 2 of the periodic table',
        dateUnlocked: new Date(Date.now() - 864000000), // 10 days ago
        category: 'progression',
        electronReward: 50,
      },
      {
        id: 'achievement_perfect_match',
        name: 'Perfect Match',
        description: 'Achieve a perfect score in Element Match game',
        dateUnlocked: new Date(Date.now() - 172800000), // 2 days ago
        category: 'puzzle',
        electronReward: 20,
      },
    ],
    lastLogin: new Date(Date.now() - 86400000), // 1 day ago
    tutorialCompleted: true,
    createdAt: new Date(Date.now() - 7776000000), // 90 days ago
    updatedAt: new Date(Date.now() - 86400000), // 1 day ago
  },

  // Advanced player
  advancedPlayer: {
    id: uuidv4(),
    displayName: 'Lab Professor',
    level: {
      atomicNumber: 18,
      atomicWeight: 300,
      gameLab: 6,
    },
    currentElement: 'Ar',
    electrons: 1200,
    unlockedGames: [
      GameMode.TUTORIAL,
      GameMode.ELEMENT_MATCH,
      GameMode.PERIODIC_SORT,
      GameMode.ELECTRON_SHELL,
      GameMode.COMPOUND_BUILD,
      GameMode.ELEMENT_QUIZ,
      GameMode.REACTION_BALANCE,
      GameMode.ORBITAL_PUZZLE,
    ],
    achievements: [
      // ... many achievements (abbreviated for clarity)
      {
        id: 'achievement_periods_all',
        name: 'Periodic Master',
        description: 'Unlocked elements from all available periods',
        dateUnlocked: new Date(Date.now() - 259200000), // 3 days ago
        category: 'progression',
        electronReward: 100,
      },
    ],
    lastLogin: new Date(),
    tutorialCompleted: true,
    createdAt: new Date(Date.now() - 15552000000), // 180 days ago
    updatedAt: new Date(),
  },
};

/**
 * Function to get a new player profile with a unique ID
 */
export const getNewPlayerProfile = (): PlayerProfile => {
  return {
    ...TEST_PLAYER_PROFILES.newPlayer,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export default TEST_PLAYER_PROFILES;
