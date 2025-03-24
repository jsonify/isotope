/***********************************************
 * FILE: src/ui/components/__tests__/ElementMatchGame.test.tsx
 * CREATED: 2025-03-23 18:35:58
 *
 * PURPOSE:
 * Test suite for the ElementMatchGame component, verifying
 * rendering, interaction, and integration with game services
 *
 * TESTS:
 * - Component rendering
 * - Element generation
 * - Score updates
 * - User interactions
 *****************/

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { PlayerProfileService } from '../../../domains/player/services/PlayerProfileService';
import * as GameService from '../../../domains/puzzle/services/ElementMatchGame';
import { ElementMatchGame } from '../ElementMatchGame';

// Mock the game service functions
vi.mock('../../../domains/puzzle/services/ElementMatchGame', () => ({
  generateElements: vi.fn(),
  isMatch: vi.fn(),
  calculateScore: vi.fn(),
}));

describe('ElementMatchGame Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementations
    (GameService.generateElements as jest.Mock).mockReturnValue([
      { atomicNumber: 1 },
      { atomicNumber: 2 },
    ]);
    (GameService.isMatch as jest.Mock).mockReturnValue(false);
    (GameService.calculateScore as jest.Mock).mockReturnValue(0);
  });

  it('renders the game interface', () => {
    render(<ElementMatchGame />);

    expect(screen.getByText('Element Match')).toBeInTheDocument();
    expect(screen.getByText('Element 1')).toBeInTheDocument();
    expect(screen.getByText('Element 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next Round' })).toBeInTheDocument();
  });

  it('starts a new round when mounted', () => {
    render(<ElementMatchGame />);

    expect(GameService.generateElements).toHaveBeenCalledTimes(1);
  });

  it('starts a new round when Next Round button is clicked', () => {
    render(<ElementMatchGame />);

    const button = screen.getByRole('button', { name: 'Next Round' });
    fireEvent.click(button);

    expect(GameService.generateElements).toHaveBeenCalledTimes(2); // Once on mount, once on click
  });

  it('updates player score when elements match', async () => {
    // Mock a matching pair
    (GameService.generateElements as jest.Mock).mockReturnValue([
      { atomicNumber: 1 },
      { atomicNumber: 1 },
    ]);
    (GameService.isMatch as jest.Mock).mockReturnValue(true);
    (GameService.calculateScore as jest.Mock).mockReturnValue(10);

    const mockUpdateScore = vi.fn().mockResolvedValue(10);
    vi.spyOn(PlayerProfileService.prototype, 'updateAWScore').mockImplementation(mockUpdateScore);

    render(<ElementMatchGame />);

    // Should update score on initial mount with matching elements
    expect(mockUpdateScore).toHaveBeenCalledWith(10);
  });
});
