// src/domains/player/services/__tests__/PlayerProfileService.test.ts
import { expect, describe, test, beforeEach } from 'vitest';

import { INITIAL_PLAYER_PROFILE } from '../../../shared/constants/game-constants';
import { GameMode } from '../../../shared/models/domain-models';
import { PlayerProfileService } from '../PlayerProfileService';

// Mock localStorage
const localStorageMock = (): Storage => {
  let store: Record<string, string> = {};

  return {
    length: Object.keys(store).length,
    key: (index: number): string | null => Object.keys(store)[index] || null,
    setItem: (key: string, value: string): void => {
      store[key] = value.toString();
    },
    getItem: (key: string): string | null => store[key] || null,
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    },
  };
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock() });

// Base service setup for all test suites
const setupService = (): (() => PlayerProfileService) => {
  let service: PlayerProfileService;
  beforeEach(() => {
    localStorage.clear();
    service = new PlayerProfileService();
  });
  return () => service;
};

describe('PlayerProfileService - Profile Creation', () => {
  const getService = setupService();

  test('should create a new profile if none exists', () => {
    const profile = getService().getProfile();

    expect(profile.id).toBeDefined();
    expect(profile.currentElement).toBe(INITIAL_PLAYER_PROFILE.currentElement);
    expect(profile.electrons).toBe(INITIAL_PLAYER_PROFILE.electrons);
    expect(profile.unlockedGames).toEqual(INITIAL_PLAYER_PROFILE.unlockedGames);
  });
});

describe('PlayerProfileService - Profile Management', () => {
  const getService = setupService();

  test('should retrieve an existing profile', () => {
    // Create a profile first
    const newProfile = getService().getProfile();

    // Get it again
    const retrievedProfile = getService().getProfile();

    expect(retrievedProfile.id).toBe(newProfile.id);
  });

  test('should update a profile', () => {
    const service = getService();
    const profile = service.getProfile();
    const updatedProfile = service.updateProfile({ electrons: 10 });

    expect(updatedProfile.electrons).toBe(10);
    expect(updatedProfile.id).toBe(profile.id);
  });

  test('should reset a profile', () => {
    const service = getService();
    // Create and modify a profile
    const profile = service.getProfile();
    service.updateProfile({ electrons: 50 });

    // Reset it
    const resetProfile = service.resetProfile();

    expect(resetProfile.electrons).toBe(INITIAL_PLAYER_PROFILE.electrons);
    expect(resetProfile.id).not.toBe(profile.id);
  });
});

describe('PlayerProfileService - Tutorial', () => {
  const getService = setupService();

  test('should mark tutorial as completed', () => {
    const updatedProfile = getService().completeTutorial();
    expect(updatedProfile.tutorialCompleted).toBe(true);
  });
});

// Enhanced functionality tests split into logical groups
describe('PlayerProfileService - Level Management', () => {
  const getService = setupService();

  test('should update player level', () => {
    const updated = getService().updateLevel({
      atomicNumber: 5,
      atomicWeight: 20,
    });

    expect(updated.level.atomicNumber).toBe(5);
    expect(updated.level.atomicWeight).toBe(20);
    expect(updated.level.gameLab).toBe(INITIAL_PLAYER_PROFILE.level.gameLab);
  });

  test('should set current element', () => {
    const updated = getService().setCurrentElement('He');
    expect(updated.currentElement).toBe('He');
  });
});

describe('PlayerProfileService - Achievement System', () => {
  const getService = setupService();

  test('should add an achievement', () => {
    const service = getService();

    const achievement = {
      id: 'test-achievement',
      name: 'Test Achievement',
      description: 'Achievement for testing',
      dateUnlocked: new Date(),
      category: 'progression' as const,
      electronReward: 10,
    };

    const updated = service.addAchievement(achievement);

    expect(updated.achievements).toHaveLength(1);
    expect(updated.achievements[0].id).toEqual(achievement.id);
  });

  test('should not add duplicate achievements', () => {
    const service = getService();

    const achievement = {
      id: 'test-achievement',
      name: 'Test Achievement',
      description: 'Achievement for testing',
      dateUnlocked: new Date(),
      category: 'progression' as const,
      electronReward: 10,
    };

    service.addAchievement(achievement);
    const withDuplicate = service.addAchievement(achievement);

    expect(withDuplicate.achievements).toHaveLength(1);
  });
});

describe('PlayerProfileService - Game Mode Management', () => {
  const getService = setupService();

  test('should unlock a game mode', () => {
    const updated = getService().unlockGameMode(GameMode.ELEMENT_MATCH);

    expect(updated.unlockedGames).toContain(GameMode.ELEMENT_MATCH);
  });
});

describe('PlayerProfileService - Economy Management', () => {
  const getService = setupService();

  test('should award electrons to the player', () => {
    const service = getService();
    const profile = service.getProfile();
    const initialElectrons = profile.electrons;

    const updated = service.awardElectrons(10);

    expect(updated.electrons).toBe(initialElectrons + 10);
  });

  test('should spend electrons if player has enough', () => {
    const service = getService();
    service.updateProfile({ electrons: 20 });

    const result = service.spendElectrons(15);

    expect(result.success).toBe(true);
    expect(result.profile.electrons).toBe(5);
  });

  test('should not spend electrons if player does not have enough', () => {
    const service = getService();
    service.updateProfile({ electrons: 10 });

    const result = service.spendElectrons(15);

    expect(result.success).toBe(false);
    expect(result.profile.electrons).toBe(10);
  });
});
