import { vi } from 'vitest';

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

// Mock console.error to keep test output clean
console.error = vi.fn();

export const setupTest = (): void => {
  localStorageMock.clear();
  vi.clearAllMocks();
};
