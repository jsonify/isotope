/***********************************************
 * FILE: src/ui/components/ElementMatchGame.tsx
 * CREATED: 2025-03-23 18:35:20
 *
 * PURPOSE:
 * React component for the Element Match game interface.
 * Displays two elements and handles match logic.
 *
 * METHODS:
 * - startNewRound(): Generates new elements for play
 * - handleRoundComplete(): Processes round completion and scoring
 *****************/

import { useEffect, useState, useCallback } from 'react';

import { PlayerProfileService } from '../../domains/player/services/PlayerProfileService';
import type { Element } from '../../domains/puzzle/models/ElementMatchTypes';
import {
  isMatch,
  calculateScore,
  generateElements,
} from '../../domains/puzzle/services/ElementMatchGame';

const profileService = new PlayerProfileService();

export function ElementMatchGame(): JSX.Element {
  const [elements, setElements] = useState<[Element, Element]>([
    { atomicNumber: 0 },
    { atomicNumber: 0 },
  ]);

  const startNewRound = useCallback((): void => {
    const newElements = generateElements();
    setElements(newElements);

    // Process match automatically for MVP
    const matched = isMatch(newElements[0], newElements[1]);
    const score = calculateScore(matched);

    if (score > 0) {
      profileService.updateAWScore(score);
    }
  }, []);

  // Start first round on mount
  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  return (
    <div className="p-4 border rounded shadow-sm">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">Element Match</h2>
        <p className="text-gray-600">Observe the elements below</p>
      </div>

      <div className="flex justify-center gap-8 mb-4">
        <div className="text-center p-4 border rounded">
          <div className="text-2xl font-bold mb-2">{elements[0].atomicNumber}</div>
          <div className="text-sm">Element 1</div>
        </div>
        <div className="text-center p-4 border rounded">
          <div className="text-2xl font-bold mb-2">{elements[1].atomicNumber}</div>
          <div className="text-sm">Element 2</div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={startNewRound}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Next Round
        </button>
      </div>
    </div>
  );
}
