# Element Match Game Implementation Plan (Minimum Viable Product)

**Date:** 2025-03-23
**Author:** Roo
**Status:** Approved

## Goal

Implement a simple "Element Match" game mode with minimum viable functionality, adhering to KISS and DRY principles, and using TDD.

## Acceptance Criteria

- [x] Define simple matching mechanic (Direct Element Comparison)
- [x] Create scoring system that awards AW points (Fixed AW points per match)
- [x] Connect completion to progression system (Update player's AW score)

## Proposed Game Mechanic: Direct Element Comparison

1.  **Game Presentation:** Present two randomly selected elements (Atomic Numbers).
2.  **Matching Rule:** Match if the two elements are the same.
3.  **User Interaction:** (Minimal - implicit observation for MVP)
4.  **Outcome:** "Match" if elements are the same, "No Match" if different.
5.  **Scoring:** Fixed AW points awarded for each "Match".

## Implementation Steps

1.  **Define Element Data (Minimal):** Array of Atomic Numbers (ANs).
2.  **Implement Matching Logic (Test-First):**
    - `isMatch(element1, element2)` function: Compares ANs, returns `true` if equal.
    - Unit tests for `isMatch` function.
3.  **Implement Scoring Logic (Test-First):**
    - `calculateScore(isMatch)` function: Returns fixed AW score if `isMatch` is `true`, 0 otherwise.
    - Unit tests for `calculateScore` function.
4.  **Integrate with Progression System (Test-First):**
    - Integration tests to verify AW score update in player profile service.
    - Game logic to call player profile service to update AW score on a match.
5.  **Create Minimal Game Component (UI):**
    - `ElementMatchGame` React component:
      - Randomly selects two elements (ANs).
      - Displays elements (ANs in text).
      - Determines match using `isMatch`.
      - Updates player AW score using scoring and progression logic on a match.
6.  **Write Integration Tests:** Comprehensive tests for end-to-end game flow.

## Confidence Level: 9.5/10

## Next Steps

Switch to Code mode to begin implementation following this plan.

## Related Files

- src/ui/components/PlayerProfileDisplay.tsx
- src/ui/components/GameModeSelection.tsx
- todo-list-phase-2.md
- handoffs/033-element-match-game-transition.md
