/***********************************************
 * FILE: types.ts
 * CREATED: 2025-03-21 22:05:25
 *
 * PURPOSE:
 * Contains shared type definitions for UI components.
 *
 * TYPES:
 * - ProgressionElement: Defines the structure of periodic table elements
 *****************/

export type ProgressionElement = {
  id: string;
  symbol: string;
  name: string;
  row: number;
  column: number;
  state: 'completed' | 'current' | 'locked' | 'upcoming';
  gemCost?: number;
  path?: string;
  category?: string;
  progress?: number; // Progress percentage (0-100)
  requirements?: string[]; // List of requirements to unlock
};
