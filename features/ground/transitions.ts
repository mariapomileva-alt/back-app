/** Continuous illustration growth while a grounding step is active. */
export const GROUND_STEP_SCALE_START = 1;
export const GROUND_STEP_SCALE_END = 1.36;

/** Instruction copy during forward transition (reduce motion uses opacity only). */
export const GROUND_INSTRUCTION_FADE_OUT_MS = 260;
export const GROUND_INSTRUCTION_FADE_IN_MS = 320;
export const GROUND_INSTRUCTION_DIM = 0.38;

/** Shared step instruction crossfade (Move, Breathe, etc.). */
export const INSTRUCTION_CROSSFADE_OUT_MS = GROUND_INSTRUCTION_FADE_OUT_MS;
export const INSTRUCTION_CROSSFADE_IN_MS = GROUND_INSTRUCTION_FADE_IN_MS;
export const INSTRUCTION_CROSSFADE_DIM = GROUND_INSTRUCTION_DIM;
export const INSTRUCTION_ENTER_SHIFT_PX = 6;
export const INSTRUCTION_REDUCE_FADE_MS = 120;
