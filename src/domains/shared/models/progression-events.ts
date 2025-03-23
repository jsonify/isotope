// src/domains/shared/models/progression-events.ts

import type { GameMode, ElementSymbol } from './domain-models';

// Type guard for strict boolean expressions
function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export enum ProgressionEventType {
  GAME_MODE_UNLOCKED = 'game_mode_unlocked',
  PERIOD_COMPLETED = 'period_completed',
  ELEMENT_ADVANCED = 'element_advanced',
  ATOMIC_WEIGHT_GAINED = 'atomic_weight_gained',
}

export interface BaseProgressionEvent {
  type: ProgressionEventType;
  playerId: string;
  timestamp: number;
}

export interface GameModeUnlockedEvent extends BaseProgressionEvent {
  type: ProgressionEventType.GAME_MODE_UNLOCKED;
  gameMode: GameMode;
  period: number;
}

export interface PeriodCompletedEvent extends BaseProgressionEvent {
  type: ProgressionEventType.PERIOD_COMPLETED;
  periodNumber: number;
  unlockedGameModes: GameMode[];
}

export interface ElementAdvancedEvent extends BaseProgressionEvent {
  type: ProgressionEventType.ELEMENT_ADVANCED;
  fromElement: ElementSymbol;
  toElement: ElementSymbol;
  newPeriod?: number;
}

export interface AtomicWeightGainedEvent extends BaseProgressionEvent {
  type: ProgressionEventType.ATOMIC_WEIGHT_GAINED;
  amount: number;
  totalWeight: number;
  element: ElementSymbol;
}

export type ProgressionEvent =
  | GameModeUnlockedEvent
  | PeriodCompletedEvent
  | ElementAdvancedEvent
  | AtomicWeightGainedEvent;

export type ProgressionEventHandler = (event: ProgressionEvent) => void;

export class ProgressionEventEmitter {
  private static instance: ProgressionEventEmitter | null = null;
  private handlers: ProgressionEventHandler[] = [];

  private constructor() {}

  public static getInstance(): ProgressionEventEmitter {
    if (!isDefined(ProgressionEventEmitter.instance)) {
      ProgressionEventEmitter.instance = new ProgressionEventEmitter();
    }
    return ProgressionEventEmitter.instance;
  }

  public subscribe(handler: ProgressionEventHandler): () => void {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter(h => h !== handler);
    };
  }

  public emit(event: ProgressionEvent): void {
    this.handlers.forEach(handler => handler(event));
  }
}
