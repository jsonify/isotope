import type { FC } from 'react';
import React, { useEffect, useRef } from 'react';

import type { TutorialStep } from '../tutorial/useTutorial';

interface TutorialHintProps {
  currentStep: TutorialStep | null;
  nextStep: () => void;
}

export const TutorialHint: FC<TutorialHintProps> = ({ currentStep, nextStep }) => {
  const hintRef = useRef<HTMLDivElement>(null);
  const targetElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (currentStep && currentStep.targetElement) {
      targetElementRef.current = document.querySelector(currentStep.targetElement);
      if (targetElementRef.current && hintRef.current) {
        const targetRect = targetElementRef.current.getBoundingClientRect();
        hintRef.current.style.top = `${targetRect.bottom + 5}px`; // Position below target, closer
        hintRef.current.style.left = `${targetRect.left}px`;
      }
    }
  }, [currentStep]);

  if (!currentStep) {
    return null;
  }

  return (
    <div
      ref={hintRef}
      className="tutorial-hint bg-gray-50 border border-gray-200 rounded-md p-4 absolute z-50 shadow-md"
    >
      <p className="text-gray-700">{currentStep.hintText}</p>
      <button onClick={nextStep} className="btn-primary mt-2">
        Next
      </button>
    </div>
  );
};
