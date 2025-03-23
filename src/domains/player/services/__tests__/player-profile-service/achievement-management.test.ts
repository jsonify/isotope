import { describe, it, expect, beforeEach, vi } from 'vitest';

import { setupTest } from './setup';
import type { Achievement, PlayerProfile } from '../../../../shared/models/domain-models';
import { TransitionType } from '../../../../shared/models/transition-models';
import type { AchievementUnlockTransition } from '../../../../shared/models/transition-models';
import {
  TransitionService,
  type TransitionHandler,
} from '../../../../shared/services/TransitionService';
import { PlayerProfileService } from '../../PlayerProfileService';

let mockCreateTransition: ReturnType<typeof vi.fn>;

describe('PlayerProfileService - Achievement Management', () => {
  let service: PlayerProfileService;

  beforeEach(() => {
    mockCreateTransition = vi.fn();
    setupMockServices();
    service = new PlayerProfileService();
  });

  const testAchievement: Achievement = {
    id: 'test-achievement',
    name: 'Test Achievement',
    description: 'Achievement for testing',
    dateUnlocked: new Date(0), // Service should override this with current date
    category: 'progression',
    electronReward: 100,
  };

  it('should add new achievement', () => {
    const profile = service.addAchievement(testAchievement);

    expect(profile.achievements).toHaveLength(1);
    expect(profile.achievements[0].id).toBe(testAchievement.id);
    expect(mockCreateTransition).toHaveBeenCalledTimes(1);

    // Verify transition creation
    verifyTransitionCreation(profile, testAchievement, mockCreateTransition);
  });

  it('should not add duplicate achievements', () => {
    service.addAchievement(testAchievement);
    const profile = service.addAchievement(testAchievement);

    expect(profile.achievements).toHaveLength(1);
    expect(mockCreateTransition).toHaveBeenCalledTimes(1); // Should only create transition once
  });

  it('should properly store achievement unlock date', () => {
    const beforeUnlock = new Date();
    const profile = service.addAchievement(testAchievement);
    const afterUnlock = new Date();

    const achievement = profile.achievements[0];
    const unlockTime = achievement.dateUnlocked.getTime();

    expect(unlockTime).toBeGreaterThanOrEqual(beforeUnlock.getTime());
    expect(unlockTime).toBeLessThanOrEqual(afterUnlock.getTime());
  });
});

function setupMockServices(): void {
  setupTest();

  // Create a complete mock of TransitionService
  const mockTransitionService = {
    subscribers: new Set<TransitionHandler>(),
    activeTransitions: new Map(),
    prefersReducedMotion: false,
    createTransition: mockCreateTransition,
    subscribe: vi.fn(),
    startTransition: vi.fn(),
    completeTransition: vi.fn(),
    getTransition: vi.fn(),
    getAllActiveTransitions: vi.fn(),
    clearAllTransitions: vi.fn(),
    checkReducedMotion: vi.fn(),
    notifySubscribers: vi.fn(),
  } as unknown as TransitionService;

  // Mock the static getInstance method
  vi.spyOn(TransitionService, 'getInstance').mockImplementation(
    () => mockTransitionService as TransitionService
  );
}

function verifyTransitionCreation(
  profile: PlayerProfile,
  achievement: Achievement,
  mockCreateTransition: ReturnType<typeof vi.fn>
): void {
  const expectedTransitionData: AchievementUnlockTransition = {
    type: TransitionType.ACHIEVEMENT_UNLOCK,
    achievement: {
      ...achievement,
      dateUnlocked: profile.achievements[0].dateUnlocked,
    },
  };
  expect(mockCreateTransition).toHaveBeenCalledWith(
    TransitionType.ACHIEVEMENT_UNLOCK,
    expectedTransitionData
  );
}
