import type { ReadRevealSpeed, RevealKind } from './types';

export const revealSpeedMultiplier: Record<ReadRevealSpeed, number> = {
  unhurried: 1.18,
  steady: 1,
  quick: 0.76,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function bandForText(text: string, kind?: RevealKind): { min: number; max: number } {
  if (kind === 'environment' || kind === 'choice') {
    return { min: 4000, max: 6000 };
  }

  const trimmed = text.trim();
  const words = trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
  const chars = trimmed.length;

  if (words <= 3 && chars <= 22) {
    return { min: 1500, max: 2500 };
  }
  if (words <= 8 && chars <= 58) {
    return { min: 2500, max: 4000 };
  }
  return { min: 4000, max: 6000 };
}

export function fragmentDelayMs(text: string, speed: ReadRevealSpeed, kind?: RevealKind): number {
  const trimmed = text.trim();
  const words = trimmed.length === 0 ? 1 : trimmed.split(/\s+/).length;
  const chars = Math.max(trimmed.length, 1);
  const { min, max } = bandForText(trimmed, kind);
  const progress = clamp((chars - 8) / 70 + (words - 1) / 12, 0, 1);
  const base = min + (max - min) * progress;
  const scaled = base * revealSpeedMultiplier[speed];
  const floor = 900 * revealSpeedMultiplier[speed];
  const ceiling = 6200 * revealSpeedMultiplier[speed];
  return Math.round(clamp(scaled, Math.max(floor, min * 0.72), Math.min(ceiling, max * 1.12)));
}

export function isFocalWord(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) {
    return false;
  }
  if (/\s/.test(trimmed)) {
    return false;
  }
  return trimmed.length <= 18 && /^[\p{L}\p{M}]+$/u.test(trimmed);
}
