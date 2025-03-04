import type { Achievement, ElementSymbol, GameMode } from './domain-models';

export enum TransitionType {
  ELEMENT_UNLOCK = 'ELEMENT_UNLOCK',
  ELEMENT_ADVANCE = 'ELEMENT_ADVANCE',
  ACHIEVEMENT_UNLOCK = 'ACHIEVEMENT_UNLOCK',
  GAME_MODE_UNLOCK = 'GAME_MODE_UNLOCK',
  PERIOD_COMPLETE = 'PERIOD_COMPLETE',
}

export enum TransitionState {
  PENDING = 'PENDING',
  ANIMATING = 'ANIMATING',
  COMPLETED = 'COMPLETED',
}

export interface TransitionEvent {
  id: string;
  type: TransitionType;
  state: TransitionState;
  timestamp: Date;
  data: TransitionData;
}

export type TransitionData =
  | ElementUnlockTransition
  | ElementAdvanceTransition
  | AchievementUnlockTransition
  | GameModeUnlockTransition
  | PeriodCompleteTransition;

export interface ElementUnlockTransition {
  type: TransitionType.ELEMENT_UNLOCK;
  element: ElementSymbol;
}

export interface ElementAdvanceTransition {
  type: TransitionType.ELEMENT_ADVANCE;
  fromElement: ElementSymbol;
  toElement: ElementSymbol;
  newLevel: {
    atomicNumber: number;
    atomicWeight: number;
  };
}

export interface AchievementUnlockTransition {
  type: TransitionType.ACHIEVEMENT_UNLOCK;
  achievement: Achievement;
}

export interface GameModeUnlockTransition {
  type: TransitionType.GAME_MODE_UNLOCK;
  gameMode: GameMode;
}

export interface PeriodCompleteTransition {
  type: TransitionType.PERIOD_COMPLETE;
  periodNumber: number;
  unlockedGameModes: GameMode[];
}
