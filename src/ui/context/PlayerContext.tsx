// src/ui/context/PlayerContext.tsx
import type { ReactNode } from 'react';
import { useState, useEffect, useMemo } from 'react';

import { PlayerContext } from './PlayerContext.context';
import type { PlayerContextType } from './PlayerContext.types';
import { PlayerProfileService } from '../../domains/player/services/PlayerProfileService';
import type { PlayerProfile } from '../../domains/shared/models/domain-models';

interface PlayerProviderProps {
  children: ReactNode;
}

// Creating a separate hook for profile management to reduce lines in PlayerProvider
const useProfileManagement = (): PlayerContextType => {
  const profileService = useMemo(() => new PlayerProfileService(), []);
  const [profile, setProfile] = useState<PlayerProfile>(profileService.getProfile());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load the profile when the component mounts
  useEffect(() => {
    try {
      const loadedProfile = profileService.recordLogin();
      setProfile(loadedProfile);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load profile'));
    } finally {
      setIsLoading(false);
    }
  }, [profileService]);

  // Update the profile
  const updateProfile = (updates: Partial<PlayerProfile>): void => {
    try {
      const updatedProfile = profileService.updateProfile(updates);
      setProfile(updatedProfile);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update profile'));
    }
  };

  // Reset the profile
  const resetProfile = (): void => {
    try {
      const newProfile = profileService.resetProfile();
      setProfile(newProfile);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to reset profile'));
    }
  };

  return {
    profile,
    updateProfile,
    resetProfile,
    isLoading,
    error,
  };
};

export function PlayerProvider({ children }: PlayerProviderProps): JSX.Element {
  const profileManagement = useProfileManagement();

  return <PlayerContext.Provider value={profileManagement}>{children}</PlayerContext.Provider>;
}
