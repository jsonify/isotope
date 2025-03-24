# AW (Atomic Weight) Tracking Implementation Handoff

## Overview

Implementation of the Atomic Weight (AW) tracking system, which measures puzzle completion progress as part of the AN-AW-GL progression system. This system tracks player advancement through puzzles required to progress to the next element.

## System Context

- Part of the AN-AW-GL tracking system in PlayerLevel
- AN (Atomic Number) tracking is already implemented
- AW is used specifically for puzzle completion tracking
- Resets when advancing to a new element

## Technical Requirements

### Data Model Integration

```typescript
interface PlayerLevel {
  atomicNumber: number; // Already implemented
  atomicWeight: number; // Primary focus
  gameLab: number; // To be implemented later
}
```

### Progress Tracking Requirements

1. Track puzzles completed toward next element
2. Reset AW when advancing to new element
3. Integrate with ProgressThreshold system
4. Support multiple game modes' contributions

### Key Interfaces

#### Progress Updates

```typescript
interface RewardResult {
  progressGain: {
    atomicWeight: number; // Amount to increment AW
    atomicNumber?: number; // Optional AN advancement
    gameLab?: number; // Optional GL changes
  };
  // ... other reward properties
}
```

#### Progress Tracking

```typescript
interface PlayerProgress {
  puzzlesCompletedTowardNext: number; // Current AW progress
  puzzlesRequiredForNext: number; // AW threshold for next element
  percentToNextElement: number; // Progress calculation
}
```

## Implementation Guidelines

### Core Functionality

1. Track AW Points:

   - Base points from puzzle completion
   - Bonus points for perfect solves
   - Different weights for different game modes

2. Progress Calculations:

   - Track current AW vs threshold
   - Calculate percentage to next element
   - Handle element transitions

3. Reset Mechanics:
   - Reset AW when advancing to new element
   - Preserve historical completion data
   - Handle partial progress

### Integration Points

1. Player Profile Service:

   - Update AW tracking methods
   - Add AW reset functionality
   - Implement progress calculations

2. Puzzle Service:

   - Add AW reward calculations
   - Integrate with difficulty scaling
   - Update completion handlers

3. Progress Thresholds:
   - Connect with elementThresholds config
   - Implement threshold validation
   - Handle period transitions

## Testing Requirements

1. Unit Tests:

   - AW point calculations
   - Progress percentage computation
   - Reset functionality
   - Threshold validation

2. Integration Tests:
   - Full progression cycle
   - Multiple game mode contributions
   - Element advancement
   - Period transitions

## Technical Considerations

### Edge Cases

1. Multiple puzzles completed simultaneously
2. Perfect vs normal completion rewards
3. Different game mode weightings
4. Period boundary transitions

### Performance

1. Optimize progress calculations
2. Efficient storage of completion data
3. Minimize unnecessary recomputation

## Implementation Steps

1. Core Implementation:

   - Add AW tracking methods to PlayerProfileService
   - Implement basic point calculation
   - Add reset functionality

2. Progress Management:

   - Implement progress threshold checking
   - Add advancement validation
   - Create progress calculation utilities

3. Integration:

   - Connect to puzzle completion system
   - Integrate with AN tracking
   - Add game mode weighting

4. Testing & Validation:
   - Write comprehensive test suite
   - Validate edge cases
   - Test full progression cycle

## Files to Modify

1. Player Domain:

   - `src/domains/player/services/PlayerProfileService.ts`
   - `src/domains/player/models/PlayerProfile.ts`

2. Puzzle Domain:

   - `src/domains/puzzle/services/PuzzleService.ts`
   - `src/domains/puzzle/models/PuzzleProgress.ts`

3. Shared Domain:
   - `src/domains/shared/models/domain-models.ts`
   - `src/domains/shared/utils/progress-calculations.ts`

## Success Criteria

1. Functional Requirements:

   - AW accurately tracks puzzle completion
   - Progress calculations are correct
   - Element transitions work properly
   - Game mode weights are applied correctly

2. Technical Requirements:
   - All tests pass
   - No performance degradation
   - Clean integration with AN tracking
   - Proper error handling

## Notes

- Build on existing AN tracking implementation
- Maintain vertical slice approach
- Consider future GL implementation requirements
- Document all progression formulas
