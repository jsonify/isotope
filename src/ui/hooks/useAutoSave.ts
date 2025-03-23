// src/ui/hooks/useAutoSave.ts

import { useEffect } from 'react';

import { usePlayer } from './usePlayer';
import { PlayerProfileService } from '../../domains/player/services/PlayerProfileService';

/**
 * Hook to automatically save player profile when window/tab is closed
 */
export const useAutoSave = (): void => {
  const { profile } = usePlayer();

  useEffect(() => {
    const profileService = new PlayerProfileService();

    const handleBeforeUnload = (): void => {
      profileService.saveProfile(profile);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return (): void => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [profile]);
};
