// src/domains/shared/services/__tests__/ValidationService.test.ts

import { describe, it, expect, beforeEach } from 'vitest';

import type {
  PlayerProfile,
  PersistedPlayerProfile,
  ElementSymbol,
} from '../../models/domain-models';
import { GameMode, CURRENT_PROFILE_VERSION } from '../../models/domain-models';
import { ValidationService } from '../ValidationService';

describe('ValidationService', () => {
  let validationService: ValidationService;
  let mockValidProfile: PlayerProfile;
  let mockPersistedProfile: PersistedPlayerProfile;

  beforeEach(() => {
    validationService = ValidationService.getInstance();

    // Set up a valid player profile for testing
    mockValidProfile = {
      id: '123',
      displayName: 'Test Player',
      level: {
        atomicNumber: 1,
        atomicWeight: 10,
        gameLab: 1,
      },
      currentElement: 'H',
      electrons: 100,
      unlockedGames: [GameMode.TUTORIAL],
      achievements: [],
      lastLogin: new Date(),
      tutorialCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Set up a valid persisted profile
    mockPersistedProfile = {
      ...mockValidProfile,
      schemaVersion: CURRENT_PROFILE_VERSION,
      validation: {
        lastValidated: new Date(),
      },
    };
  });

  describe('validatePlayerProfile', () => {
    it('should return valid for a correct player profile', () => {
      const result = validationService.validatePlayerProfile(mockValidProfile);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should catch missing required fields', () => {
      const invalidProfile = { ...mockValidProfile };
      delete (invalidProfile as Partial<PlayerProfile>).displayName;

      const result = validationService.validatePlayerProfile(invalidProfile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required field: displayName');
    });

    it('should validate player level structure', () => {
      const invalidProfile = {
        ...mockValidProfile,
        level: {
          atomicNumber: -1, // Invalid negative number
          atomicWeight: 10,
          gameLab: 1,
        },
      };

      const result = validationService.validatePlayerProfile(invalidProfile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid player level structure');
    });

    it('should validate element symbol format', () => {
      const invalidProfile = {
        ...mockValidProfile,
        currentElement: 'Invalid' as ElementSymbol,
      };

      const result = validationService.validatePlayerProfile(invalidProfile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid current element');
    });

    it('should validate game modes array', () => {
      const invalidProfile = {
        ...mockValidProfile,
        unlockedGames: [999], // Invalid game mode
      };

      const result = validationService.validatePlayerProfile(invalidProfile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid unlocked games array');
    });
  });

  describe('validatePersistedProfile', () => {
    it('should return valid for a correct persisted profile', () => {
      const result = validationService.validatePersistedProfile(mockPersistedProfile);
      expect(result.isValid).toBe(true);
      expect(result.profile).toBeDefined();
    });

    it('should catch missing schema version', () => {
      const invalidProfile = { ...mockPersistedProfile };
      delete (invalidProfile as Partial<PersistedPlayerProfile>).schemaVersion;

      const result = validationService.validatePersistedProfile(invalidProfile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing persistence metadata');
    });

    it('should catch outdated schema version', () => {
      const outdatedProfile = {
        ...mockPersistedProfile,
        schemaVersion: CURRENT_PROFILE_VERSION - 1,
      };

      const result = validationService.validatePersistedProfile(outdatedProfile);
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('needs upgrade');
    });

    it('should validate base profile fields for persisted profiles', () => {
      const invalidProfile = {
        ...mockPersistedProfile,
        displayName: undefined,
      };

      const result = validationService.validatePersistedProfile(invalidProfile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required field: displayName');
    });
  });

  describe('singleton behavior', () => {
    it('should return the same instance', () => {
      const instance1 = ValidationService.getInstance();
      const instance2 = ValidationService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });
});
