// src/domains/shared/test-data/index.ts
// Export all test data from a single file for easy importing
export * from './elements';
export * from './player-profiles';
export * from './puzzles';
export * from './progression-thresholds';
export * from './store-items';
export * from './test-utils';

// Default export with all test data grouped
export default {
  elements: require('./elements').default,
  playerProfiles: require('./player-profiles').default,
  puzzles: require('./puzzles').default,
  progressionThresholds: require('./progression-thresholds').default,
  storeItems: require('./store-items').default,
  testUtils: require('./test-utils').default,
};
