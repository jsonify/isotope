/***********************************************
 * FILE: src/ui/components/ProgressBarsModal.tsx
 * CREATED: 2025-03-21 23:59:37
 *
 * PURPOSE:
 * This component displays a modal with progress bars for AN (Atomic Number),
 * AW (Atomic Weight), and GL (Game Lab) progression metrics.
 *
 * METHODS:
 * - ProgressBarsModal(): Renders a modal with progress bars for AN, AW, and GL
 ************************************************/

'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ProgressBarsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  progressData: {
    anProgress: number;
    awProgress: number;
    glProgress: number;
  };
}

export function ProgressBarsModal({
  open,
  onOpenChange,
  progressData,
}: ProgressBarsModalProps): JSX.Element {
  const ProgressBar = ({
    label,
    value,
    id,
  }: {
    label: string;
    value: number;
    id: string;
  }): JSX.Element => (
    <div className="grid gap-2">
      <label className="text-sm text-gray-300" htmlFor={id}>
        {label}
      </label>
      <div className="relative pt-1">
        <progress
          id={id}
          className="w-full h-2 bg-gray-700 rounded-full appearance-none overflow-hidden [&::-webkit-progress-bar]:bg-gray-700 [&::-webkit-progress-value]:bg-blue-400 [&::-moz-progress-bar]:bg-blue-400"
          value={value}
          max={100}
          aria-label={label}
        >
          {value}%
        </progress>
        <span className="text-xs text-gray-400 mt-1 block">{value}%</span>
      </div>
    </div>
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 bg-black/80',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
        />
        <Dialog.Content
          aria-modal="true"
          className={cn(
            'fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%]',
            'bg-gray-900 p-6 shadow-lg',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            'rounded-lg'
          )}
        >
          <Dialog.Title className="text-lg font-semibold text-white mb-4">
            Element Progress
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-400 mb-6">
            Detailed progress for AN, AW, and GL metrics
          </Dialog.Description>

          <div className="space-y-4">
            <ProgressBar
              label="Atomic Number (AN)"
              value={progressData.anProgress}
              id="an-progress"
            />
            <ProgressBar
              label="Atomic Weight (AW)"
              value={progressData.awProgress}
              id="aw-progress"
            />
            <ProgressBar label="Game Lab (GL)" value={progressData.glProgress} id="gl-progress" />
          </div>

          <Dialog.Close asChild>
            <button
              className={cn(
                'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-gray-900 transition-opacity',
                'hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2',
                'disabled:pointer-events-none'
              )}
            >
              <X className="h-4 w-4 text-gray-500" />
              <span className="sr-only">Close</span>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
