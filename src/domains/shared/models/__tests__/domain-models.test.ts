// src/domains/shared/models/__tests__/domain-models.test.ts

import { describe, it, expect } from 'vitest';

import type { PlayerLevel } from '@/domains/shared/models/domain-models';

import { ELEMENTS_DATA, PROGRESSION_THRESHOLDS } from '../../constants/game-constants';
import { GameMode, ElectronSource } from '../domain-models';

describe('Domain Models', () => {
  it('should have correctly defined GameMode enum', () => {
    expect(GameMode.TUTORIAL).toBe(0);
    expect(GameMode.ELEMENT_MATCH).toBe(1);
    expect(GameMode[0]).toBe('TUTORIAL');
  });

  it('should have correctly defined ElectronSource enum', () => {
    expect(ElectronSource.TUTORIAL_COMPLETION).toBe('tutorial');
    expect(ElectronSource.PUZZLE_COMPLETION).toBe('puzzle');
  });

  it('should have valid element data', () => {
    // Check first element
    expect(ELEMENTS_DATA[0].symbol).toBe('H');
    expect(ELEMENTS_DATA[0].atomicNumber).toBe(1);

    // Verify all elements have required properties
    ELEMENTS_DATA.forEach(element => {
      expect(element).toHaveProperty('symbol');
      expect(element).toHaveProperty('name');
      expect(element).toHaveProperty('atomicNumber');
      expect(element).toHaveProperty('atomicWeight');
      expect(element).toHaveProperty('period');
      expect(element).toHaveProperty('group');
    });

    // Verify atomic numbers are sequential
    for (let i = 0; i < ELEMENTS_DATA.length - 1; i++) {
      expect(ELEMENTS_DATA[i + 1].atomicNumber - ELEMENTS_DATA[i].atomicNumber).toBe(1);
    }
  });

  it('should have valid progression thresholds', () => {
    // Verify first threshold
    expect(PROGRESSION_THRESHOLDS[0].fromElement).toBe('H');
    expect(PROGRESSION_THRESHOLDS[0].toElement).toBe('He');

    // Verify all thresholds have required properties
    PROGRESSION_THRESHOLDS.forEach(threshold => {
      expect(threshold).toHaveProperty('fromElement');
      expect(threshold).toHaveProperty('toElement');
      expect(threshold).toHaveProperty('puzzlesRequired');
      // Verify elements exist in ELEMENTS_DATA
      expect(ELEMENTS_DATA.some(e => e.symbol === threshold.fromElement)).toBe(true);
      expect(ELEMENTS_DATA.some(e => e.symbol === threshold.toElement)).toBe(true);
    });
  });
});

describe('PlayerLevel Interface', () => {
  it('should create a valid PlayerLevel object', () => {
    const playerLevel: PlayerLevel = {
      atomicNumber: 1,
      atomicWeight: 3,
      gameLab: 0,
    };

    expect(playerLevel.atomicNumber).toBe(1);
    expect(playerLevel.atomicWeight).toBe(3);
    expect(playerLevel.gameLab).toBe(0);
  });
});
