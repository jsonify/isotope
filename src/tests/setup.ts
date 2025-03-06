// Add these lines to your existing setup.ts file

import '@testing-library/jest-dom';
import { afterEach, afterAll, expect, vi } from 'vitest';

// Set up browser globals for test environment
if (typeof window === 'undefined') {
  global.window = {} as unknown as Window & typeof globalThis;
  global.document = {
    createElement: vi.fn(),
    querySelector: vi.fn(),
  } as unknown as Document;
  global.navigator = {} as Navigator;
}

// Ensure window has all required properties
Object.assign(global.window, { document: global.document, navigator: global.navigator });

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Set up Vitest globals
Object.assign(globalThis, { expect, vi });

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
  vi.resetAllMocks();
});

// Make jest's spyOn available globally (for compatibility with existing tests)
Object.assign(globalThis, {
  jest: {
    spyOn: vi.spyOn,
  },
});

// Add a final cleanup function that runs after all tests
afterAll(() => {
  vi.clearAllTimers();
  vi.useRealTimers();

  // Force exit after a short delay
  if (typeof process !== 'undefined') {
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  }
});
