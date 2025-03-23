# Game Lab (GL) System Documentation

The Game Lab (GL) system is the third component of the AN-AW-GL progression tracking system, responsible for managing game mode unlocks as players advance through periods in the periodic table.

## Core Components

### ProgressionService

The `ProgressionService` manages game mode unlocks through several key methods:

```typescript
unlockPeriodGames(profile: PlayerProfile, period?: number): PlayerProfile
getGameModesForPeriod(period: number): { mode: GameMode; info: GameModeInfo }[]
handlePeriodAdvancement(profile: PlayerProfile, ...): PlayerProfile
```

### Caching System

Period progress calculations are cached to optimize performance:

- Cache TTL: 5 seconds
- Cache key format: `period_progress_{playerId}_{currentElement}`
- Cache is automatically cleared on period advancement

### Period Progress Calculation

The service tracks detailed period progress through the `PeriodProgressData` interface:

```typescript
interface PeriodProgressData {
  currentPeriod: number; // Current period number
  elementsInPeriod: string[]; // Symbols of all elements in the period
  completedInPeriod: number; // Number of completed elements
  percentComplete: number; // Percentage completion (0-100)
  remainingElements: number; // Number of elements left to complete
  nextMilestone?: string; // Next element to unlock (if any)
}
```

Progress calculations include:

- Period-specific element tracking
- Completion percentage
- Remaining elements counter
- Next milestone identification

The calculations are cached for 5 seconds to optimize performance.

### Event System

The GL system emits events for important state changes:

1. Game Mode Unlocked

```typescript
{
  type: ProgressionEventType.GAME_MODE_UNLOCKED,
  playerId: string,
  gameMode: GameMode,
  period: number,
  timestamp: number
}
```

2. Period Completed

```typescript
{
  type: ProgressionEventType.PERIOD_COMPLETED,
  playerId: string,
  periodNumber: number,
  unlockedGameModes: GameMode[],
  timestamp: number
}
```

## Game Mode Progression

### Period-Based Unlocks

Games are unlocked based on the player's current period:

- Period 1: Tutorial, Element Match
- Period 2: Periodic Sort, Electron Shell
- Period 3: Compound Build, Element Quiz
- Period 4: Reaction Balance
- Period 5: Orbital Puzzle
- Period 6: Isotope Builder
- Period 7: Electron Flow

### Unlock Requirements

Each game mode has specific requirements:

1. Tutorial and Element Match

   - Available from the start
   - No electron cost

2. Periodic Sort and Electron Shell

   - Unlocked in Period 2
   - Requires completing Lithium (Li)

3. Advanced Games (Period 3+)
   - Unlock progressively with period advancement
   - Some require electron purchases

## Integration Example

```typescript
// Subscribe to game mode unlock events
const eventEmitter = ProgressionEventEmitter.getInstance();
eventEmitter.subscribe(event => {
  if (event.type === ProgressionEventType.GAME_MODE_UNLOCKED) {
    // Handle new game mode unlock
    console.log(`Unlocked: ${event.gameMode} in period ${event.period}`);
  }
});

// Check available games for a period
const progressionService = new ProgressionService();
const periodGames = progressionService.getGameModesForPeriod(2);
```

## Performance Considerations

1. **Caching**

   - Period progress calculations are cached
   - Cache is automatically invalidated on relevant state changes
   - TTL prevents stale data

2. **Event System**
   - Events are emitted asynchronously
   - Handlers should be lightweight to prevent blocking

## Testing

The GL system includes comprehensive tests:

1. Period progression tests
2. Game mode unlocking tests
3. Event emission tests
4. Cache behavior tests

Run tests with:

```bash
pnpm test ProgressionService
```
