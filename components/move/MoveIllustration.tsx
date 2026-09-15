import { MoveKineticObject } from '@/components/move/MoveKineticObject';
import { MoveVisualFrame } from '@/components/move/MoveVisualFrame';
import type { MovePhase, MoveSequenceId, MoveStepId } from '@/features/move/steps';
import { resolveMoveVisual } from '@/features/move/visualMap';

type Props = {
  activityId: MoveSequenceId;
  stepId: MoveStepId;
  phase: MovePhase;
  reduceMotion: boolean;
};

export function MoveExerciseIllustration({ activityId, stepId, phase, reduceMotion }: Props) {
  void activityId;
  void phase;
  const spec = resolveMoveVisual(stepId);

  return (
    <MoveVisualFrame>
      {spec ? (
        <MoveKineticObject action={spec.action} phase={spec.phase} reduceMotion={reduceMotion} />
      ) : null}
    </MoveVisualFrame>
  );
}

/** @deprecated Use MoveExerciseIllustration */
export const MoveIllustration = MoveExerciseIllustration;
