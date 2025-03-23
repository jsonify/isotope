/***********************************************
 * FILE: App.tsx
 * CREATED: 2025-03-21 22:24:04
 *
 * PURPOSE:
 * Main application entry point that renders the game components
 *****************/

import { PeriodicTableDemo } from './ui/components/demo/PeriodicTableDemo';
import { PlayerProfileDisplay } from './ui/components/PlayerProfileDisplay';
import { ThemeProvider } from './ui/components/ThemeProvider';

function App(): JSX.Element {
  // Example values - these would typically come from your game state
  const playerStats = {
    an: 5,
    aw: 10.5,
    gl: 3,
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-950">
        {/* Header section with PlayerProfileDisplay */}
        <header className="fixed top-0 left-0 right-0 bg-gray-900 shadow-lg z-50">
          <div className="container mx-auto p-4">
            <PlayerProfileDisplay an={playerStats.an} aw={playerStats.aw} gl={playerStats.gl} />
          </div>
        </header>

        {/* Main content with padding-top to account for fixed header */}
        <main className="pt-32 text-gray-100">
          <PeriodicTableDemo />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
