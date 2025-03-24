/***********************************************
 * FILE: src/ui/components/__tests__/GameModeSelection.test.tsx
 * CREATED: 2025-03-23 20:11:35
 *
 * PURPOSE:
 * Test suite for the GameModeSelection component
 *
 * TESTS:
 * - Rendering of game modes
 * - Game mode descriptions
 * - Selection behavior
 * - Disabled state handling
 *****************/

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { GameModeSelection } from '../GameModeSelection';

describe('GameModeSelection', () => {
  it('renders all game modes', () => {
    render(<GameModeSelection />);

    expect(screen.getByText('Element Match')).toBeInTheDocument();
    expect(screen.getByText('More Games Coming Soon')).toBeInTheDocument();
  });

  it('displays game mode descriptions', () => {
    render(<GameModeSelection />);

    expect(screen.getByText('Match elements to earn AW points')).toBeInTheDocument();
    expect(screen.getByText('Stay tuned for more game modes')).toBeInTheDocument();
  });

  it('handles game mode selection', () => {
    const mockSelect = vi.fn();
    render(<GameModeSelection onSelect={mockSelect} />);

    const elementMatch = screen.getByText('Element Match').closest('div');
    fireEvent.click(elementMatch!);

    expect(mockSelect).toHaveBeenCalledWith('element-match');
  });

  it('disables unavailable game modes', () => {
    const mockSelect = vi.fn();
    render(<GameModeSelection onSelect={mockSelect} />);

    const comingSoon = screen.getByText('More Games Coming Soon').closest('div');
    fireEvent.click(comingSoon!);

    expect(mockSelect).not.toHaveBeenCalled();
    expect(comingSoon).toHaveClass('cursor-not-allowed');
  });

  it('shows visual indication for disabled game modes', () => {
    render(<GameModeSelection />);

    const comingSoon = screen.getByText('More Games Coming Soon').closest('div');
    expect(comingSoon).toHaveClass('bg-gray-100');
  });
});
