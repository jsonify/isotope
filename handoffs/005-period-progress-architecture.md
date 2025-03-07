# Handoff 5: Period-Based Progress Calculations Architecture

## Overview

The period-based progress calculations feature will enhance our AN-AW-GL progression system by providing detailed tracking of player progress within each period of the periodic table. This document outlines the architectural decisions and implementation plan for this feature.

## Current Context

The existing progression system includes:

- AN (Atomic Number) tracking for element progression
- AW (Atomic Weight) tracking for point calculations
- GL (Game Lab) system for game mode unlocks

The `ProgressionService` already has a basic `getPeriodProgress` function that provides:

- Current period identification
- Elements list for the period
- Count of completed elements

## Architectural Decisions

### 1. Progress Calculation Strategy

We will enhance period progress tracking by:

- Maintaining the existing caching system (5-second TTL)
- Adding detailed progress metrics
- Implementing percentage-based progress tracking

### 2. Data Structure

```typescript
interface PeriodProgressData {
  currentPeriod: number;
  elementsInPeriod: ElementSymbol[];
  completedInPeriod: number;
  percentComplete: number; // New
  remainingElements: number; // New
  nextMilestone?: ElementSymbol; // New
}

interface CacheEntry {
  progress: PeriodProgressData;
  timestamp: number;
}
```

### 3. Cache Management

Will continue using the existing cache system with:

- Key format: `period_progress_{playerId}_{currentElement}`
- TTL: 5 seconds
- Automatic invalidation on period advancement

## Implementation Plan

1. **Understand the Requirement**

   - Review existing code and functionality
   - Identify integration points
   - Document expected behavior

2. **Design the Calculation Logic**

   - Define progress calculation formula
   - Determine period completion criteria
   - Plan cache optimization strategy

3. **Implement the Calculation**

   - Extend `getPeriodProgress` functionality
   - Add new progress metrics
   - Optimize for performance

4. **Test the Implementation**

   - Write comprehensive unit tests
   - Test various scenarios and edge cases
   - Validate caching behavior

5. **Integration and Validation**

   - Connect to UI components
   - Test complete progression flow
   - Verify calculations accuracy

6. **Documentation**
   - Update service documentation
   - Document calculation formulas
   - Add implementation notes

## Technical Considerations

### Performance

1. **Caching Strategy**

   - Maintain existing 5-second TTL
   - Clear cache on period advancement
   - Consider lazy loading for large datasets

2. **Calculation Efficiency**
   - Minimize database queries
   - Batch element status updates
   - Cache intermediate results

### Integration Points

1. **UI Integration**

   - Progress bars and indicators
   - Period completion notifications
   - Milestone achievements

2. **Event System**
   - Period progress events
   - Milestone completion events
   - Achievement notifications

### Testing Strategy

1. **Unit Tests**

   - Progress calculation tests
   - Cache behavior tests
   - Edge case validation

2. **Integration Tests**
   - Full progression flow
   - UI update verification
   - Event handling tests

## Next Steps

1. Review and approve architectural decisions
2. Switch to code mode for implementation
3. Create unit tests
4. Implement the feature
5. Document changes
6. Update UI components

## References

- [Progression Service](src/domains/player/services/ProgressionService.ts)
- [Game Constants](src/domains/shared/constants/game-constants.ts)
- [Domain Models](src/domains/shared/models/domain-models.ts)
