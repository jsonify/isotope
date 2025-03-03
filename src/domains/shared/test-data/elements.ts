// src/domains/shared/test-data/elements.ts
import type { Element, ElementSymbol } from '../models/domain-models';

/**
 * Test data for elements from the periodic table
 * Contains the first 20 elements with complete properties
 */
export const TEST_ELEMENTS: Element[] = [
  {
    symbol: 'H',
    name: 'Hydrogen',
    atomicNumber: 1,
    atomicWeight: 1.008,
    period: 1,
    group: 1,
    description: 'The lightest and most abundant chemical element in the universe.',
  },
  {
    symbol: 'He',
    name: 'Helium',
    atomicNumber: 2,
    atomicWeight: 4.0026,
    period: 1,
    group: 18,
    description: 'A colorless, odorless, tasteless, non-toxic, inert, monatomic gas.',
  },
  {
    symbol: 'Li',
    name: 'Lithium',
    atomicNumber: 3,
    atomicWeight: 6.94,
    period: 2,
    group: 1,
    description: 'A soft, silvery-white alkali metal.',
  },
  {
    symbol: 'Be',
    name: 'Beryllium',
    atomicNumber: 4,
    atomicWeight: 9.0122,
    period: 2,
    group: 2,
    description: 'A relatively rare element in the universe.',
  },
  {
    symbol: 'B',
    name: 'Boron',
    atomicNumber: 5,
    atomicWeight: 10.81,
    period: 2,
    group: 13,
    description: 'A metalloid that is found in small amounts in meteoroids.',
  },
  {
    symbol: 'C',
    name: 'Carbon',
    atomicNumber: 6,
    atomicWeight: 12.011,
    period: 2,
    group: 14,
    description:
      "The 15th most abundant element in the Earth's crust, and the 4th most abundant element in the universe by mass.",
  },
  {
    symbol: 'N',
    name: 'Nitrogen',
    atomicNumber: 7,
    atomicWeight: 14.007,
    period: 2,
    group: 15,
    description: "It forms about 78% of Earth's atmosphere.",
  },
  {
    symbol: 'O',
    name: 'Oxygen',
    atomicNumber: 8,
    atomicWeight: 15.999,
    period: 2,
    group: 16,
    description:
      'A highly reactive nonmetal and oxidizing agent that readily forms oxides with most elements.',
  },
  {
    symbol: 'F',
    name: 'Fluorine',
    atomicNumber: 9,
    atomicWeight: 18.998,
    period: 2,
    group: 17,
    description:
      'The lightest halogen and exists as a highly toxic pale yellow gas at standard conditions.',
  },
  {
    symbol: 'Ne',
    name: 'Neon',
    atomicNumber: 10,
    atomicWeight: 20.18,
    period: 2,
    group: 18,
    description:
      'A noble gas that gives a distinct reddish-orange glow when used in low-voltage gas-discharge lamps.',
  },
  {
    symbol: 'Na',
    name: 'Sodium',
    atomicNumber: 11,
    atomicWeight: 22.99,
    period: 3,
    group: 1,
    description: 'A soft, silvery-white, highly reactive metal.',
  },
  {
    symbol: 'Mg',
    name: 'Magnesium',
    atomicNumber: 12,
    atomicWeight: 24.305,
    period: 3,
    group: 2,
    description:
      'A shiny gray solid which bears a close physical resemblance to the other five elements in the second column of the periodic table.',
  },
  {
    symbol: 'Al',
    name: 'Aluminum',
    atomicNumber: 13,
    atomicWeight: 26.982,
    period: 3,
    group: 13,
    description: 'A silvery-white, soft, non-magnetic and ductile metal.',
  },
  {
    symbol: 'Si',
    name: 'Silicon',
    atomicNumber: 14,
    atomicWeight: 28.085,
    period: 3,
    group: 14,
    description: 'A hard, brittle crystalline solid with a blue-grey metallic luster.',
  },
  {
    symbol: 'P',
    name: 'Phosphorus',
    atomicNumber: 15,
    atomicWeight: 30.974,
    period: 3,
    group: 15,
    description: 'A multivalent nonmetal of the nitrogen group.',
  },
  {
    symbol: 'S',
    name: 'Sulfur',
    atomicNumber: 16,
    atomicWeight: 32.06,
    period: 3,
    group: 16,
    description: 'An abundant, multivalent non-metal.',
  },
  {
    symbol: 'Cl',
    name: 'Chlorine',
    atomicNumber: 17,
    atomicWeight: 35.45,
    period: 3,
    group: 17,
    description: 'A yellow-green gas at room temperature.',
  },
  {
    symbol: 'Ar',
    name: 'Argon',
    atomicNumber: 18,
    atomicWeight: 39.948,
    period: 3,
    group: 18,
    description: "The third-most abundant gas in the Earth's atmosphere.",
  },
  {
    symbol: 'K',
    name: 'Potassium',
    atomicNumber: 19,
    atomicWeight: 39.098,
    period: 4,
    group: 1,
    description: 'A silvery-white metal that is soft enough to be cut with a knife.',
  },
  {
    symbol: 'Ca',
    name: 'Calcium',
    atomicNumber: 20,
    atomicWeight: 40.078,
    period: 4,
    group: 2,
    description:
      'An alkaline earth metal, calcium is a reactive metal that forms a dark oxide-nitride layer when exposed to air.',
  },
];

/**
 * Get elements by period number
 */
export const getElementsByPeriod = (period: number): Element[] => {
  return TEST_ELEMENTS.filter(element => element.period === period);
};

/**
 * Get elements by group number
 */
export const getElementsByGroup = (group: number): Element[] => {
  return TEST_ELEMENTS.filter(element => element.group === group);
};

/**
 * Get an element by its symbol
 */
export const getElementBySymbol = (symbol: ElementSymbol): Element | undefined => {
  return TEST_ELEMENTS.find(element => element.symbol === symbol);
};

/**
 * Get an element by its atomic number
 */
export const getElementByAtomicNumber = (atomicNumber: number): Element | undefined => {
  return TEST_ELEMENTS.find(element => element.atomicNumber === atomicNumber);
};

export default TEST_ELEMENTS;
