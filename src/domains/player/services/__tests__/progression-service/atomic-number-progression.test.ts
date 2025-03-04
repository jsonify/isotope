import { describe, it, expect, beforeEach } from 'vitest';

import { setupAtomicTest, type TestContext } from './test-setup';
import type { ElementSymbol } from '../../../../shared/models/domain-models';
import { TransitionType } from '../../../../shared/models/transition-models';
import { ProgressionService } from '../../ProgressionService';

// Base test setup and atomic weight award tests
describe('ProgressionService - Basic Atomic Weight', () => {
  let progressionService: ProgressionService;
  let context: TestContext;

  beforeEach(() => {
    progressionService = new ProgressionService();
    context = setupAtomicTest();
  });

  it('should correctly award atomic weight', () => {
    const result = progressionService.awardAtomicWeight(context.mockProfile, 2);

    expect(result.level.atomicWeight).toBe(2);
    expect(context.transitionService.createTransition).toHaveBeenCalledWith(
      TransitionType.ATOMIC_WEIGHT_AWARDED,
      expect.objectContaining({
        amount: 2,
        elementSymbol: 'H',
        currentTotal: 2,
      })
    );
  });

  it('should not award negative atomic weight', () => {
    const result = progressionService.awardAtomicWeight(context.mockProfile, -1);

    expect(result).toEqual(context.mockProfile);
    expect(context.transitionService.createTransition).not.toHaveBeenCalled();
  });

  it('should accumulate atomic weight without advancing if threshold not met', () => {
    const result = progressionService.awardAtomicWeight(context.mockProfile, 2);
    const secondResult = progressionService.awardAtomicWeight(result, 1);

    expect(secondResult.currentElement).toBe('H');
    expect(secondResult.level.atomicNumber).toBe(1);
    expect(secondResult.level.atomicWeight).toBe(3);
  });
});

// Element advancement tests
describe('ProgressionService - Element Advancement', () => {
  let progressionService: ProgressionService;
  let context: TestContext;

  beforeEach(() => {
    progressionService = new ProgressionService();
    context = setupAtomicTest();
  });

  it('should trigger element advancement when threshold is met', () => {
    const result = progressionService.awardAtomicWeight(context.mockProfile, 4);

    expect(result.currentElement).toBe('He');
    expect(result.level.atomicNumber).toBe(2);
    expect(result.level.atomicWeight).toBe(0); // Should reset after advancement
    expect(context.transitionService.createTransition).toHaveBeenCalledWith(
      TransitionType.ELEMENT_ADVANCE,
      expect.objectContaining({
        fromElement: 'H',
        toElement: 'He',
      })
    );
  });

  it('should handle maximum element case', () => {
    // Set profile to last element (Ca)
    const maxProfile = {
      ...context.mockProfile,
      currentElement: 'Ca' as ElementSymbol,
      level: { ...context.mockProfile.level, atomicNumber: 20 },
    };

    const result = progressionService.awardAtomicWeight(maxProfile, 100);

    expect(result.currentElement).toBe('Ca');
    expect(result.level.atomicNumber).toBe(20);
    expect(result.level.atomicWeight).toBe(100);
  });
});

// Period transition tests
describe('ProgressionService - Period Transitions', () => {
  let progressionService: ProgressionService;
  let context: TestContext;

  beforeEach(() => {
    progressionService = new ProgressionService();
    context = setupAtomicTest();
  });

  it('should handle period transitions correctly', () => {
    // Set profile to He (end of period 1)
    const heliumProfile = {
      ...context.mockProfile,
      currentElement: 'He' as ElementSymbol,
      level: { ...context.mockProfile.level, atomicNumber: 2 },
    };

    // Award enough to advance to Li (start of period 2)
    const result = progressionService.awardAtomicWeight(heliumProfile, 6);

    expect(result.currentElement).toBe('Li');
    expect(result.level.atomicNumber).toBe(3);
    expect(result.level.gameLab).toBe(1); // Should increment for new period
    expect(context.transitionService.createTransition).toHaveBeenCalledWith(
      TransitionType.PERIOD_COMPLETE,
      expect.objectContaining({
        periodNumber: 2,
      })
    );
  });
});
