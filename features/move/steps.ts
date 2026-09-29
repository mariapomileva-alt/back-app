export const movePhases = ['press', 'hold', 'release', 'notice'] as const;

export type MovePhase = (typeof movePhases)[number];

/** Default long-form Move session: each part runs press → hold → release → notice, then continues. */
export const moveSustainedSequenceIds = ['fingers', 'palms', 'shoulders', 'feet', 'bodyScan'] as const;

export type MoveSustainedSequenceId = (typeof moveSustainedSequenceIds)[number];

export const moveSequenceIds = [...moveSustainedSequenceIds, 'tense', 'hands'] as const;

export type MoveSequenceId = (typeof moveSequenceIds)[number];

export type MoveSequence = {
  id: MoveSequenceId;
  pressKey: string;
};

export const defaultMoveSequenceId: MoveSequenceId = moveSustainedSequenceIds[0];

export const moveSequences: MoveSequence[] = [
  { id: 'fingers', pressKey: 'move.steps.fingers' },
  { id: 'palms', pressKey: 'move.steps.palms' },
  { id: 'shoulders', pressKey: 'move.steps.shoulders' },
  { id: 'feet', pressKey: 'move.steps.feet' },
  { id: 'bodyScan', pressKey: 'move.steps.bodyScan' },
  { id: 'tense', pressKey: 'move.steps.tense' },
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

/** Rest on notice before the next body part (final notice has no auto-advance). */
export const MOVE_NOTICE_DWELL_MS = 4_500;

/** Full passes through {@link moveSustainedSequenceIds} before the session rests on the last notice. */
export const MOVE_SUSTAINED_LAPS = 2;

export type MoveStepId = `${MoveSequenceId}.${MovePhase}`;

export function moveStepId(sequenceId: MoveSequenceId, phase: MovePhase): MoveStepId {
  return `${sequenceId}.${phase}`;
}

export function allMoveStepIds(): MoveStepId[] {
  return moveSequenceIds.flatMap((sequenceId) => movePhases.map((phase) => moveStepId(sequenceId, phase)));
}

export function isMoveStepId(value: string | null | undefined): value is MoveStepId {
  return allMoveStepIds().some((id) => id === value);
}

export function instructionKeyFor(sequence: MoveSequence, phase: MovePhase): string {
  if (phase === 'press') {
    return sequence.pressKey;
  }
  return movePhaseKeys[phase];
}

export function isMoveSequenceId(value: string | null | undefined): value is MoveSequenceId {
  return moveSequenceIds.some((id) => id === value);
}

export function nextMoveSequenceId(current: MoveSequenceId): MoveSequenceId {
  const index = moveSequences.findIndex((item) => item.id === current);
  const next = moveSequences[(index + 1) % moveSequences.length];
  return next?.id ?? defaultMoveSequenceId;
}

export function isMoveSustainedSequenceId(
  value: MoveSequenceId,
): value is MoveSustainedSequenceId {
  return moveSustainedSequenceIds.some((id) => id === value);
}

export function isMoveSustainedSessionComplete(sequenceId: MoveSequenceId, lap: number): boolean {
  const last = moveSustainedSequenceIds[moveSustainedSequenceIds.length - 1];
  return sequenceId === last && lap >= MOVE_SUSTAINED_LAPS - 1;
}

export type MoveSustainedAdvance = {
  sequenceId: MoveSequenceId;
  lap: number;
};

/** Next segment after notice, or null when the sustained session is finished. */
export function nextAfterMoveNotice(
  sequenceId: MoveSequenceId,
  lap: number,
): MoveSustainedAdvance | null {
  if (isMoveSustainedSessionComplete(sequenceId, lap)) {
    return null;
  }

  const sustainedIndex = moveSustainedSequenceIds.indexOf(
    sequenceId as MoveSustainedSequenceId,
  );

  if (sustainedIndex === -1) {
    return { sequenceId: moveSustainedSequenceIds[0], lap };
  }

  if (sustainedIndex < moveSustainedSequenceIds.length - 1) {
    return { sequenceId: moveSustainedSequenceIds[sustainedIndex + 1]!, lap };
  }

  return { sequenceId: moveSustainedSequenceIds[0], lap: lap + 1 };
}
