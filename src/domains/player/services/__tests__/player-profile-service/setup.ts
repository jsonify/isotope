import { vi } from 'vitest';

import { setupTestEnv } from '../../../../shared/test-data/setup-test-env';

export interface LocalStorageMock {
  store: { [key: string]: string };
  length: number;
  key: (index: number) => string | null;
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

// Mock localStorage
export const localStorageMock: LocalStorageMock = {
  get length(): number {
    return Object.keys(this.store).length;
  },
  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null;
  },
  store: {} as { [key: string]: string },
  getItem: vi.fn((key: string) => localStorageMock.store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageMock.store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageMock.store[key];
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {};
  }),
};

// Replace global localStorage
global.localStorage = localStorageMock as unknown as Storage;

setupTestEnv(); // Setup shared test environment

// Mock console.error to keep test output clean
console.error = vi.fn();

/**
 * Helper type for mocked Date constructor with all required static methods
 */
type MockDateConstructor = {
  new (...args: (number | string | Date | undefined)[]): Date;
  (...args: (number | string | Date | undefined)[]): string;
  prototype: Date;
  parse(s: string): number;
  UTC(...args: number[]): number;
  now(): number;
};

/**
 * Creates a mock Date that returns a fixed timestamp when called with no arguments
 * while preserving normal Date behavior for other cases.
 *
 * @param fixedDate - The date to return when Date is called with no arguments
 * @returns Cleanup function to restore the original Date
 */
export const mockDateWith = (fixedDate: Date): (() => void) => {
  const RealDate = global.Date;

  function MockDate(this: DateConstructor, value?: string | number | Date): Date {
    // Create a real Date instance with our fixed date
    const date = value === undefined ? new RealDate(fixedDate.getTime()) : new RealDate(value);
    return date;
  }

  // Create type-safe constructor with all required Date static methods
  const TypedMockDate = MockDate as unknown as MockDateConstructor;

  // Copy all necessary Date functionality
  TypedMockDate.prototype = RealDate.prototype;
  TypedMockDate.parse = RealDate.parse;
  TypedMockDate.UTC = RealDate.UTC;
  TypedMockDate.now = (): number => fixedDate.getTime();

  // Apply the mock
  global.Date = TypedMockDate as DateConstructor;

  // Return cleanup function
  return () => {
    global.Date = RealDate;
  };
};

export const setupTest = (): void => {
  localStorageMock.clear();
  vi.clearAllMocks();
};

export const getTestDate = (): Date => {
  return new Date('2024-01-01T12:00:00.000Z');
};
