// src/domains/player/services/__tests__/progression-suites/requiredPuzzles.suite.ts
import { describe, it, expect } from 'vitest';

import { ELEMENTS_DATA } from '../../../../shared/constants/game-constants';
import type { ElementSymbol } from '../../../../shared/models/domain-models';

interface TestService {
  calculateRequiredPuzzles: (element: ElementSymbol) => number;
}

type SetupFn = () => {
  service: TestService;
};

export function testRequiredPuzzlesCalculation(setupFn: SetupFn): void {
  describe('calculateRequiredPuzzles', () => {
    it('should return correct number of required puzzles for advancement', () => {
      const { service } = setupFn();
      expect(service.calculateRequiredPuzzles('H')).toBe(4); // H -> He
    });

    it('should return 0 if at maximum element', () => {
      const { service } = setupFn();
      const lastElement = ELEMENTS_DATA[ELEMENTS_DATA.length - 1];
      expect(service.calculateRequiredPuzzles(lastElement.symbol as ElementSymbol)).toBe(0);
    });
  });
}
