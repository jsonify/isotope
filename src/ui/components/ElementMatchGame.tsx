/***********************************************
 * FILE: src/ui/components/ElementMatchGame.tsx
 * CREATED: 2025-03-24 16:22:52
 *
 * PURPOSE:
 * Main component for the Element Match game that displays
 * the game interface and handles score updates.
 ************************************************/

import React, { useContext, useEffect, useState, useCallback } from 'react';

import { PlayerContext } from '../context/PlayerContext.context';

export const ElementMatchGame: React.FC = () => {
  const { profileService } = useContext(PlayerContext);
  const [score, setScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadScore = async (): Promise<void> => {
      try {
        const currentScore = await profileService.getCurrentAWScore();
        setScore(currentScore);
      } catch (error: unknown) {
        console.error('Failed to load score:', error);
        setError('Failed to load score');
      } finally {
        setIsLoading(false);
      }
    };
    loadScore();
  }, [profileService]);

  const handleNextRound = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const newScore = await profileService.updateAWScore(10);
      setScore(newScore);
      setError(null);
    } catch (error: unknown) {
      console.error('Failed to update score:', error);
      setError('Failed to update score');
    } finally {
      setIsLoading(false);
    }
  }, [profileService]);

  if (error) {
    return <div role="alert">{error}</div>;
  }

  if (isLoading) {
    return <div aria-busy="true">Loading...</div>;
  }

  return (
    <div data-testid="element-match-game">
      <h2 data-testid="game-title">Element Match</h2>
      <div data-testid="score-display">Score: {score}</div>
      <button onClick={handleNextRound} disabled={isLoading}>
        Next Round
      </button>
    </div>
  );
};
