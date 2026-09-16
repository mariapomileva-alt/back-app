/**
 * PLACEHOLDER SFX — dev-generated tones, not production studio audio.
 * Replace wavs before store release if needed.
 */
export const distractSfx = {
  catchTap: require('../../audio/sfx/catch-tap-placeholder.wav'),
  blocksClear: require('../../audio/sfx/blocks-clear-placeholder.wav'),
  shapesCorrect: require('../../audio/sfx/shapes-correct-placeholder.wav'),
  snakeFood: require('../../audio/sfx/snake-food-placeholder.wav'),
} as const;

/** Quiet one-shots; Listen uses a separate volume preference. */
export const DISTRACT_SFX_VOLUME = 0.32;

/** Catch tap is softer than other distract cues. */
export const CATCH_TAP_SFX_VOLUME = 0.28;

export const SHAPES_CORRECT_SFX_VOLUME = 0.2;

export const SNAKE_FOOD_SFX_VOLUME = 0.24;
