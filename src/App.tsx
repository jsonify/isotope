import type { FC } from 'react';
import { useCallback, useState } from 'react';

import { PlayerProvider } from './ui/context/PlayerContext';
import { usePlayer } from './ui/hooks/usePlayer';
import './App.css';

// PlayerInfo component to display player data
const PlayerInfo: FC = (): JSX.Element => {
  const { profile, updateProfile, resetProfile, isLoading } = usePlayer();

  // Define all hooks at the top level of the component
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
          <strong>Atomic Number:</strong> {profile.level.atomicNumber}
        </div>
        <div>
          <strong>Atomic Weight:</strong> {profile.level.atomicWeight}
        </div>
        <div>
          <strong>Tutorial Completed:</strong> {profile.tutorialCompleted ? 'Yes' : 'No'}
        </div>
      </div>
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

// Main App component
const App: FC = (): JSX.Element => {
  const [count, setCount] = useState(0);

  const handleIncrement = useCallback((): void => {
    setCount(prevCount => prevCount + 1);
  }, []);

  return (
    <PlayerProvider>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
        <header className="container mx-auto py-8">
          <h1 className="text-4xl font-bold text-center text-primary-700">
            Isotope: React.. Solve.. Evolve..
          </h1>
          <p className="text-center text-lg mt-2 text-gray-600">
            An educational puzzle game using the periodic table
          </p>
        </header>

        <main className="container mx-auto py-8">
          <PlayerInfo />

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-center mb-4">
              Edit <code className="bg-gray-100 px-1 rounded">src/App.tsx</code> and save to test
              HMR
            </p>
            <div className="flex justify-center">
              <button onClick={handleIncrement} className="btn-primary">
                count is {count}
              </button>
            </div>
          </div>
        </main>
      </div>
    </PlayerProvider>
  );
};

export default App;
