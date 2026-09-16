/**
 * PLACEHOLDER — 20s seamless soft brown-noise / air bed, not production studio audio.
 * Volume follows the breathing orb in-app; this file stays a steady calm loop.
 */
export const breatheAmbient = {
  loop: require('../../audio/sfx/breathe-ambient-placeholder.wav'),
} as const;

/** Very light bed — quieter than Ground ambient. */
export const BREATHE_AMBIENT_VOLUME = 0.24;

/** How much openness (orb size) lifts volume above the floor. */
export const BREATHE_AMBIENT_MOD_DEPTH = 0.52;

/** Minimum multiplier at rest (exhale closed). */
export const BREATHE_AMBIENT_MOD_FLOOR = 0.48;

/** Softer modulation when Reduce Motion is on. */
export const BREATHE_REDUCE_MOTION_MOD_DEPTH = 0.12;
export const BREATHE_REDUCE_MOTION_MOD_FLOOR = 0.88;
