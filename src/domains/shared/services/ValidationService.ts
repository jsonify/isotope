// src/domains/shared/services/ValidationService.ts

import type {
  PlayerProfile,
  PersistedPlayerProfile,
  ValidationResult,
  ElementSymbol,
  GameMode,
} from '../models/domain-models';
import { CURRENT_PROFILE_VERSION } from '../models/domain-models';

/**
 * Service for validating player profile data structure
 */
export class ValidationService {
  private static instance: ValidationService;

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService();
    }
    return ValidationService.instance;
  }

  private validateProfileStructure(profile: unknown): ValidationResult {
    // Type guard check
    if (!this.isPlayerProfileLike(profile)) {
      return {
        isValid: false,
        errors: ['Invalid player profile structure'],
      };
    }

    return { isValid: true, errors: [] };
  }

  /**
   * Validates a player profile's data structure
   */
  public validatePlayerProfile(profile: unknown): ValidationResult {
    const errors: string[] = [];
    const structureValidation = this.validateProfileStructure(profile);
    if (!structureValidation.isValid) return structureValidation;

    // Required fields validation
    for (const field of this.getRequiredPlayerProfileFields()) {
      if (
        (profile as PlayerProfile)[field] === undefined ||
        (profile as PlayerProfile)[field] === null
      ) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    errors.push(...this.validateProfileFields(profile as PlayerProfile));

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates and upgrades a persisted profile to the current version
   */
  public validatePersistedProfile(
    profile: unknown
  ): ValidationResult & { profile?: PersistedPlayerProfile } {
    // Basic profile validation first
    const baseValidation = this.validatePlayerProfile(profile);
    if (!baseValidation.isValid) {
      return baseValidation;
    }

    // Type guard for persisted profile
    if (!this.isPersistedProfile(profile)) {
      return {
        isValid: false,
        errors: ['Missing persistence metadata'],
      };
    }

    // Version check and upgrade if needed
    if (profile.schemaVersion < CURRENT_PROFILE_VERSION) {
      return {
        isValid: false,
        errors: [`Profile schema version ${profile.schemaVersion} needs upgrade`],
      };
    }

    return {
      isValid: true,
      errors: [],
      profile: profile as PersistedPlayerProfile,
    };
  }

  private validateProfileFields(profile: PlayerProfile): string[] {
    const errors: string[] = [];
    const validations: Array<[boolean, string]> = [
      [!this.isValidId(profile.id), 'Invalid profile ID format'],
      [!this.isValidPlayerLevel(profile.level), 'Invalid player level structure'],
      [!this.isValidElementSymbol(profile.currentElement), 'Invalid current element'],
      [!this.isValidGameModeArray(profile.unlockedGames), 'Invalid unlocked games array'],
      [!this.isValidAchievementArray(profile.achievements), 'Invalid achievements array'],
      [typeof profile.electrons !== 'number', 'Invalid electrons value'],
    ];

    validations.forEach(([isInvalid, message]) => {
      if (isInvalid) errors.push(message);
    });

    errors.push(...this.validateDates(profile));
    return errors;
  }

  private validateDates(profile: PlayerProfile): string[] {
    const errors: string[] = [];
    const dateFields: Array<[Date, string]> = [
      [profile.lastLogin, 'lastLogin'],
      [profile.createdAt, 'createdAt'],
      [profile.updatedAt, 'updatedAt'],
    ];

    dateFields.forEach(([date, fieldName]) => {
      if (!this.isValidDate(date)) {
        errors.push(`Invalid ${fieldName} date`);
      }
    });

    return errors;
  }

  private getRequiredPlayerProfileFields(): Array<keyof PlayerProfile> {
    return [
      'id',
      'displayName',
      'level',
      'currentElement',
      'electrons',
      'unlockedGames',
      'achievements',
      'lastLogin',
      'tutorialCompleted',
      'createdAt',
      'updatedAt',
    ];
  }

  private isLevelField(obj: unknown, field: keyof PlayerProfile['level']): boolean {
    if (typeof obj !== 'object' || obj === null || !(field in obj)) return false;
    const value = (obj as Record<string, unknown>)[field];
    return typeof value === 'number' && (value as number) >= 0;
  }

  private isValidPlayerLevel(level: unknown): boolean {
    const requiredFields: Array<keyof PlayerProfile['level']> = [
      'atomicNumber',
      'atomicWeight',
      'gameLab',
    ];

    return requiredFields.every(field => this.isLevelField(level, field));
  }

  private isPlayerProfileLike(data: unknown): data is PlayerProfile {
    if (typeof data !== 'object' || data === null) return false;

    const requiredFields = this.getRequiredPlayerProfileFields();
    return requiredFields.every(field => field in data);
  }

  private isPersistedProfile(data: unknown): data is PersistedPlayerProfile {
    return (
      this.isPlayerProfileLike(data) &&
      'schemaVersion' in data &&
      typeof data.schemaVersion === 'number' &&
      'validation' in data &&
      typeof data.validation === 'object' &&
      data.validation !== null &&
      'lastValidated' in data.validation
    );
  }

  private isValidId(id: unknown): boolean {
    return typeof id === 'string' && id.length > 0;
  }

  private isValidElementSymbol(symbol: unknown): symbol is ElementSymbol {
    return typeof symbol === 'string' && /^[A-Z][a-z]?$/.test(symbol);
  }

  private isValidGameModeArray(modes: unknown): modes is GameMode[] {
    return (
      Array.isArray(modes) &&
      modes.every(mode => typeof mode === 'number' && mode >= 0 && mode <= 9)
    );
  }

  private isValidAchievementArray(achievements: unknown): boolean {
    return (
      Array.isArray(achievements) &&
      achievements.every(
        achievement =>
          typeof achievement === 'object' &&
          achievement !== null &&
          'id' in achievement &&
          'name' in achievement &&
          'dateUnlocked' in achievement
      )
    );
  }

  private isValidDate(date: unknown): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }
}
