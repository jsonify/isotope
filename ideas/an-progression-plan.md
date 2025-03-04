# AN Progression Implementation Plan

## 1. Introduction

This document outlines the plan to implement the Atomic Number (AN) progression system for elements in the game. This system will manage how elements advance based on their atomic number and maintain progression state.

## 2. Goals

- Implement correct AN progression calculations based on defined thresholds.
- Ensure AN thresholds are properly enforced for each element level.
- Persist AN state in `PlayerProfile`.
- Trigger appropriate element state updates based on AN changes.
- Handle edge cases: maximum AN level, invalid AN transitions, reset scenarios.

## 3. Codebase Analysis Summary

- **Data Models:**
  - `PlayerProfile` (src/domains/shared/models/domain-models.ts): Contains player-specific data, including `level` (PlayerLevel), `currentElement`, etc.
  - `PlayerLevel` (src/domains/shared/models/domain-models.ts): Defines player progression levels using AN-AW-GL system, including `atomicNumber` and `atomicWeight`.
  - `Element` (src/domains/shared/models/domain-models.ts): Defines element properties, including `atomicNumber`.
  - `ProgressThreshold` (src/domains/shared/models/domain-models.ts): Defines puzzle requirements for element progression.
- **Services:**
  - `PlayerProfileService` (src/domains/player/services/PlayerProfileService.ts): Manages player profile data and persistence.
  - `ProgressionService` (src/domains/player/services/ProgressionService.ts): Already exists and contains logic for element progression, which we will extend.
- **Configuration:**
  - `PROGRESSION_THRESHOLDS` (src/domains/shared/test-data/progression-thresholds.ts): Defines element progression thresholds.
  - `ELEMENTS_DATA` (src/domains/shared/test-data/elements.ts): Contains element data, including atomic numbers.

## 4. Implementation Plan

### 4.1. Enhance `ProgressionService.ts`

- **Modify `advanceElement(profile: PlayerProfile)`:**
  - Reset `atomicWeight` in `playerProfile.level` to 0 after advancing to the next element.
- **Implement `awardAtomicWeight(profile: PlayerProfile, atomicWeightAwarded: number)`:**
  - Update `playerProfile.level.atomicWeight` by adding `atomicWeightAwarded`.
  - Create a new transition using `TransitionService` with `TransitionType.ATOMIC_WEIGHT_AWARDED` to track AW awarding.
  - Check if `canAdvanceElement(profile)` returns true.
  - If true, call `advanceElement(profile)` to handle element progression.

### 4.2. Integrate with `PuzzleService` (or relevant service)

- Identify the service responsible for puzzle completion and reward logic.
- Modify the puzzle completion logic to call `progressionService.awardAtomicWeight()` and award appropriate `atomicWeight` based on puzzle parameters (difficulty, etc. - to be defined).

### 4.3. Testing

- **Unit Tests for `ProgressionService`:**
  - Test `canAdvanceElement` for various scenarios.
  - Test `advanceElement` for correct state updates and transition creation.
  - Test `awardAtomicWeight` for correct AW awarding, progression triggering, and transition creation.
- **Integration Tests:**
  - Test the complete puzzle completion flow, AW awarding, and element progression.

## 5. Areas Affected

- `src/domains/player/services/ProgressionService.ts` (major modifications)
- `src/domains/player/services/PlayerProfileService.ts` (integration)
- `src/domains/puzzle/services/PuzzleService.ts` (or relevant service, integration)
- `src/domains/shared/models/domain-models.ts` (no changes needed, but review for data model understanding)
- `src/domains/shared/test-data/progression-thresholds.ts` (configuration review)
- `src/domains/shared/test-data/elements.ts` (configuration review)

## 6. Edge Cases and Considerations

- **Maximum AN Level:** Handle reaching the maximum element in `ELEMENTS_DATA` and `PROGRESSION_THRESHOLDS`. `advanceElement` already seems to handle this.
- **Invalid AN Transitions:** `canAdvanceElement` and `advanceElement` logic should prevent invalid transitions.
- **Reset/Rollback Scenarios:** `PlayerProfileService` already provides `resetProfile()`. Consider if any specific rollback logic is needed for AN progression (not explicitly requested in the task).

## 7. Next Steps

1.  Get user approval for this plan.
2.  Implement changes in `ProgressionService.ts` as described in section 4.1.
3.  Implement `awardAtomicWeight` integration in `PuzzleService` (or relevant service) as described in section 4.2.
4.  Write unit tests for `ProgressionService`.
5.  Write integration tests for the complete flow.
6.  Test and verify the implementation.

---

Please review this plan and let me know if you have any feedback or changes.
