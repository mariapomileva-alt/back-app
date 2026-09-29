import type { Href } from 'expo-router';

export const distractActivityIds = ['shapes', 'blocks', 'snake', 'catch'] as const;

export type DistractActivityId = (typeof distractActivityIds)[number];

export function isDistractActivityId(value: string | null | undefined): value is DistractActivityId {
  return value === 'shapes' || value === 'blocks' || value === 'snake' || value === 'catch';
}

export function distractActivityHref(id: DistractActivityId): Href {
  return `/distract/${id}`;
}
