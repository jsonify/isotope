/***********************************************
 * FILE: App.tsx
 * CREATED: 2025-03-21 22:24:04
 *
 * PURPOSE:
 * Main application entry point that renders the PeriodicTableDemo
 *****************/

import { PeriodicTableDemo } from './ui/components/demo/PeriodicTableDemo';
import { ThemeProvider } from './ui/components/ThemeProvider';

function App(): JSX.Element {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <PeriodicTableDemo />
      </div>
    </ThemeProvider>
  );
}

export default App;
