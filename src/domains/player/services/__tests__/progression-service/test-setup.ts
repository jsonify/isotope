import { vi } from 'vitest';

import { INITIAL_PLAYER_PROFILE } from '../../../../shared/constants/game-constants';
import type { ElementSymbol, PlayerProfile } from '../../../../shared/models/domain-models';
import { TransitionService } from '../../../../shared/services/TransitionService';

export interface TestContext {
  transitionService: TransitionService;
  mockProfile: PlayerProfile;
}

export function setupAtomicTest(): TestContext {
  const transitionService = TransitionService.getInstance();
  vi.spyOn(transitionService, 'createTransition');

  // Create a test profile starting with Hydrogen
  const mockProfile: PlayerProfile = {
    ...INITIAL_PLAYER_PROFILE,
    id: 'test-player-1',
    currentElement: 'H' as ElementSymbol,
    level: {
      atomicNumber: 1,
      atomicWeight: 0,
      gameLab: 0,
    },
  };

  return { transitionService, mockProfile };
}
