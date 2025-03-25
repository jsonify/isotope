/***********************************************
 * FILE: src/tests/utils/testUtils.tsx
 * CREATED: 2025-03-24 15:55:34
 *
 * PURPOSE:
 * This file provides test utility functions for wrapping components
 * with PlayerContext and other common test setup needs.
 *
 * METHODS:
 * - createPlayerContextWrapper(): Creates a wrapper component with PlayerContext
 * - renderWithPlayerContext(): Renders a component with PlayerContext and custom values
 ************************************************/

import type { ReactNode } from 'react';

import { render } from '@testing-library/react';
import { vi } from 'vitest';

// Mock PlayerProfileService
vi.mock('../../domains/player/services/PlayerProfileService', () => ({
  PlayerProfileService: {
    getInstance: vi.fn(() => ({
      getCurrentAWScore: vi.fn(),
      updateAWScore: vi.fn(),
      resetProfile: vi.fn(),
    })),
  },
}));

// Import after mock to avoid circular dependencies
import { PlayerProfileService } from '../../domains/player/services/PlayerProfileService';
import { GameMode } from '../../domains/shared/models/domain-models';
import { PlayerContext } from '../../ui/context/PlayerContext.context';

/**
 * Creates a wrapper component with PlayerContext for testing
 * @param children Components to wrap
 * @returns JSX.Element with PlayerContext.Provider
 */
export function createPlayerContextWrapper({ children }: { children: ReactNode }): JSX.Element {
  const mockService = PlayerProfileService.getInstance();

  return (
    <PlayerContext.Provider
      value={{
        profileService: mockService,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

/**
 * Options for renderWithPlayerContext
 */
export interface RenderWithContextOptions {
  awScore?: number;
  level?: number;
  achievements?: string[];
  unlockedGameModes?: string[];
}

/**
 * Renders a component wrapped in PlayerContext.Provider with custom values
 */
export async function renderWithPlayerContext(
  ui: React.ReactElement,
  options: RenderWithContextOptions = {}
): Promise<ReturnType<typeof render>> {
  const mockService = PlayerProfileService.getInstance();
  vi.mocked(mockService.resetProfile).mockResolvedValue({
    success: true,
    profile: {
      id: '123',
      displayName: 'Test User',
      level: { atomicNumber: 1, atomicWeight: 0, gameLab: 1 },
      currentElement: 'H',
      electrons: 0,
      unlockedGames: [GameMode.TUTORIAL],
      achievements: [],
      tutorialCompleted: false,
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  if (options.awScore !== undefined) {
    vi.mocked(mockService.getCurrentAWScore).mockReturnValue(options.awScore);
    vi.mocked(mockService.updateAWScore).mockResolvedValue(options.awScore);
  }

  const result = render(ui, {
    wrapper: ({ children }) => (
      <PlayerContext.Provider
        value={{
          profileService: mockService,
        }}
      >
        {children}
      </PlayerContext.Provider>
    ),
  });

  return result;
}
