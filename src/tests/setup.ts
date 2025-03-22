import '@testing-library/jest-dom';
import { afterEach, afterAll, expect, vi } from 'vitest';

// Set up browser globals for test environment
if (typeof window === 'undefined') {
  global.window = {
    ...global.window, // Preserve existing window properties if any
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
      // Mock localStorage
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    },
  } as unknown as Window & typeof globalThis;

  global.document = {
    ...global.document, // Preserve existing document properties if any
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
    ...global.navigator, // Preserve existing navigator properties
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

// Make jest's spyOn available globally (for compatibility with existing tests)
Object.assign(globalThis, {
  jest: {
    spyOn: vi.spyOn,
  },
});

// Add a final cleanup function that runs after all tests
afterAll(() => {
  // Clear any timers that might be hanging
  vi.clearAllTimers();
  vi.useRealTimers();

  // We don't use process.exit here as it would break when running tests locally
  // The CI will use the exit-handler.js script to handle forced exit
}, 5000);
