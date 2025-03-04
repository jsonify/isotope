import type React from 'react';
import { useEffect, useState } from 'react';

import {
  isServiceAvailable,
  handlePendingTransition,
  handleCompletedTransition,
} from './useTransitionHandlers';
import type { TransitionEvent } from '../../domains/shared/models/transition-models';
import { TransitionService } from '../../domains/shared/services/TransitionService';

// Hook to handle transition queue processing
export const useQueueProcessor = (
  activeTransition: TransitionEvent | null,
  transitionQueue: TransitionEvent[],
  setActiveTransition: React.Dispatch<React.SetStateAction<TransitionEvent | null>>,
  setTransitionQueue: React.Dispatch<React.SetStateAction<TransitionEvent[]>>,
  setShowOverlay: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  useEffect(() => {
    if (activeTransition !== null || transitionQueue.length === 0) return undefined;

    // Get the next transition from the queue
    const nextTransition = transitionQueue[0];
    const updatedQueue = transitionQueue.slice(1);

    // Set it as the active transition
    setActiveTransition(nextTransition);
    setTransitionQueue(updatedQueue);
    setShowOverlay(true);

    // Notify the transition service
    const transitionService = TransitionService.getInstance();
    if (isServiceAvailable(transitionService)) {
      transitionService.startTransition(nextTransition.id);
    }
    return undefined;
  }, [activeTransition, transitionQueue, setActiveTransition, setTransitionQueue, setShowOverlay]);
};

// Hook to subscribe to transition service events
export const useTransitionServiceSubscription = (
  activeTransition: TransitionEvent | null,
  setTransitionQueue: React.Dispatch<React.SetStateAction<TransitionEvent[]>>,
  setShowOverlay: React.Dispatch<React.SetStateAction<boolean>>,
  setActiveTransition: React.Dispatch<React.SetStateAction<TransitionEvent | null>>
): void => {
  useEffect(() => {
    const transitionService = TransitionService.getInstance();
    if (!isServiceAvailable(transitionService)) return undefined;

    const handleTransition = (event: TransitionEvent): void => {
      handlePendingTransition(event, setTransitionQueue);
      handleCompletedTransition(event, activeTransition, setShowOverlay, setActiveTransition);
    };

    const unsubscribe = transitionService.subscribe(handleTransition);
    return (): void => unsubscribe();
  }, [activeTransition, setTransitionQueue, setShowOverlay, setActiveTransition]);
};

// Hook to auto-complete transitions after their duration
export const useAutoCompleteTransition = (
  activeTransition: TransitionEvent | null,
  duration: number
): void => {
  useEffect(() => {
    if (!activeTransition) return undefined;

    const timeoutId = setTimeout((): void => {
      TransitionService.getInstance()?.completeTransition(activeTransition.id);
    }, duration);

    return (): void => clearTimeout(timeoutId);
  }, [activeTransition, duration]);
};

// Hook to manage debug queue display
export const useDebugQueueDisplay = (queueLength: number): boolean => {
  const [showDebug, setShowDebug] = useState<boolean>(false);

  useEffect(() => {
    setShowDebug(process.env.NODE_ENV === 'development' && queueLength > 0);
    return undefined;
  }, [queueLength]);

  return showDebug;
};
