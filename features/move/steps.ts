export const movePhases = ['press', 'hold', 'release', 'notice'] as const;

export type MovePhase = (typeof movePhases)[number];

export const moveSequenceIds = ['feet', 'palms', 'tense', 'shoulders', 'hands'] as const;

export type MoveSequenceId = (typeof moveSequenceIds)[number];

export type MoveSequence = {
  id: MoveSequenceId;
  pressKey: string;
};

export const defaultMoveSequenceId: MoveSequenceId = 'feet';

export const moveSequences: MoveSequence[] = [
  { id: 'feet', pressKey: 'move.steps.feet' },
  { id: 'palms', pressKey: 'move.steps.palms' },
  { id: 'tense', pressKey: 'move.steps.tense' },
  { id: 'shoulders', pressKey: 'move.steps.shoulders' },
  { id: 'hands', pressKey: 'move.steps.hands' },
];

export const movePhaseKeys: Record<Exclude<MovePhase, 'press'>, string> = {
  hold: 'move.hold',
  release: 'move.release',
  notice: 'move.notice',
};

/** If the body movement is happening without a press, still move forward. */
export const MOVE_PRESS_FALLBACK_MS = 7_000;
export const MOVE_HOLD_MS = 4_000;
export const MOVE_RELEASE_MS = 2_400;
export const MOVE_MIN_HOLD_MS = 900;

export function instructionKeyFor(sequence: MoveSequence, phase: MovePhase): string {
  if (phase === 'press') {
    return sequence.pressKey;
  }
  return movePhaseKeys[phase];
}

export function nextMoveSequenceId(current: MoveSequenceId): MoveSequenceId {
  const index = moveSequences.findIndex((item) => item.id === current);
  const next = moveSequences[(index + 1) % moveSequences.length];
  return next?.id ?? defaultMoveSequenceId;
}
