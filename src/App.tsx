// src/App.tsx
import type { FC } from 'react';
import { useCallback, useState } from 'react';

import { PlayerInfo } from './ui/components/PlayerInfo';
import { TestTransitions } from './ui/components/TestTransitions';
import { TransitionController } from './ui/components/TransitionController';
import { PlayerProvider } from './ui/context/PlayerContext';
import './App.css';
import './styles/transitions.css';

export const App: FC = (): JSX.Element => {
  const [count, setCount] = useState(0);

  const handleIncrement = useCallback((): void => {
    setCount(prevCount => prevCount + 1);
  }, []);

  return (
    <PlayerProvider>
      <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
        <TransitionController />
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
          <TestTransitions />

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
