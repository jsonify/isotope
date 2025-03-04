// src/ui/components/TestTransitions.tsx
import type { FC } from 'react';
import { useCallback } from 'react';

import { GameMode } from '../../domains/shared/models/domain-models';
import { TransitionType } from '../../domains/shared/models/transition-models';
import { TransitionService } from '../../domains/shared/services/TransitionService';

const getTransitionService = (): TransitionService | null => {
  const service = TransitionService.getInstance();
  return service !== null && service !== undefined ? service : null;
};

const TestButton: FC<{ onClick: () => void; label: string }> = ({ onClick, label }) => {
  return (
    <button onClick={onClick} type="button" className="btn-primary">
      {label}
    </button>
  );
};

export const TestTransitions: FC = (): JSX.Element => {
  // Pre-define handlers to avoid inline arrow functions
  const handleTestElementAdvance = useCallback((): void => {
    const service = getTransitionService();
    if (service === null) return;

    service.createTransition(TransitionType.ELEMENT_ADVANCE, {
      type: TransitionType.ELEMENT_ADVANCE,
      fromElement: 'H',
      toElement: 'He',
      newLevel: {
        atomicNumber: 2,
        atomicWeight: 10,
      },
    });
  }, []);

  const handleTestGameModeUnlock = useCallback((): void => {
    const service = getTransitionService();
    if (service === null) return;

    service.createTransition(TransitionType.GAME_MODE_UNLOCK, {
      type: TransitionType.GAME_MODE_UNLOCK,
      gameMode: GameMode.ELEMENT_MATCH,
    });
  }, []);

  const handleTestPeriodComplete = useCallback((): void => {
    const service = getTransitionService();
    if (service === null) return;

    service.createTransition(TransitionType.PERIOD_COMPLETE, {
      type: TransitionType.PERIOD_COMPLETE,
      periodNumber: 2,
      unlockedGameModes: [GameMode.PERIODIC_SORT, GameMode.ELECTRON_SHELL],
    });
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-4">
      <h2 className="text-xl font-bold mb-2">Test Transitions</h2>
      <div className="flex flex-wrap gap-2">
        <TestButton onClick={handleTestElementAdvance} label="Test Element Advance" />
        <TestButton onClick={handleTestGameModeUnlock} label="Test Game Mode Unlock" />
        <TestButton onClick={handleTestPeriodComplete} label="Test Period Complete" />
      </div>
    </div>
  );
};
