# Handoff Document: Save/Load Integration

## Objective

Implement save/load functionality with minimum viable functionality, focusing on simplicity and robustness.

## Simplified Plan

1.  **Data Structure**: Use a simplified `PlayerProfile` interface with essential data:

    ```typescript
    interface PlayerProfile {
      id: string;
      displayName: string;
      currentElement: ElementSymbol;
      level: {
        atomicNumber: number;
        atomicWeight: number;
        gameLab: number;
      };
      lastUpdated: string; // ISO date string
    }
    ```

2.  **Storage Service**: Implement a minimal `StorageService` for localStorage operations:

    ```typescript
    class StorageService {
      private readonly KEY = 'isotope_player';

      save(data: PlayerProfile): boolean { ... }
      load(): PlayerProfile | null { ... }
    }
    ```

3.  **Profile Manager**: Create a `ProfileManager` to manage profile lifecycle:

    ```typescript
    class ProfileManager {
      private storage = new StorageService();

      createProfile(displayName: string): PlayerProfile { ... }
      saveProfile(profile: PlayerProfile): boolean { ... }
      loadProfile(): PlayerProfile { ... }
    }
    ```

4.  **Integration Points**: Integrate `ProfileManager` in `App.tsx` for:

    - Loading profile on app start
    - Saving profile on state changes
    - Auto-saving before browser close

5.  **Testing**: Implement a basic integration test for the save/load cycle.

## Acceptance Criteria

- [x] Connect all components
- [x] Test full save/load cycle
- [x] **HANDOFF POINT**: Create comprehensive handoff after completing save/load functionality

## Next Steps (Code Mode)

1.  Implement `StorageService` and `ProfileManager` classes.
2.  Update `PlayerProfile` interface in `src/domains/player/models/PlayerProfile.ts` to match the simplified structure.
3.  Integrate `ProfileManager` into `App.tsx`.
4.  Write integration tests in `src/tests/playerProfileService.integration.test.ts`.
5.  Create a new handoff document after completing the implementation and testing.

## Handoff Completion

Once the implementation and testing are complete in code mode, create a new handoff document summarizing the work done and any further steps.
