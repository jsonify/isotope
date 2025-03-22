/***********************************************
 * FILE: periodic-table-data.ts
 * CREATED: 2025-03-21 22:22:24
 *
 * PURPOSE:
 * Provides sample data for demonstrating the PeriodicTable component
 * with various states, progress indicators, and requirements.
 *****************/

import type { ProgressionElement } from '../types';

// First row elements
export const demoElements: ProgressionElement[] = [
  {
    id: 'h',
    symbol: 'H',
    name: 'Hydrogen',
    row: 0,
    column: 0,
    state: 'completed',
    category: 'nonmetal',
  },
  {
    id: 'he',
    symbol: 'He',
    name: 'Helium',
    row: 0,
    column: 17,
    state: 'current',
    progress: 75,
    category: 'noble-gas',
  },
  // Second row
  {
    id: 'li',
    symbol: 'Li',
    name: 'Lithium',
    row: 1,
    column: 0,
    state: 'locked',
    gemCost: 100,
    requirements: ['Complete Helium challenges', 'Earn 100 Atomic Weight points'],
    category: 'alkali-metal',
  },
  {
    id: 'be',
    symbol: 'Be',
    name: 'Beryllium',
    row: 1,
    column: 1,
    state: 'upcoming',
    category: 'alkaline-earth',
  },
  {
    id: 'b',
    symbol: 'B',
    name: 'Boron',
    row: 1,
    column: 12,
    state: 'locked',
    gemCost: 150,
    requirements: ['Complete Lithium challenges', 'Earn 150 Atomic Weight points'],
    category: 'metalloid',
  },
  {
    id: 'c',
    symbol: 'C',
    name: 'Carbon',
    row: 1,
    column: 13,
    state: 'locked',
    gemCost: 200,
    category: 'nonmetal',
  },
  {
    id: 'n',
    symbol: 'N',
    name: 'Nitrogen',
    row: 1,
    column: 14,
    state: 'locked',
    gemCost: 200,
    category: 'nonmetal',
  },
  {
    id: 'o',
    symbol: 'O',
    name: 'Oxygen',
    row: 1,
    column: 15,
    state: 'locked',
    gemCost: 250,
    category: 'nonmetal',
  },
  {
    id: 'f',
    symbol: 'F',
    name: 'Fluorine',
    row: 1,
    column: 16,
    state: 'locked',
    gemCost: 300,
    category: 'halogen',
  },
  {
    id: 'ne',
    symbol: 'Ne',
    name: 'Neon',
    row: 1,
    column: 17,
    state: 'locked',
    gemCost: 350,
    category: 'noble-gas',
  },
];
