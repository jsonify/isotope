// src/domains/shared/test-data/index.ts
// Export all test data from a single file for easy importing
export * from './elements';
export * from './player-profiles';
export * from './puzzles';
export * from './progression-thresholds';
export * from './store-items';
export * from './test-utils';

// Default export with all test data grouped
import elements from './elements';
import playerProfiles from './player-profiles';
import progressionThresholds from './progression-thresholds';
import puzzles from './puzzles';
import storeItems from './store-items';
import testUtils from './test-utils';

export default {
  elements,
  playerProfiles,
  puzzles,
  progressionThresholds,
  storeItems,
  testUtils,
};
