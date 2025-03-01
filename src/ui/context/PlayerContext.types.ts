import type { PlayerProfile } from '../../domains/shared/models/domain-models';

export interface PlayerContextType {
  profile: PlayerProfile;
  updateProfile: (updates: Partial<PlayerProfile>) => void;
  resetProfile: () => void;
  isLoading: boolean;
  error: Error | null;
}
