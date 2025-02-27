import type { ReactNode } from 'react';

import type { PlayerProfile } from '@/domains/player/models/PlayerProfile';

export interface PlayerContextType {
  profile: PlayerProfile;
  updateProfile: (updates: Partial<PlayerProfile>) => void;
}

export interface PlayerProviderProps {
  children: ReactNode;
}
