import type { TransitionEvent, TransitionType, TransitionData } from '../models/transition-models';
import { TransitionState } from '../models/transition-models';

export type TransitionHandler = (event: TransitionEvent) => void;

export class TransitionService {
  private static instance: TransitionService;
  private subscribers: Set<TransitionHandler>;
  private activeTransitions: Map<string, TransitionEvent>;
  private prefersReducedMotion: boolean;

  private constructor() {
    this.subscribers = new Set();
    this.activeTransitions = new Map();
    this.prefersReducedMotion = this.checkReducedMotion();
  }

  public static getInstance(): TransitionService {
    if (TransitionService.instance === undefined || TransitionService.instance === null) {
      TransitionService.instance = new TransitionService();
    }
    return TransitionService.instance;
  }

  private checkReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private generateTransitionId(): string {
    return `transition-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  public subscribe(handler: TransitionHandler): () => void {
    this.subscribers.add(handler);
    return () => this.subscribers.delete(handler);
  }

  private notifySubscribers(event: TransitionEvent): void {
    this.subscribers.forEach(handler => handler(event));
  }

  public createTransition(type: TransitionType, data: TransitionData): TransitionEvent {
    const event: TransitionEvent = {
      id: this.generateTransitionId(),
      type,
      state: TransitionState.PENDING,
      timestamp: new Date(),
      data,
    };

    this.activeTransitions.set(event.id, event);
    this.notifySubscribers(event);

    // If reduced motion is preferred, immediately complete the transition
    if (this.prefersReducedMotion) {
      this.completeTransition(event.id);
    }

    return event;
  }

  public startTransition(transitionId: string): void {
    const event = this.activeTransitions.get(transitionId);
    if (!event) return;

    const updatedEvent = {
      ...event,
      state: TransitionState.ANIMATING,
    };

    this.activeTransitions.set(transitionId, updatedEvent);
    this.notifySubscribers(updatedEvent);
  }

  public completeTransition(transitionId: string): void {
    const event = this.activeTransitions.get(transitionId);
    if (!event) return;

    const updatedEvent = {
      ...event,
      state: TransitionState.COMPLETED,
    };

    this.activeTransitions.delete(transitionId);
    this.notifySubscribers(updatedEvent);
  }

  public getTransition(transitionId: string): TransitionEvent | undefined {
    return this.activeTransitions.get(transitionId);
  }

  public getAllActiveTransitions(): TransitionEvent[] {
    return Array.from(this.activeTransitions.values());
  }

  public clearAllTransitions(): void {
    this.activeTransitions.clear();
  }
}
