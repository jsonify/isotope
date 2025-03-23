/***********************************************
 * FILE: src/ui/components/__tests__/PlayerProfileDisplay.test.tsx
 * CREATED: 2025-03-22 14:02:07
 *
 * PURPOSE:
 * Test suite for the PlayerProfileDisplay component that shows player's
 * AN (Atomic Number), AW (Atomic Weight), and GL (Gameplay Level).
 *
 * TEST CASES:
 * - Renders with valid props
 * - Handles missing props gracefully
 * - Displays correct labels and formatting
 *****************/

import { render, screen } from '@testing-library/react';

import { PlayerProfileDisplay } from '../PlayerProfileDisplay';

describe('PlayerProfileDisplay', () => {
  it('renders with all props provided', () => {
    render(<PlayerProfileDisplay an={5} aw={10.5} gl={3} />);

    expect(screen.getByTestId('an-value')).toHaveTextContent('5');
    expect(screen.getByTestId('aw-value')).toHaveTextContent('10.5');
    expect(screen.getByTestId('gl-value')).toHaveTextContent('3');
  });

  it('handles missing props with default values', () => {
    render(<PlayerProfileDisplay />);

    expect(screen.getByTestId('an-value')).toHaveTextContent('0');
    expect(screen.getByTestId('aw-value')).toHaveTextContent('0');
    expect(screen.getByTestId('gl-value')).toHaveTextContent('0');
  });

  it('handles partial props', () => {
    render(<PlayerProfileDisplay an={5} />);

    expect(screen.getByTestId('an-value')).toHaveTextContent('5');
    expect(screen.getByTestId('aw-value')).toHaveTextContent('0');
    expect(screen.getByTestId('gl-value')).toHaveTextContent('0');
  });
});
