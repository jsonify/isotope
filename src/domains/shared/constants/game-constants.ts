// src/domains/shared/constants/game-constants.ts

import type {
  Element,
  ProgressThreshold,
  PlayerProfile,
  ElementSymbol,
} from '../models/domain-models';
import { ElectronSource, GameMode } from '../models/domain-models';

// Periodic Table Data
export const ELEMENTS_DATA: Element[] = [
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
    description: 'A soft, silvery-white alkali metal that is highly reactive.',
  },
  {
    symbol: 'Be',
    name: 'Beryllium',
    atomicNumber: 4,
    atomicWeight: 9.0122,
    period: 2,
    group: 2,
    description: 'A relatively hard, steel-gray, strong, lightweight metal.',
  },
  {
    symbol: 'B',
    name: 'Boron',
    atomicNumber: 5,
    atomicWeight: 10.81,
    period: 2,
    group: 13,
    description: 'A metalloid that is highly unreactive at room temperature.',
  },
  {
    symbol: 'C',
    name: 'Carbon',
    atomicNumber: 6,
    atomicWeight: 12.011,
    period: 2,
    group: 14,
    description: 'The basis for all known life forms, with unique bonding properties.',
  },
  {
    symbol: 'N',
    name: 'Nitrogen',
    atomicNumber: 7,
    atomicWeight: 14.007,
    period: 2,
    group: 15,
    description: "A colorless, odorless gas that makes up about 78% of Earth's atmosphere.",
  },
  {
    symbol: 'O',
    name: 'Oxygen',
    atomicNumber: 8,
    atomicWeight: 15.999,
    period: 2,
    group: 16,
    description: 'A highly reactive nonmetallic element essential for most life forms.',
  },
  {
    symbol: 'F',
    name: 'Fluorine',
    atomicNumber: 9,
    atomicWeight: 18.998,
    period: 2,
    group: 17,
    description: 'The most reactive and electronegative of all elements.',
  },
  {
    symbol: 'Ne',
    name: 'Neon',
    atomicNumber: 10,
    atomicWeight: 20.18,
    period: 2,
    group: 18,
    description: 'An inert noble gas known for its use in illuminated signs.',
  },
  {
    symbol: 'Na',
    name: 'Sodium',
    atomicNumber: 11,
    atomicWeight: 22.99,
    period: 3,
    group: 1,
    description: 'A highly reactive alkali metal that is essential for life.',
  },
  {
    symbol: 'Mg',
    name: 'Magnesium',
    atomicNumber: 12,
    atomicWeight: 24.305,
    period: 3,
    group: 2,
    description: 'A lightweight, silvery-white metal crucial for biological processes.',
  },
  {
    symbol: 'Al',
    name: 'Aluminum',
    atomicNumber: 13,
    atomicWeight: 26.982,
    period: 3,
    group: 13,
    description: 'A lightweight, corrosion-resistant metal widely used in construction.',
  },
  {
    symbol: 'Si',
    name: 'Silicon',
    atomicNumber: 14,
    atomicWeight: 28.085,
    period: 3,
    group: 14,
    description: "A metalloid essential for electronics and Earth's crust.",
  },
  {
    symbol: 'P',
    name: 'Phosphorus',
    atomicNumber: 15,
    atomicWeight: 30.974,
    period: 3,
    group: 15,
    description: 'A highly reactive nonmetal essential for life.',
  },
  {
    symbol: 'S',
    name: 'Sulfur',
    atomicNumber: 16,
    atomicWeight: 32.06,
    period: 3,
    group: 16,
    description: 'A yellow nonmetallic element used in many chemical processes.',
  },
  {
    symbol: 'Cl',
    name: 'Chlorine',
    atomicNumber: 17,
    atomicWeight: 35.45,
    period: 3,
    group: 17,
    description: 'A toxic yellow-green gas used in water treatment.',
  },
  {
    symbol: 'Ar',
    name: 'Argon',
    atomicNumber: 18,
    atomicWeight: 39.948,
    period: 3,
    group: 18,
    description: 'An inert noble gas used in lighting and welding.',
  },
];

// Progression Thresholds
export const PROGRESSION_THRESHOLDS: ProgressThreshold[] = [
  {
    fromElement: 'H',
    toElement: 'He',
    puzzlesRequired: 4,
    unlocksFeature: 'Basic element properties',
  },
  {
    fromElement: 'He',
    toElement: 'Li',
    puzzlesRequired: 6,
    unlocksFeature: 'Period 2 elements',
  },
  {
    fromElement: 'Li',
    toElement: 'Be',
    puzzlesRequired: 6,
    unlocksFeature: 'Alkaline earth metals',
  },
  {
    fromElement: 'Be',
    toElement: 'B',
    puzzlesRequired: 7,
    unlocksFeature: 'Metalloids',
  },
  {
    fromElement: 'B',
    toElement: 'C',
    puzzlesRequired: 7,
    unlocksFeature: 'Carbon chemistry',
  },
  {
    fromElement: 'C',
    toElement: 'N',
    puzzlesRequired: 8,
    unlocksFeature: 'Nitrogen compounds',
  },
  {
    fromElement: 'N',
    toElement: 'O',
    puzzlesRequired: 8,
    unlocksFeature: 'Oxygen bonding',
  },
  {
    fromElement: 'O',
    toElement: 'F',
    puzzlesRequired: 8,
    unlocksFeature: 'Halogen properties',
  },
  {
    fromElement: 'F',
    toElement: 'Ne',
    puzzlesRequired: 9,
    unlocksFeature: 'Noble gases',
  },
  {
    fromElement: 'Ne',
    toElement: 'Na',
    puzzlesRequired: 10,
    unlocksFeature: 'Period 3 elements',
  },
  {
    fromElement: 'Na',
    toElement: 'Mg',
    puzzlesRequired: 10,
    unlocksFeature: 'Metal reactivity',
  },
  {
    fromElement: 'Mg',
    toElement: 'Al',
    puzzlesRequired: 11,
    unlocksFeature: 'Post-transition metals',
  },
  {
    fromElement: 'Al',
    toElement: 'Si',
    puzzlesRequired: 11,
    unlocksFeature: 'Semiconductors',
  },
  {
    fromElement: 'Si',
    toElement: 'P',
    puzzlesRequired: 12,
    unlocksFeature: 'Phosphorus compounds',
  },
  {
    fromElement: 'P',
    toElement: 'S',
    puzzlesRequired: 12,
    unlocksFeature: 'Sulfur chemistry',
  },
  {
    fromElement: 'S',
    toElement: 'Cl',
    puzzlesRequired: 13,
    unlocksFeature: 'Halogen reactions',
  },
  {
    fromElement: 'Cl',
    toElement: 'Ar',
    puzzlesRequired: 14,
    unlocksFeature: 'Noble gas properties',
  },
];

// Electron Rewards Configuration
export const ELECTRON_REWARDS: Record<ElectronSource, number> = {
  [ElectronSource.TUTORIAL_COMPLETION]: 10,
  [ElectronSource.PUZZLE_COMPLETION]: 5,
  [ElectronSource.DAILY_LOGIN]: 3,
  [ElectronSource.ACHIEVEMENT]: 20,
  [ElectronSource.PERFECT_SOLVE]: 5,
};

// Game Mode Unlock Costs
export const GAME_UNLOCK_COSTS: Partial<Record<GameMode, number>> = {
  [GameMode.TUTORIAL]: 0, // Free
  [GameMode.ELEMENT_MATCH]: 0, // Free
  [GameMode.PERIODIC_SORT]: 0, // Free with Li unlocked
  [GameMode.ELECTRON_SHELL]: 0, // Free with Ne unlocked
  [GameMode.COMPOUND_BUILD]: 0, // Free with Ar unlocked
  [GameMode.ELEMENT_QUIZ]: 50,
  [GameMode.REACTION_BALANCE]: 75,
  [GameMode.ORBITAL_PUZZLE]: 100,
  [GameMode.ISOTOPE_BUILDER]: 150,
  [GameMode.ELECTRON_FLOW]: 200,
};

// Period Information
export const PERIOD_INFO: Record<number, { name: string; description: string }> = {
  1: {
    name: 'Period 1',
    description: 'The first period contains only two elements: Hydrogen and Helium.',
  },
  2: {
    name: 'Period 2',
    description: 'The second period contains the elements Lithium through Neon.',
  },
  3: {
    name: 'Period 3',
    description: 'The third period contains the elements Sodium through Argon.',
  },
  // Add more periods as needed
};

// Initial Player Profile
export const INITIAL_PLAYER_PROFILE: Omit<PlayerProfile, 'id'> = {
  displayName: 'New Scientist',
  level: {
    atomicNumber: 0,
    atomicWeight: 0,
    gameLab: 0,
  },
  currentElement: 'H' as ElementSymbol,
  electrons: 0,
  unlockedGames: [GameMode.TUTORIAL],
  achievements: [],
  lastLogin: new Date(),
  tutorialCompleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};
