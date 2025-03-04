import React, { useCallback, useState } from 'react';

import { TransitionOverlay } from './TransitionOverlay';
import type { TransitionEvent } from '../../domains/shared/models/transition-models';
import { TransitionService } from '../../domains/shared/services/TransitionService';
import {
  useQueueProcessor,
  useTransitionServiceSubscription,
  useAutoCompleteTransition,
  useDebugQueueDisplay,
} from '../hooks/useTransitionControllerHooks';
import { useTransitionDuration } from '../hooks/useTransitionHandlers';

const DebugQueueDisplay: React.FC<{ queueLength: number }> = ({ queueLength }): JSX.Element => {
  const showDebugQueue = useDebugQueueDisplay(queueLength);

  if (!showDebugQueue) return <></>;

  return (
    <div className="fixed bottom-4 right-4 bg-slate-800 text-white p-2 rounded-md text-xs z-50">
      {queueLength} transition(s) queued
    </div>
  );
};

/**
 * TransitionController handles the queue of transitions and ensures
 * they're displayed one at a time with appropriate timing
 */
export const TransitionController: React.FC = (): JSX.Element => {
  const [transitionQueue, setTransitionQueue] = useState<TransitionEvent[]>([]);
  const [activeTransition, setActiveTransition] = useState<TransitionEvent | null>(null);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);

  const duration = useTransitionDuration(activeTransition);

  useQueueProcessor(
    activeTransition,
    transitionQueue,
    setActiveTransition,
    setTransitionQueue,
    setShowOverlay
  );

  useTransitionServiceSubscription(
    activeTransition,
    setTransitionQueue,
    setShowOverlay,
    setActiveTransition
  );

  useAutoCompleteTransition(activeTransition, duration);

  const handleSkip = useCallback((): void => {
    if (!activeTransition) return;
    TransitionService.getInstance()?.completeTransition(activeTransition.id);
  }, [activeTransition]);

  return (
    <>
      <TransitionOverlay
        transition={activeTransition}
        isVisible={showOverlay}
        onSkip={handleSkip}
      />
      <DebugQueueDisplay queueLength={transitionQueue.length} />
    </>
  );
};
