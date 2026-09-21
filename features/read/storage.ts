import AsyncStorage from '@react-native-async-storage/async-storage';

import { storageKeys } from '@/storage/keys';

import {
  defaultReadMemory,
  readRevealSpeeds,
  type ReadLanguagePreference,
  type ReadMemory,
  type ReadRevealSpeed,
} from './types';
import { isReadLanguage } from './language';

function isRevealSpeed(value: unknown): value is ReadRevealSpeed {
  return typeof value === 'string' && (readRevealSpeeds as readonly string[]).includes(value);
}

function isLanguagePreference(value: unknown): value is ReadLanguagePreference {
  return isReadLanguage(typeof value === 'string' ? value : null);
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
}

function asLastSeenAt(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object') {
    return {};
  }
  const next: Record<string, number> = {};
  for (const [key, seenAt] of Object.entries(value as Record<string, unknown>)) {
    if (typeof seenAt === 'number' && Number.isFinite(seenAt)) {
      next[key] = seenAt;
    }
  }
  return next;
}

function parseMemory(raw: string | null): ReadMemory {
  if (!raw) {
    return { ...defaultReadMemory, lastSeenAt: {} };
  }
  try {
    const parsed = JSON.parse(raw) as Partial<ReadMemory>;
    return {
      recentBlockIds: asStringArray(parsed.recentBlockIds).slice(-200),
      usedStoryIds: asStringArray(parsed.usedStoryIds).slice(-200),
      patternHistory: asStringArray(parsed.patternHistory).slice(-24),
      threadHistory: asStringArray(parsed.threadHistory).slice(-16),
      sessionCount: typeof parsed.sessionCount === 'number' ? Math.max(0, parsed.sessionCount) : 0,
      lastSeenAt: asLastSeenAt(parsed.lastSeenAt),
      language: isLanguagePreference(parsed.language) ? parsed.language : 'en',
      revealSpeed: isRevealSpeed(parsed.revealSpeed) ? parsed.revealSpeed : 'steady',
      sawCanvasHint: parsed.sawCanvasHint === true,
    };
  } catch {
    return { ...defaultReadMemory, lastSeenAt: {} };
  }
}

export async function loadReadMemory(): Promise<ReadMemory> {
  try {
    const raw = await AsyncStorage.getItem(storageKeys.readMemory);
    return parseMemory(raw);
  } catch {
    return { ...defaultReadMemory, lastSeenAt: {} };
  }
}

export async function saveReadMemory(memory: ReadMemory): Promise<void> {
  try {
    await AsyncStorage.setItem(storageKeys.readMemory, JSON.stringify(memory));
  } catch {
    // Read remains usable with in-memory history if storage is unavailable.
  }
}

export async function saveReadRevealSpeed(revealSpeed: ReadRevealSpeed): Promise<void> {
  const memory = await loadReadMemory();
  await saveReadMemory({ ...memory, revealSpeed });
}
