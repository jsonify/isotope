import '@testing-library/jest-dom';
import { afterEach, afterAll, expect, vi } from 'vitest';

// Mock PlayerProfileService globally
vi.mock('../domains/player/services/PlayerProfileService', () => ({
  PlayerProfileService: {
    getInstance: vi.fn(() => ({
      getCurrentAWScore: vi.fn(() => 0),
      updateAWScore: vi.fn().mockResolvedValue(0),
      resetProfile: vi.fn().mockResolvedValue(true),
      getProfile: vi.fn().mockResolvedValue({
        awScore: 0,
        level: 1,
        achievements: [],
        unlockedGameModes: ['basic'],
      }),
      updateProfile: vi.fn().mockResolvedValue(true), // Add updateProfile mock
    })),
  },
}));

// Set up browser globals for test environment
if (typeof window === 'undefined') {
  global.window = {
    ...global.window,
    matchMedia: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
    localStorage: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    },
  } as unknown as Window & typeof globalThis;

  global.document = {
    ...global.document,
    createElement: vi.fn(),
    querySelector: vi.fn(),
    body: {
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
      },
    },
  } as unknown as Document;
  global.navigator = {
    ...global.navigator,
  } as Navigator;
}

// Ensure window has all required properties
Object.assign(global.window, { document: global.document, navigator: global.navigator });

// Set up Vitest globals
Object.assign(globalThis, { expect, vi });

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
  vi.resetAllMocks();
});

// Make jest's spyOn available globally
Object.assign(globalThis, {
  jest: {
    spyOn: vi.spyOn,
  },
});

// Add a final cleanup function that runs after all tests
afterAll(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
}, 5000);
