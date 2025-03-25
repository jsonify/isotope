/***********************************************
 * FILE: src/ui/context/PlayerContext.context.ts
 * CREATED: 2025-03-24 15:32:14
 *
 * PURPOSE:
 * Defines the React context for player profile management
 *****************/

import { createContext } from 'react';

import { PlayerProfileService } from '../../domains/player/services/PlayerProfileService';

interface PlayerContextType {
  profileService: PlayerProfileService;
}

export const PlayerContext = createContext<PlayerContextType>({
  profileService: PlayerProfileService.getInstance(),
});
