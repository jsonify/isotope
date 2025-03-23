// src/ui/components/TransitionOverlay.tsx
import type { FC } from 'react';

import { AchievementUnlockContent } from './transitions/AchievementContent';
import { ElementUnlockContent, ElementAdvanceContent } from './transitions/ElementContent';
import { GameModeUnlockContent, PeriodCompleteContent } from './transitions/GameContent';
import type {
  TransitionEvent,
  ElementUnlockTransition,
  ElementAdvanceTransition,
  AchievementUnlockTransition,
  GameModeUnlockTransition,
  PeriodCompleteTransition,
} from '../../domains/shared/models/transition-models';
import { TransitionType } from '../../domains/shared/models/transition-models';

interface TransitionOverlayProps {
  transition: TransitionEvent | null;
  isVisible: boolean;
  onSkip?: () => void;
  className?: string;
}

const renderTransitionContent = (transition: TransitionEvent): JSX.Element | null => {
  switch (transition.type) {
    case TransitionType.ELEMENT_UNLOCK:
      return <ElementUnlockContent data={transition.data as ElementUnlockTransition} />;

    case TransitionType.ELEMENT_ADVANCE:
      return <ElementAdvanceContent data={transition.data as ElementAdvanceTransition} />;

    case TransitionType.ACHIEVEMENT_UNLOCK:
      return <AchievementUnlockContent data={transition.data as AchievementUnlockTransition} />;

    case TransitionType.GAME_MODE_UNLOCK:
      return <GameModeUnlockContent data={transition.data as GameModeUnlockTransition} />;

    case TransitionType.PERIOD_COMPLETE:
      return <PeriodCompleteContent data={transition.data as PeriodCompleteTransition} />;

    default:
      return null;
  }
};

export const TransitionOverlay: FC<TransitionOverlayProps> = ({
  transition,
  isVisible,
  onSkip,
  className = '',
}): JSX.Element | null => {
  if (transition === null) return null;

  const baseClassName = 'transition-overlay';
  const visibilityClass = isVisible ? 'visible' : '';
  const fullClassName = [baseClassName, className, visibilityClass].filter(Boolean).join(' ');

  return (
    <div className={fullClassName} role="dialog" aria-modal="true">
      <div className="transition-content">
        {renderTransitionContent(transition)}

        {onSkip !== undefined && onSkip !== null && (
          <button
            onClick={onSkip}
            className="skip-button mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm"
            aria-label="Skip animation"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
};
