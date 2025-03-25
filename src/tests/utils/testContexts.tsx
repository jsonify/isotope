/***********************************************
 * FILE: src/tests/utils/testContexts.tsx
 * CREATED: 2025-03-24 16:24:20
 *
 * PURPOSE:
 * Provides test context utilities and mock providers for testing React components.
 ************************************************/

import { render } from '@testing-library/react';
import { vi } from 'vitest';

import { PlayerProfileService } from '../../domains/player/services/PlayerProfileService';
import { PlayerContext } from '../../ui/context/PlayerContext.context';

class MockProfileService extends PlayerProfileService {
  public constructor(initialScore = 0) {
    super();
    this.awScore = initialScore;
  }

  public getCurrentAWScore = vi.fn().mockImplementation(() => this.awScore);
  public updateAWScore = vi.fn().mockImplementation((points: number) => {
    this.awScore += points;
    return Promise.resolve(this.awScore);
  });
  public resetProfile = vi.fn().mockResolvedValue(true);
  public getProfile = vi.fn().mockImplementation(() =>
    Promise.resolve({
      awScore: this.awScore,
      ...defaultMockData,
    })
  );
  public saveProfile = vi.fn().mockResolvedValue(true);
  public updateProfile = vi.fn().mockResolvedValue(true);
  public addAchievement = vi.fn().mockResolvedValue(true);
  public unlockGameMode = vi.fn().mockResolvedValue(true);
  public updateLevel = vi.fn().mockResolvedValue(true);
  public recordLogin = vi.fn().mockResolvedValue(true);
}

export interface RenderOptions {
  awScore?: number;
  level?: number;
  achievements?: string[];
  unlockedGameModes?: string[];
}

const defaultMockData = {
  level: 1,
  achievements: [] as string[],
  unlockedGameModes: ['basic'],
};

const createMockService = (initialScore = 0): PlayerProfileService => {
  return new MockProfileService(initialScore);
};

export interface RenderResult {
  mockService: PlayerProfileService;
  container: HTMLElement;
  [key: string]: PlayerProfileService | HTMLElement | unknown;
}

export const renderWithMockContext = (
  ui: React.ReactElement,
  options: RenderOptions = {}
): RenderResult => {
  const mockService = createMockService(options.awScore);

  return {
    ...render(
      <PlayerContext.Provider
        value={{
          profileService: mockService,
        }}
      >
        {ui}
      </PlayerContext.Provider>
    ),
    mockService,
  };
};
