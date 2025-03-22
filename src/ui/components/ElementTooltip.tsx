/***********************************************
 * FILE: ElementTooltip.tsx
 * CREATED: 2025-03-21 22:07:00
 *
 * PURPOSE:
 * This component provides tooltips for periodic table elements,
 * showing progression details and requirements.
 *
 * METHODS:
 * - ElementTooltip: Renders a tooltip with element details and progress
 *****************/

import * as Tooltip from '@radix-ui/react-tooltip';
import { Gem } from 'lucide-react';

import { cn } from '@/lib/utils';

import type { ProgressionElement } from './types';

interface ElementTooltipProps {
  element: ProgressionElement;
  children: React.ReactNode;
}

export function ElementTooltip({ element, children }: ElementTooltipProps): JSX.Element {
  const getTooltipContent = (): JSX.Element | null => {
    switch (element.state) {
      case 'completed':
        return (
          <div className="flex flex-col gap-1">
            <div className="font-bold text-white">{element.name}</div>
            <div className="text-sm text-gray-300">Completed!</div>
          </div>
        );
      case 'current':
        return (
          <div className="flex flex-col gap-1">
            <div className="font-bold text-white">{element.name}</div>
            <div className="text-sm text-gray-300">Available Now</div>
            {element.progress && (
              <div className="mt-1">
                <div className="text-xs text-gray-400">Progress</div>
                <div className="w-32 h-1 bg-gray-700 rounded-full mt-1">
                  <div
                    className="h-full bg-blue-400 rounded-full"
                    style={{ width: `${element.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      case 'locked':
        return (
          <div className="flex flex-col gap-1">
            <div className="font-bold text-white">{element.name}</div>
            <div className="text-sm text-gray-300">Locked</div>
            {element.gemCost && (
              <div className="flex items-center gap-1 text-sm">
                <Gem className="h-4 w-4 text-blue-400" />
                <span>{element.gemCost} required</span>
              </div>
            )}
            {element.requirements && (
              <div className="mt-1 text-sm text-gray-400">
                <div>Requirements:</div>
                <ul className="list-disc list-inside">
                  {element.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      case 'upcoming':
        return (
          <div className="flex flex-col gap-1">
            <div className="font-bold text-white">{element.name}</div>
            <div className="text-sm text-gray-300">Coming Soon</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className={cn(
              'rounded-md bg-gray-800 px-4 py-3 text-sm text-gray-200',
              'animate-in fade-in-0 zoom-in-95',
              'shadow-md'
            )}
            sideOffset={5}
          >
            {getTooltipContent()}
            <Tooltip.Arrow className="fill-gray-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
