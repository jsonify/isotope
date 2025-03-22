import { renderHook, act } from '@testing-library/react-hooks';
import { describe, it, expect } from 'vitest';

import useTutorial from '../ui/tutorial/useTutorial';

interface TutorialStep {
  hintText: string;
}

describe('useTutorial Hook', () => {
  it('should initialize with steps and get the current step', () => {
    const steps: TutorialStep[] = [
      { hintText: 'Step 1 Hint' },
      { hintText: 'Step 2 Hint' },
      { hintText: 'Step 3 Hint' },
    ];
    const { result } = renderHook(() => useTutorial(steps));
    expect(result.current.currentStep).toEqual(steps[0]);
    expect(result.current.isTutorialActive).toBe(true);
  });

  it('should advance to the next step', () => {
    const steps: TutorialStep[] = [
      { hintText: 'Step 1 Hint' },
      { hintText: 'Step 2 Hint' },
      { hintText: 'Step 3 Hint' },
    ];
    const { result } = renderHook(() => useTutorial(steps));
    act(() => {
      result.current.nextStep();
    });
    expect(result.current.currentStep).toEqual(steps[1]);
  });

  it('should return null and set isTutorialActive to false when all steps are completed', () => {
    const steps: TutorialStep[] = [
      { hintText: 'Step 1 Hint' },
      { hintText: 'Step 2 Hint' },
      { hintText: 'Step 3 Hint' },
    ];
    const { result } = renderHook(() => useTutorial(steps));
    act(() => {
      result.current.nextStep();
      result.current.nextStep();
      result.current.nextStep(); // After last step
    });
    expect(result.current.currentStep).toBeNull();
    expect(result.current.isTutorialActive).toBe(false);
  });
});
