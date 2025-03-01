// import { useState } from 'react';

// import { v4 as uuidv4 } from 'uuid';

// import { PlayerContext } from './PlayerContext.context';
// import type { PlayerProviderProps } from './PlayerContext.types';
// import type { PlayerProfile } from '../../domains/player/models/PlayerProfile';
// import { INITIAL_PLAYER_PROFILE } from '../../domains/shared/constants/game-constants';

// export const PlayerProvider = ({ children }: PlayerProviderProps): JSX.Element => {
//   const [profile, setProfile] = useState(() => ({
//     ...INITIAL_PLAYER_PROFILE,
//     id: uuidv4(),
//   }));

//   const updateProfile = (updates: Partial<PlayerProfile>): void => {
//     setProfile((currentProfile: PlayerProfile) => ({
//       ...currentProfile,
//       ...updates,
//       updatedAt: new Date(),
//     }));
//   };

//   return (
//     <PlayerContext.Provider value={{ profile, updateProfile }}>{children}</PlayerContext.Provider>
//   );
// };
