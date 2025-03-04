// src/ui/components/transitions/GameContent.tsx
import type { FC } from 'react';

import { GameMode } from '../../../domains/shared/models/domain-models';
import type {
  GameModeUnlockTransition,
  PeriodCompleteTransition,
} from '../../../domains/shared/models/transition-models';

// Helper function to get the name of a game mode
const getGameModeName = (mode: GameMode): string => {
  const modeName = GameMode[mode];
  return typeof modeName === 'string' ? modeName : `Game Mode ${mode}`;
};

export const GameModeUnlockContent: FC<{ data: GameModeUnlockTransition }> = ({
  data,
}): JSX.Element => (
  <div className="transition-game-mode" role="alert" aria-live="assertive">
    <h2>New Game Mode Unlocked!</h2>
    <div className="game-mode-name">{getGameModeName(data.gameMode)}</div>
    <p>A new way to play and learn has been unlocked!</p>
  </div>
);

export const PeriodCompleteContent: FC<{ data: PeriodCompleteTransition }> = ({
  data,
}): JSX.Element => (
  <div className="transition-period-complete" role="alert" aria-live="assertive">
    <h2>Period {data.periodNumber} Complete!</h2>
    <p>You've completed all elements in Period {data.periodNumber}!</p>

    {data.unlockedGameModes !== null &&
      data.unlockedGameModes !== undefined &&
      data.unlockedGameModes.length > 0 && (
        <div className="unlocked-games">
          <h3>New Games Unlocked:</h3>
          <ul>
            {data.unlockedGameModes.map((mode: GameMode, index: number) => (
              <li key={mode} style={{ '--item-index': index } as React.CSSProperties}>
                {getGameModeName(mode)}
              </li>
            ))}
          </ul>
        </div>
      )}
  </div>
);
