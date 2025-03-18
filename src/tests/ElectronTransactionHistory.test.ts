import { describe, it, expect, beforeEach } from 'vitest';

import {
  clearAllElectronServiceData,
  addElectrons,
  getElectronTransactionHistory,
} from '../domains/economy/services/ElectronService';

describe('Electron Transaction History', () => {
  const TEST_PLAYER_ID = 'test-player-1';
  const OTHER_PLAYER_ID = 'test-player-2';

  beforeEach(() => {
    // Only clear the state, don't initialize balances
    clearAllElectronServiceData();
  });

  it('should maintain separate transaction histories for different players', () => {
    addElectrons(TEST_PLAYER_ID, 30);
    addElectrons(OTHER_PLAYER_ID, 20);

    const history1 = getElectronTransactionHistory(TEST_PLAYER_ID);
    const history2 = getElectronTransactionHistory(OTHER_PLAYER_ID);

    expect(history1).toHaveLength(1);
    expect(history2).toHaveLength(1);
    expect(history1[0].amount).toBe(30);
    expect(history2[0].amount).toBe(20);
  });

  it('should return empty array for players without history', () => {
    const history = getElectronTransactionHistory('non-existent-player');
    expect(history).toEqual([]);
  });
});
