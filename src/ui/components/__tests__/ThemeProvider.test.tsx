import { render, screen } from '@testing-library/react';
import { JSDOM } from 'jsdom'; // Import JSDOM
import { useTheme as useNextTheme } from 'next-themes'; // Renamed import
import { vi } from 'vitest'; // Import vi

import { ThemeProvider } from '../ThemeProvider';

describe('ThemeProvider Component', () => {
  beforeAll(() => {
    const dom = new JSDOM('<!doctype html><html><body></body></html>', {
      pretendToBeVisual: true,
      runScripts: 'dangerously',
      resources: 'usable',
    });

    // Using Partial<Window> to acknowledge this is a mock window implementation
    // Cast to Window & typeof globalThis to satisfy TypeScript's type requirements
    const mockWindow = dom.window as unknown as Window & typeof globalThis;
    global.window = mockWindow;
    global.document = mockWindow.document;
    global.navigator = mockWindow.navigator;

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('should render children', () => {
    render(
      <ThemeProvider>
        <div>ThemeProvider Children</div>
      </ThemeProvider>
    );
    expect(screen.getByText('ThemeProvider Children')).toBeInTheDocument();
  });

  it('should provide theme context', () => {
    const TestComponent = (): JSX.Element => {
      const { theme } = useNextTheme(); // Use renamed hook
      return <div data-testid="theme">{theme}</div>;
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme')).toBeInTheDocument();
  });
});
