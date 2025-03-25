/***********************************************
 * FILE: src/ui/components/__tests__/ElementMatchGame.test.tsx
 * CREATED: 2025-03-24 16:23:35
 *
 * PURPOSE:
 * Test suite for the ElementMatchGame component validating
 * rendering and score display functionality.
 ************************************************/

import React from 'react';

import { screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import '@testing-library/jest-dom';
import { renderWithMockContext } from '../../../tests/utils/testContexts';
import { ElementMatchGame } from '../ElementMatchGame';

describe('ElementMatchGame', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the game component', async () => {
    renderWithMockContext(<ElementMatchGame />);

    await waitFor(() => {
      const gameElement = screen.getByTestId('element-match-game');
      const titleElement = screen.getByTestId('game-title');
      expect(gameElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent('Element Match');
    });
  });

  it('displays current score', async () => {
    const testScore = 100;
    const { mockService } = renderWithMockContext(<ElementMatchGame />, {
      awScore: testScore,
    });

    await waitFor(() => {
      const scoreElement = screen.getByTestId('score-display');
      expect(scoreElement).toHaveTextContent(`Score: ${testScore}`);
      expect(mockService.getCurrentAWScore).toHaveBeenCalled();
    });
  });

  it('updates score when new round starts', async () => {
    const initialScore = 50;
    const updatedScore = 75;

    const { mockService } = renderWithMockContext(<ElementMatchGame />, {
      awScore: initialScore,
    });

    mockService.updateAWScore.mockResolvedValueOnce(updatedScore);

    await waitFor(() => {
      expect(screen.getByTestId('score-display')).toHaveTextContent(`Score: ${initialScore}`);
    });

    const nextRoundButton = screen.getByRole('button', { name: /next round/i });
    fireEvent.click(nextRoundButton);

    await waitFor(() => {
      expect(screen.getByTestId('score-display')).toHaveTextContent(`Score: ${updatedScore}`);
      expect(mockService.updateAWScore).toHaveBeenCalledWith(10);
    });
  });

  it('shows error message when score update fails', async () => {
    const { mockService } = renderWithMockContext(<ElementMatchGame />);
    mockService.updateAWScore.mockRejectedValueOnce(new Error('Update failed'));

    const nextRoundButton = await screen.findByRole('button', { name: /next round/i });
    fireEvent.click(nextRoundButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Failed to update score');
    });
  });
});
