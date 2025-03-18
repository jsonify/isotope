# Electron Earning Calculations Implementation

## Context Window 2: Basic Earning Calculations

This micro-handoff details the implementation of basic electron earning calculations, building upon the core ElectronService architecture documented in [019-electron-service-architecture.md](./019-electron-service-architecture.md).

### Tasks Completed

✅ Define calculation formulas

- Created configurable constants for reward calculations
- Implemented multiplier-based formula system
- Defined type-safe difficulty levels

✅ Implement reward algorithms

- Updated calculatePuzzleReward with new formula
- Added comprehensive test coverage
- Integrated with existing ElectronService

### Key Decisions Made

1. **Reward Formula Design**

   ```typescript
   totalReward =
     BASE_REWARD * DIFFICULTY_MULTIPLIERS[difficulty] * (isPerfect ? PERFECT_SOLVE_MULTIPLIER : 1);
   ```

2. **Configuration Constants**

   ```typescript
   const BASE_REWARD = 10;
   const DIFFICULTY_MULTIPLIERS = {
     EASY: 1,
     MEDIUM: 1.5,
     HARD: 2,
   };
   const PERFECT_SOLVE_MULTIPLIER = 1.2;
   ```

3. **Type Safety**
   - Created DifficultyLevel type from DIFFICULTY_MULTIPLIERS keys
   - Updated function signatures for type safety
   - Added fallback handling for invalid difficulty levels

### Implementation Details

1. **Files Created/Modified**

   - Created: src/domains/economy/services/economy-constants.ts
   - Modified: src/domains/economy/services/ElectronService.ts
   - Modified: src/tests/ElectronService.test.ts

2. **Key Components**

   ```typescript
   // Type definition
   export type DifficultyLevel = keyof typeof DIFFICULTY_MULTIPLIERS;

   // Updated reward calculation
   export function calculatePuzzleReward(
     isPerfect: boolean,
     difficulty: DifficultyLevel
   ): RewardResult {
     const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[difficulty];
     const perfectMultiplier = isPerfect ? PERFECT_SOLVE_MULTIPLIER : 1;
     const totalReward = BASE_REWARD * difficultyMultiplier * perfectMultiplier;
     return {
       electrons: Math.round(totalReward),
       progressGain: { atomicWeight: 0 },
     };
   }
   ```

### Test Coverage

1. **New Test Categories**

   - Base reward verification
   - Difficulty multiplier scaling
   - Perfect solve bonus application
   - Combined multiplier effects
   - Edge cases and validation

2. **Test Results**
   - All tests passing
   - Coverage includes all difficulty levels
   - Edge cases properly handled

### Technical Challenges & Solutions

1. **Challenge**: Balancing formula complexity vs maintainability

   - **Solution**: Chose multiplier-based system for easy tuning and clarity

2. **Challenge**: Type safety for difficulty levels

   - **Solution**: Used TypeScript's keyof typeof for automatic type generation

3. **Challenge**: Maintaining precision in calculations
   - **Solution**: Applied rounding only at final step to prevent accumulating errors

### Next Steps

1. **Upcoming Tasks**

   - Implement balance tracking system
   - Add transaction history
   - Connect reward system to game events

2. **Future Considerations**
   - Time-based bonuses
   - Combo rewards
   - Achievement multipliers

### Dependencies

- Core ElectronService functionality (handoff 019)
- TypeScript strict mode
- Vitest for testing

### Notes for Next Developer

1. **Reward Tuning**

   - All reward values are in economy-constants.ts
   - Adjust BASE_REWARD and multipliers to balance difficulty progression
   - Consider adding more difficulty levels as needed

2. **Testing New Features**
   - Follow existing test patterns in ElectronService.test.ts
   - Ensure coverage of edge cases
   - Verify type safety with strict checks
