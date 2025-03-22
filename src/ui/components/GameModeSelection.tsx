/***********************************************
 * FILE: src/ui/components/GameModeSelection.tsx
 * CREATED: 2025-03-22 12:41:20
 *
 * PURPOSE:
 * Component that displays and handles the selection of different game modes.
 * Shows available modes, their descriptions, and handles selection while
 * respecting disabled states.
 *
 * METHODS:
 * - GameModeSelection: Main component that renders the game mode interface
 * - createClickHandler: Creates a memoized handler for mode selection
 *****************/

import type { FC } from 'react';
import { useCallback } from 'react';

interface GameMode {
  id: string;
  name: string;
  description: string;
  disabled: boolean;
}

interface GameModeSelectionProps {
  gameModes: GameMode[];
  onSelect: (modeId: string) => void;
}

const GameModeSelection: FC<GameModeSelectionProps> = ({ gameModes, onSelect }) => {
  const createClickHandler = useCallback(
    (id: string, disabled: boolean): (() => void) => {
      return (): void => {
        if (!disabled) {
          onSelect(id);
        }
      };
    },
    [onSelect]
  );

  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {gameModes.map(mode => (
        <button
          key={mode.id}
          onClick={createClickHandler(mode.id, mode.disabled)}
          disabled={mode.disabled}
          className={`
            flex flex-col items-start p-4 rounded-lg border
            transition-all duration-200
            ${
              mode.disabled
                ? 'opacity-50 cursor-not-allowed bg-gray-100'
                : 'hover:border-blue-500 hover:shadow-md bg-white'
            }
          `}
        >
          <h3 className="text-lg font-semibold mb-2">{mode.name}</h3>
          <p className="text-sm text-gray-600">{mode.description}</p>
        </button>
      ))}
    </div>
  );
};

export default GameModeSelection;
