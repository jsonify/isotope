// src/ui/components/transitions/AchievementContent.tsx
import type { FC } from 'react';

import type { AchievementUnlockTransition } from '../../../domains/shared/models/transition-models';

export const AchievementUnlockContent: FC<{ data: AchievementUnlockTransition }> = ({
  data,
}): JSX.Element => (
  <div className="transition-achievement" role="alert" aria-live="assertive">
    <h2>Achievement Unlocked!</h2>
    <div className="achievement-name">{data.achievement.name}</div>
    <p>{data.achievement.description}</p>
    {data.achievement.electronReward !== null &&
      data.achievement.electronReward !== undefined &&
      data.achievement.electronReward > 0 && (
        <div className="electron-reward">+{data.achievement.electronReward} Electrons</div>
      )}
  </div>
);
