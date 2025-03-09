/**
 * Valid chemical element symbols
 */
export type ElementSymbol =
  | 'H'
  | 'He'
  | 'Li'
  | 'Be'
  | 'B'
  | 'C'
  | 'N'
  | 'O'
  | 'F'
  | 'Ne'
  | 'Na'
  | 'Mg'
  | 'Al'
  | 'Si'
  | 'P'
  | 'S'
  | 'Cl'
  | 'Ar'
  | 'K'
  | 'Ca';
// First 20 elements for MVP, can be expanded later

/**
 * Maps element symbols to their atomic numbers
 */
export const ELEMENT_ATOMIC_NUMBERS: Record<ElementSymbol, number> = {
  H: 1,
  He: 2,
  Li: 3,
  Be: 4,
  B: 5,
  C: 6,
  N: 7,
  O: 8,
  F: 9,
  Ne: 10,
  Na: 11,
  Mg: 12,
  Al: 13,
  Si: 14,
  P: 15,
  S: 16,
  Cl: 17,
  Ar: 18,
  K: 19,
  Ca: 20,
};

/**
 * Maps atomic numbers to their element symbols
 */
export const ATOMIC_NUMBER_TO_SYMBOL = Object.entries(ELEMENT_ATOMIC_NUMBERS).reduce<
  Record<number, ElementSymbol>
>(
  (acc, [symbol, number]) => ({
    ...acc,
    [number]: symbol as ElementSymbol,
  }),
  {}
);
