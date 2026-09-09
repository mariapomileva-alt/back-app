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

export function phaseAtElapsed(pattern: BreathPattern, elapsedMs: number): BreathPhase {
  const cycleMs = pattern.steps.reduce((total, step) => total + step.durationMs, 0);
  let position = cycleMs === 0 ? 0 : elapsedMs % cycleMs;
  for (const step of pattern.steps) {
    if (position < step.durationMs) {
      return step.phase;
    }
    position -= step.durationMs;
  }
  return pattern.steps[0]?.phase ?? 'inhale';
}
