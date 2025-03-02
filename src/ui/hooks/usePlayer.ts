import { useContext } from 'react';

import { PlayerContext } from '../context/PlayerContext.context';
import type { PlayerContextType } from '../context/PlayerContext.types';

export function usePlayer(): PlayerContextType {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
