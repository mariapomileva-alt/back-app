/** Scale-up before advancing to the next grounding instruction. */
export const GROUND_FORWARD_SCALE_MS = 520;
export const GROUND_FORWARD_SCALE_PEAK = 1.08;

/** Soft reset after the step key updates. */
export const GROUND_FORWARD_RESET_MS = 180;

/** Optional mild shrink when going to the previous step. */
export const GROUND_BACK_SCALE_MS = 240;
export const GROUND_BACK_SCALE_DIP = 0.97;

/** Instruction copy during forward transition (reduce motion uses opacity only). */
export const GROUND_INSTRUCTION_FADE_OUT_MS = 260;
export const GROUND_INSTRUCTION_FADE_IN_MS = 320;
export const GROUND_INSTRUCTION_DIM = 0.38;
