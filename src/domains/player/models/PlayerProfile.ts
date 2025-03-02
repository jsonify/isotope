export interface PlayerProfile {
  id: string;
  name: string;
  level: number;
  experience: number;
  createdAt: Date;
  updatedAt: Date;
}

// // Core entities
// interface PlayerProfile {
//   id: string;
//   level: PlayerLevel;
//   currentElement: ElementSymbol;
//   electrons: number;
//   unlockedGames: number[];
//   achievements: Achievement[];
//   lastLogin: Date;
//   tutorialCompleted: boolean;
// }

// interface PlayerLevel {
//   atomicNumber: number;  // 0-999
//   atomicWeight: number;  // 0-999
//   gameLab: number;      // 0-999
// }

// // Progress tracking service
// class ProgressionService {
//   advanceElement(profile: PlayerProfile): PlayerProfile;
//   calculateRequiredPuzzles(currentElement: ElementSymbol): number;
//   isGameModeUnlocked(profile: PlayerProfile, gameMode: number): boolean;
//   unlockGameMode(profile: PlayerProfile, gameMode: number): PlayerProfile;
// }
