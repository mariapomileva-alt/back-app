/** Continuous illustration growth while a step is active (Ground, Move, …). End scale = 3× start. */
export const SESSION_VISUAL_SCALE_START = 0.78;
export const SESSION_VISUAL_SCALE_END = SESSION_VISUAL_SCALE_START * 3;
export const SESSION_VISUAL_GROW_MS = 10_000;

/** @deprecated Use SESSION_VISUAL_* — kept for imports. */
export const GROUND_STEP_SCALE_START = SESSION_VISUAL_SCALE_START;
/** @deprecated Use SESSION_VISUAL_* — kept for imports. */
export const GROUND_STEP_SCALE_END = SESSION_VISUAL_SCALE_END;

/** Instruction copy crossfade (reduce motion uses shorter opacity-only). */
export const GROUND_INSTRUCTION_FADE_OUT_MS = 1280;
export const GROUND_INSTRUCTION_FADE_IN_MS = 1680;
export const GROUND_INSTRUCTION_DIM = 0.62;

/** Shared step instruction crossfade (Move, Breathe, etc.). */
export const INSTRUCTION_CROSSFADE_OUT_MS = GROUND_INSTRUCTION_FADE_OUT_MS;
export const INSTRUCTION_CROSSFADE_IN_MS = GROUND_INSTRUCTION_FADE_IN_MS;
export const INSTRUCTION_CROSSFADE_DIM = GROUND_INSTRUCTION_DIM;
export const INSTRUCTION_ENTER_SHIFT_PX = 2;
export const INSTRUCTION_REDUCE_FADE_MS = 160;
/** Pause auto-advance while instruction crossfade finishes. */
export const INSTRUCTION_CROSSFADE_LOCK_MS =
  GROUND_INSTRUCTION_FADE_OUT_MS + GROUND_INSTRUCTION_FADE_IN_MS;
