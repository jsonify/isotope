import type { PlayerProfile } from '@/domains/player/models/PlayerProfile';

export const INITIAL_PLAYER_PROFILE: PlayerProfile = {
  id: '',
  name: 'Player',
  level: 1,
  experience: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};
