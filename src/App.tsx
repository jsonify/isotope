/***********************************************
 * FILE: src/App.tsx
 * CREATED: 2025-03-23 20:10:24
 *
 * PURPOSE:
 * Main application component with game selection and display
 *
 * COMPONENTS:
 * - GameModeSelection: Allows selecting different game modes
 * - ElementMatchGame: Simple element matching game
 * - PlayerProfileDisplay: Shows player progression
 *****************/

import { ElementMatchGame } from './ui/components/ElementMatchGame';
import { GameModeSelection } from './ui/components/GameModeSelection';
import { PlayerProfileDisplay } from './ui/components/PlayerProfileDisplay';

function App(): JSX.Element {
  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center">Isotope</h1>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <PlayerProfileDisplay />
          <GameModeSelection />
        </div>

        <div>
          <ElementMatchGame />
        </div>
      </main>
    </div>
  );
}

export default App;
