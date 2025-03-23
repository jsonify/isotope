// src/ui/components/transitions/ElementContent.tsx
import type { FC } from 'react';

import type {
  ElementUnlockTransition,
  ElementAdvanceTransition,
} from '../../../domains/shared/models/transition-models';

export const ElementUnlockContent: FC<{ data: ElementUnlockTransition }> = ({
  data,
}): JSX.Element => (
  <div className="transition-element-unlock" role="alert" aria-live="assertive">
    <h2>New Element Unlocked!</h2>
    <div className="element-symbol">{data.element}</div>
    <p>You've unlocked a new element in the periodic table!</p>
  </div>
);

export const ElementAdvanceContent: FC<{ data: ElementAdvanceTransition }> = ({
  data,
}): JSX.Element => (
  <div className="transition-element-advance" role="alert" aria-live="assertive">
    <h2>Element Advanced!</h2>
    <div className="element-transition">
      <div className="from-element">{data.fromElement}</div>
      <div className="transition-arrow">→</div>
      <div className="to-element">{data.toElement}</div>
    </div>
    <p>You've advanced to the next element in the periodic table!</p>
  </div>
);
