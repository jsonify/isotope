import { useContext } from 'react';

import { PlayerContext } from '../context/PlayerContext.context';
import type { PlayerContextType } from '../context/PlayerContext.types';

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }

  return context;
};
