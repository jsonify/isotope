// Add this to your existing setup.ts file

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

// This helps identify any unhandled promises that might cause hanging
if (typeof process !== 'undefined') {
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit the process to allow tests to continue
  });
}

// Register a cleanup function to run after all tests
afterAll(() => {
  // Clear any timers that might be hanging
  vi.clearAllTimers();

  // Allow a small delay for any cleanup operations
  return new Promise(resolve => setTimeout(resolve, 100));
});
