/***********************************************
 * FILE: PeriodicTableDemo.tsx
 * CREATED: 2025-03-21 22:23:11
 *
 * PURPOSE:
 * Demonstrates the PeriodicTable component with various states,
 * interactions, and progression visualization features.
 *
 * METHODS:
 * - PeriodicTableDemo: Main demo component
 * - handleElementClick: Example click handler for elements
 *****************/

import { useState, useCallback } from 'react';

import { MiniPeriodicTable } from '../PeriodicTable';
import { demoElements } from './periodic-table-data';
import type { ProgressionElement } from '../types';

export function PeriodicTableDemo(): JSX.Element {
  const [selectedElement, setSelectedElement] = useState<ProgressionElement | null>(null);

  const handleElementClick = useCallback((element: ProgressionElement): void => {
    setSelectedElement(element);
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="space-y-8">
        {/* Title and Description */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Periodic Table Progression</h1>
          <p className="text-gray-600">
            Explore elements in different states with progression tracking and requirements.
          </p>
        </div>

        {/* Periodic Table */}
        <div className="bg-gray-900 rounded-xl p-6 shadow-xl">
          <MiniPeriodicTable
            elements={demoElements}
            onElementClick={handleElementClick}
            className="mb-4"
          />
        </div>

        {/* Selected Element Details */}
        {selectedElement && (
          <div className="bg-gray-800 rounded-lg p-6 animate-in fade-in-50">
            <h2 className="text-xl font-bold text-white mb-4">
              {selectedElement.name} ({selectedElement.symbol})
            </h2>
            <div className="space-y-2 text-gray-300">
              <p>
                <span className="font-semibold">State:</span> {selectedElement.state}
              </p>
              {selectedElement.progress !== undefined && (
                <div>
                  <p className="font-semibold mb-1">Progress:</p>
                  <div className="w-full h-2 bg-gray-700 rounded-full">
                    <div
                      className="h-full bg-blue-400 rounded-full transition-all duration-500"
                      style={{ width: `${selectedElement.progress}%` }}
                    />
                  </div>
                  <p className="text-sm mt-1">{selectedElement.progress}% complete</p>
                </div>
              )}
              {selectedElement.gemCost && (
                <p>
                  <span className="font-semibold">Gem Cost:</span> {selectedElement.gemCost}
                </p>
              )}
              {selectedElement.requirements && (
                <div>
                  <p className="font-semibold mb-1">Requirements:</p>
                  <ul className="list-disc list-inside text-sm">
                    {selectedElement.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Example States */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-[#2D9CDB] text-white p-4 rounded">
            <h3 className="font-bold">Completed</h3>
            <p>Elements you've mastered</p>
          </div>
          <div className="bg-[#2D9CDB] ring-2 ring-white text-white p-4 rounded">
            <h3 className="font-bold">Current</h3>
            <p>Elements you're learning</p>
          </div>
          <div className="bg-[#2D2E3A] text-gray-400 p-4 rounded">
            <h3 className="font-bold">Locked</h3>
            <p>Complete requirements to unlock</p>
          </div>
          <div className="bg-[#252731] text-gray-500 border-2 border-dashed border-gray-600 p-4 rounded">
            <h3 className="font-bold">Upcoming</h3>
            <p>Next elements to unlock</p>
          </div>
        </div>
      </div>
    </div>
  );
}
