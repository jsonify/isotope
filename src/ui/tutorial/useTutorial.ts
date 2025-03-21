import { useState, useCallback } from 'react';

export interface TutorialStep {
  hintText: string;
  targetElement?: string; // CSS selector or component ref
  interactiveElement?: boolean; // If the hint has interactive element
}

interface TutorialHook {
  currentStep: TutorialStep | null;
  nextStep: () => void;
  currentStepIndex: number;
  totalSteps: number;
  isTutorialActive: boolean;
}

const useTutorial = (steps: TutorialStep[]): TutorialHook => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const getCurrentStep = useCallback((): TutorialStep | null => {
    return steps[currentStepIndex] || null;
  }, [steps, currentStepIndex]);

  const nextStep = useCallback((): void => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  }, [steps, currentStepIndex]);

  return {
    currentStep: getCurrentStep(),
    nextStep,
    currentStepIndex,
    totalSteps: steps.length,
    isTutorialActive: currentStepIndex < steps.length,
  };
};

export default useTutorial;
