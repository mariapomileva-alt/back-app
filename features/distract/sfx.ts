/**
 * PLACEHOLDER SFX — dev-generated tones, not production studio audio.
 * Replace catch-tap / blocks-clear wavs before store release if needed.
 */
export const distractSfx = {
  catchTap: require('../../audio/sfx/catch-tap-placeholder.wav'),
  blocksClear: require('../../audio/sfx/blocks-clear-placeholder.wav'),
} as const;

/** Quiet one-shots; Listen uses a separate volume preference. */
export const DISTRACT_SFX_VOLUME = 0.32;
