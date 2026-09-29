import { MovePremiumVisual } from '@/components/move/MovePremiumVisual';
import { MoveVisualFrame } from '@/components/move/MoveVisualFrame';
import type { MovePhase, MoveSequenceId, MoveStepId } from '@/features/move/steps';
import {
  movePremiumVisual,
  movePremiumVisualKey,
} from '@/features/move/premiumVisuals';

type Props = {
  activityId: MoveSequenceId;
  stepId: MoveStepId;
  phase: MovePhase;
  reduceMotion: boolean;
};

export function MoveExerciseIllustration({ stepId, reduceMotion }: Props) {
  const premium = movePremiumVisual(stepId);
  const visualKey = movePremiumVisualKey(stepId);

  return (
    <MoveVisualFrame>
      <MovePremiumVisual
        key={visualKey}
        assets={premium}
        reduceMotion={reduceMotion}
        visualKey={visualKey}
      />
    </MoveVisualFrame>
  );
}

/** @deprecated Use MoveExerciseIllustration */
export const MoveIllustration = MoveExerciseIllustration;
