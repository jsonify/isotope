import { describe, it, expect, beforeEach } from 'vitest';

import {
  getElectronBalance,
  addElectrons,
  removeElectrons,
  initializePlayerBalance,
} from '../domains/economy/services/ElectronService';

describe('ElectronService', () => {
  const TEST_PLAYER_ID = 'test-player-1';
  const OTHER_PLAYER_ID = 'test-player-2';

  beforeEach(() => {
    // Initialize a fresh state for each test
    initializePlayerBalance(TEST_PLAYER_ID, 0);
    initializePlayerBalance(OTHER_PLAYER_ID, 0);
  });

  describe('getElectronBalance', () => {
    it('should return 0 for new players', () => {
      expect(getElectronBalance('new-player')).toBe(0);
    });

    it('should return correct balance for initialized players', () => {
      initializePlayerBalance(TEST_PLAYER_ID, 100);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(100);
    });
  });

  describe('addElectrons', () => {
    it('should add electrons successfully', () => {
      expect(addElectrons(TEST_PLAYER_ID, 50)).toBe(true);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(50);
    });

    it('should reject negative amounts', () => {
      expect(addElectrons(TEST_PLAYER_ID, -10)).toBe(false);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(0);
    });

    it('should accumulate multiple additions', () => {
      addElectrons(TEST_PLAYER_ID, 30);
      addElectrons(TEST_PLAYER_ID, 20);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(50);
    });
  });

  describe('removeElectrons', () => {
    beforeEach(() => {
      initializePlayerBalance(TEST_PLAYER_ID, 100);
    });

    it('should remove electrons successfully', () => {
      expect(removeElectrons(TEST_PLAYER_ID, 50)).toBe(true);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(50);
    });

    it('should reject negative amounts', () => {
      expect(removeElectrons(TEST_PLAYER_ID, -10)).toBe(false);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(100);
    });

    it('should reject insufficient balance', () => {
      expect(removeElectrons(TEST_PLAYER_ID, 150)).toBe(false);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(100);
    });

    it('should handle exact balance removal', () => {
      expect(removeElectrons(TEST_PLAYER_ID, 100)).toBe(true);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(0);
    });
  });

  describe('initializePlayerBalance', () => {
    it('should set initial balance', () => {
      initializePlayerBalance(TEST_PLAYER_ID, 100);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(100);
    });

    it('should default to 0 without initial balance', () => {
      initializePlayerBalance(TEST_PLAYER_ID);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(0);
    });

    it('should prevent negative initial balance', () => {
      initializePlayerBalance(TEST_PLAYER_ID, -50);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(0);
    });

    it('should reset existing balance', () => {
      initializePlayerBalance(TEST_PLAYER_ID, 100);
      initializePlayerBalance(TEST_PLAYER_ID, 50);
      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(50);
    });
  });

  describe('player isolation', () => {
    it('should maintain separate balances for different players', () => {
      initializePlayerBalance(TEST_PLAYER_ID, 100);
      initializePlayerBalance(OTHER_PLAYER_ID, 50);

      addElectrons(TEST_PLAYER_ID, 50);
      removeElectrons(OTHER_PLAYER_ID, 20);

      expect(getElectronBalance(TEST_PLAYER_ID)).toBe(150);
      expect(getElectronBalance(OTHER_PLAYER_ID)).toBe(30);
    });
  });
});
