/***********************************************
 * FILE: src/ui/components/PlayerProfileDisplay.tsx
 * CREATED: 2025-03-22 14:02:29
 *
 * PURPOSE:
 * A simple React component to display player profile metrics including
 * Atomic Number (AN), Atomic Weight (AW), and Gameplay Level (GL).
 *
 * METHODS:
 * - PlayerProfileDisplay(): Renders the player profile metrics display
 *****************/

import React from 'react';

interface PlayerProfileDisplayProps {
  an?: number;
  aw?: number;
  gl?: number;
}

export const PlayerProfileDisplay: React.FC<PlayerProfileDisplayProps> = ({
  an = 0,
  aw = 0,
  gl = 0,
}) => {
  return (
    <div className="flex flex-col space-y-2 p-4 bg-gray-800 text-gray-100 rounded-lg shadow-lg">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-gray-400">AN:</span>
          <span data-testid="an-value" className="font-bold">
            {an}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-gray-400">AW:</span>
          <span data-testid="aw-value" className="font-bold">
            {aw}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-gray-400">GL:</span>
          <span data-testid="gl-value" className="font-bold">
            {gl}
          </span>
        </div>
      </div>
    </div>
  );
};
