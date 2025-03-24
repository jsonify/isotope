/***********************************************
 * FILE: src/ui/components/GameModeSelection.tsx
 * CREATED: 2025-03-23 20:12:11
 *
 * PURPOSE:
 * Component for selecting different game modes, showing
 * available and locked modes with visual indicators.
 *
 * PROPS:
 * - onSelect: Callback when a game mode is selected
 *****************/

interface GameModeSelectionProps {
  onSelect?: (modeId: string) => void;
}

interface GameMode {
  id: string;
  name: string;
  description: string;
  available: boolean;
}

const gameModes: GameMode[] = [
  {
    id: 'element-match',
    name: 'Element Match',
    description: 'Match elements to earn AW points',
    available: true,
  },
  {
    id: 'coming-soon',
    name: 'More Games Coming Soon',
    description: 'Stay tuned for more game modes',
    available: false,
  },
];

function createModeHandler(mode: GameMode, onSelect?: (modeId: string) => void): () => void {
  return function handleMode(): void {
    if (mode.available && onSelect) {
      onSelect(mode.id);
    }
  };
}

export function GameModeSelection({ onSelect }: GameModeSelectionProps): JSX.Element {
  return (
    <div className="p-4 border rounded shadow-sm">
      <h2 className="text-xl font-bold mb-4">Game Modes</h2>
      <div className="space-y-4">
        {gameModes.map(mode => {
          const handleClick = createModeHandler(mode, onSelect);
          return (
            <div
              key={mode.id}
              onClick={handleClick}
              className={`p-4 border rounded ${
                mode.available
                  ? 'bg-white hover:bg-gray-50 cursor-pointer'
                  : 'bg-gray-100 cursor-not-allowed'
              }`}
            >
              <h3 className="font-bold">{mode.name}</h3>
              <p className="text-sm text-gray-600">{mode.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
