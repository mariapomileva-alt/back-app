export const groundSteps = [
  'ground.steps.feet',
  'ground.steps.toes',
  'ground.steps.weight',
  'ground.steps.support',
  'ground.steps.hands',
  'ground.steps.shoulders',
  'ground.steps.stay',
] as const;

export type GroundStepKey = (typeof groundSteps)[number];

/** Quiet pacing — long enough to follow, without a counted task. */
export const GROUND_STEP_MS = 10_000;
