import type { TransitionEvent } from '../../domains/shared/models/transition-models';
import { TransitionState, TransitionType } from '../../domains/shared/models/transition-models';
import type { TransitionService } from '../../domains/shared/services/TransitionService';

const DEFAULT_FADE_DURATION = 300;
const DEFAULT_DISPLAY_DURATION = 2000;

// Helper function to check if service is available
export const isServiceAvailable = (
  service: TransitionService | null | undefined
): service is TransitionService => {
  return service !== null && service !== undefined;
};

// Hook to manage transition duration
export const useTransitionDuration = (activeTransition: TransitionEvent | null): number => {
  if (activeTransition === null) return 0;

  switch (activeTransition.type) {
    case TransitionType.ELEMENT_ADVANCE:
      return 3000; // 3 seconds for element advancement
    case TransitionType.ACHIEVEMENT_UNLOCK:
      return 2500; // 2.5 seconds for achievements
    default:
      return 2000; // 2 seconds default
  }
};

// Handlers for transition state changes
export const handlePendingTransition = (
  event: TransitionEvent,
  setTransitionQueue: React.Dispatch<React.SetStateAction<TransitionEvent[]>>
): void => {
  if (event.state !== null && event.state === TransitionState.PENDING)
    setTransitionQueue(prev => [...prev, event]);
};

export const handleCompletedTransition = (
  event: TransitionEvent,
  activeTransition: TransitionEvent | null,
  setShowOverlay: React.Dispatch<React.SetStateAction<boolean>>,
  setActiveTransition: React.Dispatch<React.SetStateAction<TransitionEvent | null>>
): void => {
  if (event.state === TransitionState.COMPLETED && activeTransition?.id === event.id) {
    const hideOverlay = (): void => setShowOverlay(false);
    const clearTransition = (): void => setActiveTransition(null);
    setTimeout(hideOverlay, DEFAULT_DISPLAY_DURATION);
    setTimeout(clearTransition, DEFAULT_DISPLAY_DURATION + DEFAULT_FADE_DURATION);
  }
};

export { DEFAULT_FADE_DURATION, DEFAULT_DISPLAY_DURATION };
