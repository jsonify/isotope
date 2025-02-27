import { createContext, useContext, useState, ReactNode } from 'react';
import { PlayerProfile } from '@/domains/player/models/PlayerProfile';
import { INITIAL_PLAYER_PROFILE } from '@/domains/shared/constants/game-constants';
import { v4 as uuidv4 } from 'uuid';

interface PlayerContextType {
  profile: PlayerProfile;
  updateProfile: (updates: Partial<PlayerProfile>) => void;
  isLoading: boolean;
  error: Error | null;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

interface PlayerProviderProps {
  children: ReactNode;
}

export function PlayerProvider({ children }: PlayerProviderProps) {
  // Create a player profile with a unique ID
  const [profile, setProfile] = useState<PlayerProfile>({
    ...INITIAL_PLAYER_PROFILE,
    id: uuidv4(),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateProfile = (updates: Partial<PlayerProfile>) => {
    setProfile(currentProfile => ({
      ...currentProfile,
      ...updates,
      updatedAt: new Date(),
    }));
  };

  return (
    <PlayerContext.Provider value={{ profile, updateProfile, isLoading, error }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
