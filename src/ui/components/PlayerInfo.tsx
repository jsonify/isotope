// src/ui/components/PlayerInfo.tsx
import type { FC } from 'react';
import React, { useCallback } from 'react';

import { usePlayer } from '../hooks/usePlayer';

interface PlayerInfoProps {
  children?: React.ReactNode;
}

export const PlayerInfo: FC<PlayerInfoProps> = ({ children }): JSX.Element => {
  const { profile, updateProfile, resetProfile, isLoading } = usePlayer();

  const handleAddElectrons = useCallback((): void => {
    updateProfile({ electrons: profile.electrons + 5 });
  }, [profile.electrons, updateProfile]);

  const handleResetProfile = useCallback((): void => {
    resetProfile();
  }, [resetProfile]);

  if (isLoading) {
    return <div className="text-center">Loading player data...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-4">
      <h2 className="text-xl font-bold mb-2">Player Profile</h2>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <strong>Name:</strong> {profile.displayName}
        </div>
        <div>
          <strong>Element:</strong> {profile.currentElement}
        </div>
        <div>
          <strong>Electrons:</strong> {profile.electrons}
        </div>
        <div>
          <strong>Atomic Number:</strong>{' '}
          <span id="player-info-an">{profile.level.atomicNumber}</span>
        </div>
        <div>
          <strong>Atomic Weight:</strong>{' '}
          <span id="player-info-aw">{profile.level.atomicWeight}</span>
        </div>
        <div>
          <strong>Game Lab:</strong> <span id="player-info-gl">{profile.level.gameLab}</span>
        </div>
        <div>
          <strong>Tutorial Completed:</strong> {profile.tutorialCompleted ? 'Yes' : 'No'}
        </div>
      </div>
      {children} {/* Render children here */}
      <div className="flex space-x-4">
        <button onClick={handleAddElectrons} className="btn-primary">
          Add 5 Electrons
        </button>
        <button onClick={handleResetProfile} className="btn-outline">
          Reset Profile
        </button>
      </div>
    </div>
  );
};
