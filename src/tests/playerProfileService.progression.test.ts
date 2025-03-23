import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';

import { PlayerProfileService } from '../domains/player/services/PlayerProfileService';
import { GameMode } from '../domains/shared/models/domain-models';
import type { Achievement } from '../domains/shared/models/domain-models';

const mockLogService = {
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
};

vi.mock('../domains/shared/services/LogService', () => ({
  LogService: {
    getInstance: (): typeof mockLogService => mockLogService,
  },
}));

describe('PlayerProfileService - Progression Features', () => {
  let service: PlayerProfileService;

  const createTestAchievement = (overrides: Partial<Achievement> = {}): Achievement => ({
    id: 'test-achievement',
    name: 'Test Achievement',
    description: 'Achievement for testing',
    category: 'progression',
    electronReward: 100,
    dateUnlocked: new Date(),
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    service = new PlayerProfileService();
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Level and Element Progression', () => {
    it('should update player level correctly', () => {
      service.getProfile(); // Initialize state
      const updatedProfile = service.updateLevel({
        atomicNumber: 2,
        atomicWeight: 1,
        gameLab: 1,
      });

      expect(updatedProfile.level).toEqual({
        atomicNumber: 2,
        atomicWeight: 1,
        gameLab: 1,
      });
      expect(updatedProfile.updatedAt).toBeInstanceOf(Date);
    });

    it('should set current element with transition', () => {
      service.getProfile(); // Initialize state
      const updatedProfile = service.setCurrentElement('He');

      expect(updatedProfile.currentElement).toBe('He');
      expect(updatedProfile.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Achievement System', () => {
    it('should add achievement with unlock date', () => {
      service.getProfile(); // Initialize state
      const achievement = createTestAchievement();
      const updatedProfile = service.addAchievement(achievement);

      expect(updatedProfile.achievements).toHaveLength(1);
      expect(updatedProfile.achievements[0]).toEqual({
        ...achievement,
        dateUnlocked: expect.any(Date),
      });
    });

    it('should not add duplicate achievements', () => {
      const achievement = createTestAchievement();
      service.addAchievement(achievement);
      const updatedProfile = service.addAchievement(achievement);

      expect(updatedProfile.achievements).toHaveLength(1);
    });
  });

  describe('Game Mode Management', () => {
    it('should unlock game modes correctly', () => {
      service.getProfile(); // Initialize state
      const updatedProfile = service.unlockGameMode(GameMode.TUTORIAL);

      expect(updatedProfile.unlockedGames).toContain(GameMode.TUTORIAL);
      expect(updatedProfile.updatedAt).toBeInstanceOf(Date);
    });

    it('should not duplicate unlocked game modes', () => {
      service.unlockGameMode(GameMode.TUTORIAL);
      const updatedProfile = service.unlockGameMode(GameMode.TUTORIAL);

      expect(updatedProfile.unlockedGames).toHaveLength(1);
      expect(updatedProfile.unlockedGames).toContain(GameMode.TUTORIAL);
    });
  });

  describe('Electron Economy', () => {
    it('should award electrons correctly', () => {
      service.getProfile(); // Initialize state
      const updatedProfile = service.awardElectrons(100);

      expect(updatedProfile.electrons).toBe(100);
    });

    it('should accumulate electron awards', () => {
      service.awardElectrons(100);
      const updatedProfile = service.awardElectrons(50);

      expect(updatedProfile.electrons).toBe(150);
    });

    it('should handle spending electrons successfully', () => {
      service.awardElectrons(100);
      const { success, profile } = service.spendElectrons(50);

      expect(success).toBe(true);
      expect(profile.electrons).toBe(50);
    });

    it('should prevent spending more electrons than available', () => {
      service.awardElectrons(100);
      const { success, profile } = service.spendElectrons(150);

      expect(success).toBe(false);
      expect(profile.electrons).toBe(100);
    });
  });
});
