import {
  allMoveStepIds,
  isMoveStepId,
  moveStepId,
  type MovePhase,
  type MoveSequenceId,
  type MoveStepId,
} from '@/features/move/steps';

export type MoveKineticAction =
  | 'pressFeet'
  | 'pressPalms'
  | 'shoulders'
  | 'tenseRelease'
  | 'hands'
  | 'bodyScan';

export const moveKineticActions = [
  'pressFeet',
  'pressPalms',
  'shoulders',
  'tenseRelease',
  'hands',
  'bodyScan',
] as const satisfies readonly MoveKineticAction[];

export const MOVE_KINETIC_ACTION_BY_SEQUENCE: Record<MoveSequenceId, MoveKineticAction> = {
  fingers: 'hands',
  palms: 'pressPalms',
  shoulders: 'shoulders',
  feet: 'pressFeet',
  bodyScan: 'bodyScan',
  tense: 'tenseRelease',
  hands: 'hands',
};

export type MoveVisualSpec = {
  action: MoveKineticAction;
  phase: MovePhase;
};

/**
 * Step → kinetic action + phase. Never keyed off translated copy.
 */
export const MOVE_VISUAL_MAP: Record<MoveStepId, MoveVisualSpec> = Object.fromEntries(
  allMoveStepIds().map((stepId) => {
    const [sequenceId, phase] = stepId.split('.') as [MoveSequenceId, MovePhase];
    return [
      stepId,
      {
        action: MOVE_KINETIC_ACTION_BY_SEQUENCE[sequenceId],
        phase,
      },
    ] satisfies [MoveStepId, MoveVisualSpec];
  }),
) as Record<MoveStepId, MoveVisualSpec>;

function assertMoveVisualCoverage(): void {
  if (!__DEV__) {
    return;
  }

  for (const stepId of allMoveStepIds()) {
    const spec = MOVE_VISUAL_MAP[stepId];
    if (!spec) {
      throw new Error(`Missing Move visual mapping for stepId "${stepId}"`);
    }
    const expected = moveStepId(stepId.split('.')[0] as MoveSequenceId, spec.phase);
    if (expected !== stepId) {
      throw new Error(`Move visual phase mismatch for "${stepId}"`);
    }
  }
}

assertMoveVisualCoverage();

/** Empty frame if unknown — never the previous or a default illustration. */
export function resolveMoveVisual(stepId: string): MoveVisualSpec | null {
  if (!isMoveStepId(stepId)) {
    if (__DEV__) {
      console.error(`[Move] No illustration mapped for stepId "${stepId}"`);
    }
    return null;
  }
  return MOVE_VISUAL_MAP[stepId];
}
