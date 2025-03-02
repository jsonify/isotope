// src/domains/shared/test-data/store-items.ts
import type { StoreItem } from '../models/domain-models';
import { GameMode } from '../models/domain-models';

/**
 * Test store items for development
 */
export const TEST_STORE_ITEMS: StoreItem[] = [
  // Game unlocks
  {
    id: `game_${GameMode.ELEMENT_QUIZ}`,
    name: 'Element Quiz Game',
    description: 'Test your knowledge of element properties in this challenging quiz game.',
    cost: 50,
    type: 'gameUnlock',
    gameMode: GameMode.ELEMENT_QUIZ,
  },
  {
    id: `game_${GameMode.REACTION_BALANCE}`,
    name: 'Reaction Balance Game',
    description: 'Balance chemical equations by adjusting the coefficients.',
    cost: 75,
    type: 'gameUnlock',
    gameMode: GameMode.REACTION_BALANCE,
  },
  {
    id: `game_${GameMode.ORBITAL_PUZZLE}`,
    name: 'Orbital Puzzle Game',
    description:
      'Learn about electron orbitals by placing electrons according to quantum mechanics rules.',
    cost: 100,
    type: 'gameUnlock',
    gameMode: GameMode.ORBITAL_PUZZLE,
  },
  {
    id: `game_${GameMode.ISOTOPE_BUILDER}`,
    name: 'Isotope Builder Game',
    description: 'Build isotopes by adding the correct number of neutrons to atomic nuclei.',
    cost: 150,
    type: 'gameUnlock',
    gameMode: GameMode.ISOTOPE_BUILDER,
  },
  {
    id: `game_${GameMode.ELECTRON_FLOW}`,
    name: 'Electron Flow Game',
    description: 'Guide electrons through energy levels to complete bonds and reactions.',
    cost: 200,
    type: 'gameUnlock',
    gameMode: GameMode.ELECTRON_FLOW,
  },

  // Hints
  {
    id: 'hint_basic',
    name: 'Basic Hint',
    description: 'Get a hint for the current puzzle',
    cost: 5,
    type: 'hint',
  },
  {
    id: 'hint_detailed',
    name: 'Detailed Hint',
    description: 'Get a comprehensive hint with specific guidance',
    cost: 10,
    type: 'hint',
  },
  {
    id: 'hint_solution',
    name: 'Solution Preview',
    description: 'See the first step of the solution',
    cost: 15,
    type: 'hint',
  },

  // Power-ups
  {
    id: 'powerup_time_boost',
    name: 'Time Extension',
    description: 'Add 30 seconds to timed puzzles',
    cost: 10,
    type: 'powerup',
  },
  {
    id: 'powerup_electron_multiplier',
    name: 'Electron Multiplier',
    description: 'Double electron rewards for the next 3 puzzles',
    cost: 20,
    type: 'powerup',
  },
  {
    id: 'powerup_perfect_bonus',
    name: 'Perfect Bonus Booster',
    description: 'Triple the perfect solve bonus for the next puzzle',
    cost: 15,
    type: 'powerup',
  },

  // Cosmetics
  {
    id: 'cosmetic_theme_neon',
    name: 'Neon Theme',
    description: 'A bright, glowing neon theme for the game',
    cost: 30,
    type: 'cosmetic',
    imageUrl: '/assets/themes/neon-preview.jpg',
  },
  {
    id: 'cosmetic_theme_vintage',
    name: 'Vintage Lab Theme',
    description: 'A classic laboratory theme with a vintage aesthetic',
    cost: 30,
    type: 'cosmetic',
    imageUrl: '/assets/themes/vintage-preview.jpg',
  },
  {
    id: 'cosmetic_avatar_einstein',
    name: 'Einstein Avatar',
    description: 'Use Einstein as your profile avatar',
    cost: 25,
    type: 'cosmetic',
    imageUrl: '/assets/avatars/einstein.jpg',
  },
  {
    id: 'cosmetic_avatar_curie',
    name: 'Marie Curie Avatar',
    description: 'Use Marie Curie as your profile avatar',
    cost: 25,
    type: 'cosmetic',
    imageUrl: '/assets/avatars/curie.jpg',
  },
];

/**
 * Get store items by type
 */
export const getStoreItemsByType = (type: StoreItem['type']): StoreItem[] => {
  return TEST_STORE_ITEMS.filter(item => item.type === type);
};

/**
 * Get store item by ID
 */
export const getStoreItemById = (id: string): StoreItem | undefined => {
  return TEST_STORE_ITEMS.find(item => item.id === id);
};

export default TEST_STORE_ITEMS;
