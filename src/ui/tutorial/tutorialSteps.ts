import type { TutorialStep } from './useTutorial';

const tutorialSteps: TutorialStep[] = [
  {
    hintText:
      "Welcome to the Periodic Table Game! Let's learn about progression. First, Atomic Number (AN) represents your overall progress through the elements.",
    targetElement: '#player-info-an',
  },
  {
    hintText:
      'Atomic Weight (AW) is earned by completing puzzles and activities. Higher AW unlocks more advanced elements and game modes.',
    targetElement: '#player-info-aw',
    interactiveElement: true, // Example, step with interactive element
  },
  {
    hintText:
      'Game Lab (GL) unlocks new game modes and features as you progress through periods of the periodic table.',
    targetElement: '#player-info-gl',
  },
];

export default tutorialSteps;
