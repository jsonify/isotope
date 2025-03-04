import { vi } from 'vitest';

type MockMediaQueryList = {
  matches: boolean;
  media: string;
  onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => void) | null;
  addListener: (callback: (e: MediaQueryListEvent) => void) => void;
  removeListener: (callback: (e: MediaQueryListEvent) => void) => void;
  addEventListener: (type: string, callback: EventListenerOrEventListenerObject) => void;
  removeEventListener: (type: string, callback: EventListenerOrEventListenerObject) => void;
  dispatchEvent: (event: Event) => boolean;
};

const createMatchMediaMock = (): ((query: string) => MockMediaQueryList) =>
  vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

// Create a mock window object for the test environment
const mockWindow = {
  matchMedia: createMatchMediaMock(),
} as unknown as Window & typeof globalThis;

// Define window object for test environment
if (typeof window === 'undefined') {
  (global as unknown as { window: typeof mockWindow }).window = mockWindow;
} else {
  // In browser-like environment, ensure matchMedia is mocked
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: mockWindow.matchMedia,
  });
}

export const setupTestEnv = (): void => {
  // Reset all mocks before each test
  vi.clearAllMocks();

  // Ensure matchMedia mock is reset and available
  if (typeof window !== 'undefined') {
    window.matchMedia = createMatchMediaMock();
  }
};
