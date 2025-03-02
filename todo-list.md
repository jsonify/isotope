# Isotope Development Master Task List

## Phase 1: Foundation (Current Phase)

### Project Setup

- [x] Initialize Vite with React and TypeScript
- [x] Configure absolute imports
- [x] Set up Tailwind CSS v3
- [x] Set up the latest corepack and pnpm
- [x] Configure ESLint v8.56.0 with strict rules
- [x] Set up Prettier
- [x] Create a .gitignore file
- [x] Configure Husky pre-commit hooks
- [x] Set up Vitest and Testing Library
- [x] Set up Vitest in UI mode using pnpm
- [x] Configure Cypress for e2e tests
- [x] Set up GitHub Actions pipeline
- [x] Configure Vercel deployment
- [x] Fix ESLint error in test-utils.ts

### Core Data Models

- [x] Define Element data structure
- [x] Define PlayerProfile interface
- [x] Define PlayerLevel interface
- [x] Define Progression thresholds
- [x] Define Puzzle interfaces
- [x] Define GameMode enum
- [x] Define Economy interfaces
- [ ] Create test data for development

### Player Progression System

- [ ] Implement PlayerProfileService
- [ ] Create element transition logic
- [ ] Implement the AN tracking calculations
- [ ] Implement the AW tracking calculations
- [ ] Implement the GL unlocking system
- [ ] Create period-based progress calculations
- [ ] Implement save/load functionality
- [ ] Write unit tests for progression logic
- [ ] Write integration tests for player advancement

### Economy System (Basic Implementation)

- [ ] Implement simple ElectronService
- [ ] Create transaction history storage
- [ ] Implement basic electron earning mechanisms
- [ ] Connect electron rewards to progression
- [ ] Test and validate core domains

## Phase 2: First Playable Features

### Tutorial Game Mode

- [ ] Implement puzzle generator for Tutorial mode
- [ ] Create the UI for the tutorial
- [ ] Connect tutorial completion to progression
- [ ] Add electron rewards for tutorial
- [ ] Test the full tutorial flow

### Main UI Components

- [ ] Design and implement app layout
- [ ] Create basic navigation system
- [ ] Implement interactive periodic table component
- [ ] Build ProgressBarsModal
- [ ] Create game mode selection interface
- [ ] Implement electron counter with animations
- [ ] Create simple profile display
- [ ] Link all components to state

## Phase 3: Game Expansion

### Element Match Game

- [ ] Implement puzzle generator for Element Match mode
- [ ] Create UI for Element Match
- [ ] Connect to progression system
- [ ] Add difficulty scaling
- [ ] Test and polish

### Full Economy Integration

- [ ] Design store items and pricing
- [ ] Implement Store interface
- [ ] Create electron transaction history UI
- [ ] Build UI for store
- [ ] Implement purchasing functionality
- [ ] Create game unlock purchase flow
- [ ] Test the full economy system

## Phase 4: Additional Game Modes

- [ ] Implement Periodic Sort game
- [ ] Implement Electron Shell game
- [ ] Implement Compound Build game
- [ ] Design remaining game modes for future implementation

## Phase 5: Polish & Deployment

### Polish

- [ ] Add animations and transitions
- [ ] Implement sound effects
- [ ] Create achievement notifications
- [ ] Enhance visual feedback
- [ ] Test on different devices
- [ ] Address accessibility concerns

### Deployment

- [ ] Set up staging environment
- [ ] Configure production environment
- [ ] Set up monitoring and analytics
- [ ] Create deployment checklist
- [ ] Deploy to production
- [ ] Monitor performance and user feedback

## Additional Features (Post-MVP)

- [ ] Implement offline support
- [ ] Add progressive enhancement features
- [ ] Create user guides for onboarding
- [ ] Implement achievement system
- [ ] Add statistics tracking
- [ ] Create social sharing features
- [ ] Build export/import functionality for progress

## Development Best Practices

1. Focus on one task at a time - Complete it fully before moving on
2. Keep the project memory updated with new decisions or changes
3. Commit regularly after completing each task or subtask
4. Test continuously - Write tests before implementation when possible
5. Check progress weekly against the plan and adjust if needed
6. Build vertically - Get one feature working completely rather than doing partial work on multiple features
