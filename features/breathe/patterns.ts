export type BreathPatternId = 'gentle' | 'equal' | 'box';

export type BreathPhase = 'inhale' | 'exhale' | 'hold';

export type BreathStep = {
  phase: BreathPhase;
  durationMs: number;
  target: 'rest' | 'open';
};

export type BreathPattern = {
  id: BreathPatternId;
  nameKey: string;
  steps: BreathStep[];
};

export const defaultBreathPatternId: BreathPatternId = 'gentle';

export const breathPatterns: BreathPattern[] = [
  {
    id: 'gentle',
    nameKey: 'breathe.patterns.gentle',
    steps: [
      { phase: 'inhale', durationMs: 4000, target: 'open' },
      { phase: 'exhale', durationMs: 6000, target: 'rest' },
    ],
  },
  {
    id: 'equal',
    nameKey: 'breathe.patterns.equal',
    steps: [
      { phase: 'inhale', durationMs: 4000, target: 'open' },
      { phase: 'exhale', durationMs: 4000, target: 'rest' },
    ],
  },
  {
    id: 'box',
    nameKey: 'breathe.patterns.box',
    steps: [
      { phase: 'inhale', durationMs: 4000, target: 'open' },
      { phase: 'hold', durationMs: 4000, target: 'open' },
      { phase: 'exhale', durationMs: 4000, target: 'rest' },
      { phase: 'hold', durationMs: 4000, target: 'rest' },
    ],
  },
];

export function isBreathPatternId(value: string | null): value is BreathPatternId {
  return value === 'gentle' || value === 'equal' || value === 'box';
}

export function getBreathPattern(id: BreathPatternId): BreathPattern {
  return breathPatterns.find((pattern) => pattern.id === id) ?? breathPatterns[0]!;
}

export function cueKeyForPhase(phase: BreathPhase): string {
  if (phase === 'inhale') {
    return 'breathe.inhale';
  }
  if (phase === 'exhale') {
    return 'breathe.exhale';
  }
  return 'breathe.hold';
}

export function cycleDurationMs(pattern: BreathPattern): number {
  return pattern.steps.reduce((total, step) => total + step.durationMs, 0);
}

export type BreathMoment = {
  phase: BreathPhase;
  step: BreathStep;
  progress: number;
};

/** Position inside the repeating cycle. One clock drives both copy and scale. */
export function breathAtElapsed(pattern: BreathPattern, elapsedMs: number): BreathMoment {
  const first = pattern.steps[0] ?? {
    phase: 'inhale' as const,
    durationMs: 4000,
    target: 'open' as const,
  };
  const cycleMs = cycleDurationMs(pattern);
  let position = cycleMs === 0 ? 0 : ((elapsedMs % cycleMs) + cycleMs) % cycleMs;

  for (const step of pattern.steps) {
    if (position < step.durationMs) {
      return {
        phase: step.phase,
        step,
        progress: step.durationMs === 0 ? 1 : position / step.durationMs,
      };
    }
    position -= step.durationMs;
  }

  return { phase: first.phase, step: first, progress: 0 };
}

export function phaseAtElapsed(pattern: BreathPattern, elapsedMs: number): BreathPhase {
  return breathAtElapsed(pattern, elapsedMs).phase;
}

function easeInOutSin(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  return 0.5 - 0.5 * Math.cos(Math.PI * clamped);
}

/** 0 at rest, 1 fully open. Same elapsed clock as the visible instruction. */
export function opennessAtElapsed(pattern: BreathPattern, elapsedMs: number): number {
  const { step, progress } = breathAtElapsed(pattern, elapsedMs);
  const to = step.target === 'open' ? 1 : 0;
  const from = step.phase === 'hold' ? to : step.target === 'open' ? 0 : 1;
  const t = step.phase === 'hold' ? 1 : easeInOutSin(progress);
  return from + (to - from) * t;
}

/** Scale derived from the same elapsed time as the visible instruction. */
export function scaleAtElapsed(
  pattern: BreathPattern,
  elapsedMs: number,
  growScale: number,
): number {
  return 1 + (growScale - 1) * opennessAtElapsed(pattern, elapsedMs);
}
