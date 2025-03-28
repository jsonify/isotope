/***********************************************
 * FILE: src/ui/components/PeriodicTable.tsx
 * CREATED: 2025-03-21 23:41:32
 *
 * PURPOSE:
 * This file implements a mini periodic table component for displaying
 * progression elements in a grid layout. It handles element states,
 * connections between elements, tooltips, and click interactions.
 *
 * METHODS:
 * - MiniPeriodicTable(): Main component that renders the periodic table grid
 * - ElementCell(): Internal component that renders individual element cells
 * - getElementStyles(): Helper function for element styling based on state
 ************************************************/

'use client';

import { useCallback, useState } from 'react';

import { Gem, Lock } from 'lucide-react';

import { cn } from '@/lib/utils';

import { ElementTooltip } from './ElementTooltip';
import { ProgressBarsModal } from './ProgressBarsModal';
import type { ProgressionElement } from './types';

interface MiniPeriodicTableProps {
  elements: ProgressionElement[];
  onElementClick?: (element: ProgressionElement) => void;
  className?: string;
}

// Helper function to get styles based on element state
const getElementStyles = (state: ProgressionElement['state']): string => {
  switch (state) {
    case 'completed':
      return 'bg-[#2D9CDB] text-white shadow-lg shadow-[#2D9CDB]/20';
    case 'current':
      return 'bg-[#2D9CDB] text-white shadow-lg shadow-[#2D9CDB]/20 ring-2 ring-white';
    case 'locked':
      return 'bg-[#2D2E3A] text-gray-400';
    case 'upcoming':
      return 'bg-[#252731] text-gray-500 border-2 border-dashed border-gray-600';
    default:
      return 'bg-[#252731] text-gray-500';
  }
};

interface ElementCellProps {
  element: ProgressionElement;
  rowIndex: number;
  colIndex: number;
  hasLeftConnection: boolean;
  hasTopConnection: boolean;
  onElementClick?: (element: ProgressionElement) => void;
}

const ElementCell = ({
  element,
  rowIndex,
  colIndex,
  hasLeftConnection,
  hasTopConnection,
  onElementClick,
}: ElementCellProps): JSX.Element => {
  const elementStyles = getElementStyles(element.state);
  const handleClick = useCallback(() => {
    onElementClick?.(element);
  }, [element, onElementClick]);

  const commonContent = (
    <>
      <div className="text-xs" aria-hidden="true">
        {rowIndex + 1}.{colIndex + 1}
      </div>
      <div className="text-xl font-bold">{element.symbol}</div>
      <div className="text-[10px] truncate max-w-full px-1">{element.name}</div>
      {element.state === 'locked' && element.gemCost && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#2D2E3A] rounded-full px-2 py-0.5 border border-gray-700">
          <Gem className="h-3 w-3 text-[#2D9CDB]" aria-hidden="true" />
          <span className="text-xs font-medium">{element.gemCost}</span>
        </div>
      )}
      {element.state === 'locked' && (
        <Lock className="absolute top-1 right-1 h-3 w-3" aria-hidden="true" />
      )}
      {element.progress !== undefined && element.state === 'current' && (
        <div
          className="absolute bottom-0 left-0 h-1 bg-blue-400 rounded-b-lg transition-all"
          style={{ width: `${element.progress}%` }}
          role="progressbar"
          aria-valuenow={element.progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      )}
    </>
  );

  const elementContent = element.path ? (
    <a
      href={element.path}
      className={cn(
        'w-16 h-16 rounded-lg flex flex-col items-center justify-center transition-all hover:scale-105 relative overflow-hidden',
        elementStyles
      )}
      aria-label={`${element.name} (${element.state})`}
    >
      {commonContent}
    </a>
  ) : (
    <button
      onClick={handleClick}
      className={cn(
        'w-16 h-16 rounded-lg flex flex-col items-center justify-center transition-all hover:scale-105 relative overflow-hidden',
        elementStyles
      )}
      disabled={element.state === 'locked' || element.state === 'upcoming'}
      aria-label={`${element.name} (${element.state})`}
    >
      {commonContent}
    </button>
  );

  return (
    <div className="relative" role="gridcell">
      {hasLeftConnection && (
        <div
          className="absolute top-1/2 left-0 w-2 h-0.5 -translate-x-2 bg-[#2D2E3A]"
          aria-hidden="true"
        />
      )}
      {hasTopConnection && (
        <div
          className="absolute top-0 left-1/2 h-2 w-0.5 -translate-y-2 -translate-x-1/2 bg-[#2D2E3A]"
          aria-hidden="true"
        />
      )}
      <ElementTooltip element={element}>{elementContent}</ElementTooltip>
    </div>
  );
};

export function MiniPeriodicTable({
  elements,
  onElementClick,
  className,
}: MiniPeriodicTableProps): JSX.Element {
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<ProgressionElement | null>(null);

  const handleElementClick = useCallback(
    (element: ProgressionElement) => {
      setSelectedElement(element);
      setIsProgressModalOpen(true);
      onElementClick?.(element);
    },
    [onElementClick]
  );
  // Find the maximum row and column to determine the grid size
  const maxRow = elements.length > 0 ? Math.max(...elements.map(el => el.row)) : 0;
  const maxColumn = elements.length > 0 ? Math.max(...elements.map(el => el.column)) : 0;

  // Create a 2D grid to position elements
  const grid: (ProgressionElement | null)[][] = Array(maxRow + 1)
    .fill(null)
    .map(() => Array(maxColumn + 1).fill(null));

  // Place elements in the grid
  elements.forEach(element => {
    grid[element.row][element.column] = element;
  });

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <div className="min-w-fit">
        <div
          className="grid gap-2"
          style={{
            gridTemplateRows: `repeat(${maxRow + 1}, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(${maxColumn + 1}, minmax(0, 1fr))`,
          }}
          role="grid"
          aria-label="Periodic Table Progress"
        >
          {grid.map((row, rowIndex) =>
            row.map((element, colIndex) =>
              element ? (
                <ElementCell
                  key={`${rowIndex}-${colIndex}`}
                  element={element}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  hasLeftConnection={colIndex > 0 && Boolean(grid[rowIndex][colIndex - 1])}
                  hasTopConnection={rowIndex > 0 && Boolean(grid[rowIndex - 1][colIndex])}
                  onElementClick={handleElementClick}
                />
              ) : (
                <div key={`${rowIndex}-${colIndex}`} role="gridcell" />
              )
            )
          )}
        </div>
      </div>

      {/* Progress bars modal */}
      {selectedElement && (
        <ProgressBarsModal
          open={isProgressModalOpen}
          onOpenChange={setIsProgressModalOpen}
          progressData={{
            anProgress: selectedElement.progress || 0,
            awProgress: selectedElement.progress || 0,
            glProgress: selectedElement.progress || 0,
          }}
        />
      )}

      <div className="mt-4 flex flex-wrap gap-3" role="legend">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm bg-[#2D9CDB] mr-2" aria-hidden="true" />
          <span className="text-xs">Completed</span>
        </div>
        <div className="flex items-center">
          <div
            className="w-4 h-4 rounded-sm bg-[#2D9CDB] ring-1 ring-white mr-2"
            aria-hidden="true"
          />
          <span className="text-xs">Current</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm bg-[#2D2E3A] mr-2" aria-hidden="true" />
          <span className="text-xs">Locked</span>
        </div>
        <div className="flex items-center">
          <div
            className="w-4 h-4 rounded-sm bg-[#252731] border border-dashed border-gray-600 mr-2"
            aria-hidden="true"
          />
          <span className="text-xs">Upcoming</span>
        </div>
      </div>
    </div>
  );
}
