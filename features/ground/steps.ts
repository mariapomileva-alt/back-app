export const groundSequenceIds = ['feetBody', 'fiveSenses', 'lookAround', 'texture'] as const;

export type GroundSequenceId = (typeof groundSequenceIds)[number];

export const defaultGroundSequenceId: GroundSequenceId = 'feetBody';

export function isGroundSequenceId(value: string | null | undefined): value is GroundSequenceId {
  return (
    value === 'feetBody' || value === 'fiveSenses' || value === 'lookAround' || value === 'texture'
  );
}

const feetBodySteps = [
  'ground.steps.feet',
  'ground.steps.toes',
  'ground.steps.weight',
  'ground.steps.support',
  'ground.steps.hands',
  'ground.steps.shoulders',
  'ground.steps.stay',
] as const;

const fiveSensesSteps = [
  'ground.fiveSenses.see',
  'ground.fiveSenses.touch',
  'ground.fiveSenses.hear',
  'ground.fiveSenses.smell',
  'ground.fiveSenses.taste',
  'ground.steps.stay',
] as const;

const lookAroundSteps = [
  'ground.lookAround.see',
  'ground.lookAround.farthest',
  'ground.lookAround.still',
  'ground.lookAround.object',
  'ground.steps.stay',
] as const;

const textureSteps = [
  'ground.texture.notice',
  'ground.texture.find',
  'ground.texture.cool',
  'ground.texture.temp',
  'ground.steps.stay',
] as const;

export const groundSequences: Record<GroundSequenceId, readonly string[]> = {
  feetBody: feetBodySteps,
  fiveSenses: fiveSensesSteps,
  lookAround: lookAroundSteps,
  texture: textureSteps,
};

/** @deprecated Prefer groundSequences.feetBody — kept for existing imports. */
export const groundSteps = feetBodySteps;

export type GroundStepKey = (typeof feetBodySteps)[number];

export function stepsForGroundSequence(id: GroundSequenceId): readonly string[] {
  return groundSequences[id];
}

/** Quiet pacing — long enough to follow, without a counted task. */
export const GROUND_STEP_MS = 10_000;
