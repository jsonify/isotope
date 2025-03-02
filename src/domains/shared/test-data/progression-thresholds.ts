// src/domains/shared/test-data/progression-thresholds.ts
import type { ProgressThreshold } from '../models/domain-models';

/**
 * Test progression thresholds
 * These define the requirements to progress from one element to the next
 */
export const TEST_PROGRESSION_THRESHOLDS: ProgressThreshold[] = [
  {
    fromElement: 'H',
    toElement: 'He',
    puzzlesRequired: 4,
    unlocksFeature: 'Basic element properties',
  },
  {
    fromElement: 'He',
    toElement: 'Li',
    puzzlesRequired: 6,
    unlocksFeature: 'Period 2 elements',
  },
  {
    fromElement: 'Li',
    toElement: 'Be',
    puzzlesRequired: 8,
  },
  {
    fromElement: 'Be',
    toElement: 'B',
    puzzlesRequired: 10,
  },
  {
    fromElement: 'B',
    toElement: 'C',
    puzzlesRequired: 12,
  },
  {
    fromElement: 'C',
    toElement: 'N',
    puzzlesRequired: 14,
  },
  {
    fromElement: 'N',
    toElement: 'O',
    puzzlesRequired: 16,
  },
  {
    fromElement: 'O',
    toElement: 'F',
    puzzlesRequired: 18,
  },
  {
    fromElement: 'F',
    toElement: 'Ne',
    puzzlesRequired: 20,
    unlocksFeature: 'Electron shells visualization',
  },
  {
    fromElement: 'Ne',
    toElement: 'Na',
    puzzlesRequired: 22,
    unlocksFeature: 'Period 3 elements',
  },
  {
    fromElement: 'Na',
    toElement: 'Mg',
    puzzlesRequired: 24,
  },
  {
    fromElement: 'Mg',
    toElement: 'Al',
    puzzlesRequired: 26,
  },
  {
    fromElement: 'Al',
    toElement: 'Si',
    puzzlesRequired: 28,
  },
  {
    fromElement: 'Si',
    toElement: 'P',
    puzzlesRequired: 30,
  },
  {
    fromElement: 'P',
    toElement: 'S',
    puzzlesRequired: 32,
  },
  {
    fromElement: 'S',
    toElement: 'Cl',
    puzzlesRequired: 34,
  },
  {
    fromElement: 'Cl',
    toElement: 'Ar',
    puzzlesRequired: 36,
    unlocksFeature: 'Compound building',
  },
  {
    fromElement: 'Ar',
    toElement: 'K',
    puzzlesRequired: 38,
    unlocksFeature: 'Period 4 elements',
  },
  {
    fromElement: 'K',
    toElement: 'Ca',
    puzzlesRequired: 40,
  },
];

/**
 * Get the threshold for transitioning from one element to another
 */
export const getProgressionThreshold = (
  fromElement: string,
  toElement: string
): ProgressThreshold | undefined => {
  return TEST_PROGRESSION_THRESHOLDS.find(
    threshold => threshold.fromElement === fromElement && threshold.toElement === toElement
  );
};

/**
 * Get the next element threshold based on current element
 */
export const getNextElementThreshold = (currentElement: string): ProgressThreshold | undefined => {
  return TEST_PROGRESSION_THRESHOLDS.find(threshold => threshold.fromElement === currentElement);
};

export default TEST_PROGRESSION_THRESHOLDS;
