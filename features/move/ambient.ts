/**
 * PLACEHOLDER — reuses the Breathe light air bed until a Move-specific loop ships.
 */
export const moveAmbient = {
  loop: require('../../audio/sfx/breathe-ambient-placeholder.wav'),
} as const;

/** Soft bed for body-move focus — between Breathe and Ground levels. */
export const MOVE_AMBIENT_VOLUME = 0.1;
