# Project State Handoff

## Project Overview

Isotope is an educational puzzle game that teaches chemistry through interactive gameplay using the periodic table. The project follows a domain-driven design architecture with React and TypeScript.

## Project Structure

### Core Domains

1. **Player Domain**

   - Player profiles with progression tracking
   - Level system based on atomic numbers and weights
   - Achievement and reward system

2. **Puzzle Domain**

   - Multiple game modes (9 different types)
   - Difficulty scaling system
   - Progress tracking per puzzle

3. **Economy Domain**

   - Electron-based currency system
   - Store items and transactions
   - Multiple reward sources

4. **Shared Domain**
   - Common models and utilities
   - Element-related types and interfaces
   - Configuration models

### Technical Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Testing**: Vitest and Cypress
- **Code Quality**: ESLint, Prettier, Husky

## Implemented Features

### 1. Element System

- Comprehensive element type system
- Support for first 20 elements (H to Ca)
- Element properties including atomic number, weight, period, and group

### 2. Player Progression

- AN-AW-GL tracking system:
  - Atomic Number (AN): Overall progression
  - Atomic Weight (AW): Puzzle completion tracking
  - Game Lab (GL): Game mode unlocks

### 3. Game Modes

```typescript
enum GameMode {
  TUTORIAL = 0,
  ELEMENT_MATCH = 1,
  PERIODIC_SORT = 2,
  ELECTRON_SHELL = 3,
  COMPOUND_BUILD = 4,
  ELEMENT_QUIZ = 5,
  REACTION_BALANCE = 6,
  ORBITAL_PUZZLE = 7,
  ISOTOPE_BUILDER = 8,
  ELECTRON_FLOW = 9,
}
```

### 4. Economy System

- Electron-based currency
- Multiple earning sources (tutorials, puzzles, daily login, achievements)
- Store system with various item types

## Work in Progress

### 1. UI Implementation

- Basic layout with header and main content
- Transition system being developed
- Player info component implementation

### 2. Testing Infrastructure

- E2E testing with Cypress
- Unit testing with Vitest
- Test utils and setup files in place

## Design Decisions

### 1. Architecture

- Domain-driven design for clear separation of concerns
- Context-based state management
- Shared models for cross-domain types

### 2. Game Progression

- Element-based progression system
- Period-based game mode unlocks
- Difficulty scaling based on atomic numbers

### 3. Development Practices

- Strict TypeScript usage
- Comprehensive linting rules
- Git hooks for code quality

## Next Steps

1. Complete the transition system implementation
2. Implement remaining game modes
3. Add more comprehensive testing
4. Develop the store interface
5. Implement save/load functionality

## Technical Debt

- Some placeholder components need proper implementation
- Test coverage needs improvement
- Documentation for game modes needed
