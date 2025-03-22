/***********************************************
 * FILE: src/ui/components/__tests__/GameModeSelection.test.tsx
 * CREATED: 2025-03-22 06:57:01
 *
 * PURPOSE:
 * Test suite for the GameModeSelection component which handles
 * the interface for selecting different game modes.
 *
 * TESTS:
 * - Renders available game modes
 * - Handles game mode selection
 * - Shows game mode descriptions
 * - Validates disabled states
 *****************/

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import GameModeSelection from '../GameModeSelection';

describe('GameModeSelection', () => {
  const mockGameModes = [
    {
      id: 'element-match',
      name: 'Element Match',
      description: 'Match elements to earn AW points',
      disabled: false,
    },
    {
      id: 'atomic-puzzle',
      name: 'Atomic Puzzle',
      description: 'Solve atomic puzzles',
      disabled: true,
    },
  ];

  const mockOnSelect = vi.fn();

  it('renders all game modes', () => {
    render(<GameModeSelection gameModes={mockGameModes} onSelect={mockOnSelect} />);

    expect(screen.getByText('Element Match')).toBeInTheDocument();
    expect(screen.getByText('Atomic Puzzle')).toBeInTheDocument();
  });

  it('displays game mode descriptions', () => {
    render(<GameModeSelection gameModes={mockGameModes} onSelect={mockOnSelect} />);

    expect(screen.getByText('Match elements to earn AW points')).toBeInTheDocument();
    expect(screen.getByText('Solve atomic puzzles')).toBeInTheDocument();
  });

  it('calls onSelect when clicking an enabled game mode', () => {
    render(<GameModeSelection gameModes={mockGameModes} onSelect={mockOnSelect} />);

    fireEvent.click(screen.getByText('Element Match'));
    expect(mockOnSelect).toHaveBeenCalledWith('element-match');
  });

  it('disables selection of locked game modes', () => {
    render(<GameModeSelection gameModes={mockGameModes} onSelect={mockOnSelect} />);

    fireEvent.click(screen.getByText('Atomic Puzzle'));
    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('shows visual indication for disabled game modes', () => {
    render(<GameModeSelection gameModes={mockGameModes} onSelect={mockOnSelect} />);

    const disabledMode = screen.getByText('Atomic Puzzle').closest('button');
    expect(disabledMode).toHaveAttribute('disabled');
    expect(disabledMode).toHaveClass('opacity-50');
  });
});
