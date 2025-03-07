// src/ui/hooks/__tests__/useAutoSave.test.tsx

import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { PlayerProfileService } from '../../../domains/player/services/PlayerProfileService';
import type { PlayerProfile } from '../../../domains/shared/models/domain-models';
import { PlayerContext } from '../../context/PlayerContext.context';
import { useAutoSave } from '../useAutoSave';

// Mock PlayerProfileService
vi.mock('../../../domains/player/services/PlayerProfileService', () => ({
  PlayerProfileService: vi.fn().mockImplementation(() => ({
    saveProfile: vi.fn(),
  })),
}));

describe('useAutoSave', () => {
  let mockProfile: PlayerProfile;
  let mockProfileService: PlayerProfileService;
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;

  beforeEach((): void => {
    // Reset all mocks
    vi.clearAllMocks();

    // Create a mock profile
    mockProfile = {
      id: 'test-id',
      displayName: 'Test User',
      level: {
        atomicNumber: 1,
        atomicWeight: 0,
        gameLab: 0,
      },
      currentElement: 'H',
      electrons: 0,
      unlockedGames: [],
      achievements: [],
      lastLogin: new Date(),
      tutorialCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Set up window event listener spies
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    // Get instance of mocked ProfileService
    mockProfileService = new PlayerProfileService();
  });

  it('should add beforeunload event listener on mount', (): void => {
    // Arrange
    const wrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
      <PlayerContext.Provider
        value={{
          profile: mockProfile,
          updateProfile: vi.fn(),
          resetProfile: vi.fn(),
          isLoading: false,
          error: null,
        }}
      >
        {children}
      </PlayerContext.Provider>
    );

    // Act
    renderHook(() => useAutoSave(), { wrapper });

    // Assert
    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
  });

  it('should remove beforeunload event listener on unmount', (): void => {
    // Arrange
    const wrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
      <PlayerContext.Provider
        value={{
          profile: mockProfile,
          updateProfile: vi.fn(),
          resetProfile: vi.fn(),
          isLoading: false,
          error: null,
        }}
      >
        {children}
      </PlayerContext.Provider>
    );

    // Act
    const { unmount } = renderHook(() => useAutoSave(), { wrapper });
    unmount();

    // Assert
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
  });

  it('should call saveProfile when beforeunload event is triggered', (): void => {
    // Arrange
    const wrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
      <PlayerContext.Provider
        value={{
          profile: mockProfile,
          updateProfile: vi.fn(),
          resetProfile: vi.fn(),
          isLoading: false,
          error: null,
        }}
      >
        {children}
      </PlayerContext.Provider>
    );

    // Act
    renderHook(() => useAutoSave(), { wrapper });

    // Get the beforeunload handler
    const beforeUnloadHandler = addEventListenerSpy.mock.calls[0][1];
    expect(typeof beforeUnloadHandler).toBe('function');

    // Simulate beforeunload event
    (beforeUnloadHandler as () => void)();

    // Assert
    expect(mockProfileService.saveProfile).toHaveBeenCalledTimes(1);
    expect(mockProfileService.saveProfile).toHaveBeenCalledWith(mockProfile);
  });

  it('should recreate event listener when profile changes', (): void => {
    // Arrange
    const wrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
      <PlayerContext.Provider
        value={{
          profile: mockProfile,
          updateProfile: vi.fn(),
          resetProfile: vi.fn(),
          isLoading: false,
          error: null,
        }}
      >
        {children}
      </PlayerContext.Provider>
    );

    // Act
    const { rerender } = renderHook(() => useAutoSave(), { wrapper });

    // Update wrapper with new profile
    rerender();

    // Assert
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
  });
});
