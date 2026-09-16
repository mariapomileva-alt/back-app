/**
 * PLACEHOLDER — 20s seamless warm low-mid air/hum bed (regenerate via scripts/generate-breathe-ambient.py).
 * Volume follows the breathing orb in-app; this file stays a steady calm loop.
 */
export const breatheAmbient = {
  loop: require('../../audio/sfx/breathe-ambient-placeholder.wav'),
} as const;

/** Audible bed — still softer than Ground ambient; capped for comfort. */
export const BREATHE_AMBIENT_VOLUME = 0.38;

/** How much openness (orb size) lifts volume above the floor. */
export const BREATHE_AMBIENT_MOD_DEPTH = 0.58;

/** Minimum multiplier at rest (exhale closed). */
export const BREATHE_AMBIENT_MOD_FLOOR = 0.42;

/** Softer modulation when Reduce Motion is on. */
export const BREATHE_REDUCE_MOTION_MOD_DEPTH = 0.12;
export const BREATHE_REDUCE_MOTION_MOD_FLOOR = 0.88;
