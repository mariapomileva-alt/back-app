import AsyncStorage from '@react-native-async-storage/async-storage';

import type { LocalProfile } from '@/types/profile';

import { storageKeys } from './keys';

function normalizeDisplayName(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim().replace(/\s+/g, ' ');
  if (!trimmed || trimmed.length > 40) {
    return undefined;
  }
  return trimmed;
}

function parseProfile(raw: string | null): LocalProfile | null {
  if (!raw) {
    return null;
  }
  try {
    const value = JSON.parse(raw) as unknown;
    if (!value || typeof value !== 'object') {
      return null;
    }
    const record = value as LocalProfile;
    const displayName = normalizeDisplayName(record.displayName);
    const updatedAt = typeof record.updatedAt === 'string' ? record.updatedAt : undefined;
    if (!displayName) {
      return null;
    }
    return { displayName, updatedAt };
  } catch {
    return null;
  }
}

export async function loadLocalProfile(): Promise<LocalProfile | null> {
  const raw = await AsyncStorage.getItem(storageKeys.localProfile);
  return parseProfile(raw);
}

export async function saveLocalProfile(patch: LocalProfile): Promise<LocalProfile | null> {
  const displayName = normalizeDisplayName(patch.displayName);
  const next: LocalProfile = {
    displayName,
    updatedAt: new Date().toISOString(),
  };
  if (!displayName) {
    await AsyncStorage.removeItem(storageKeys.localProfile);
    return null;
  }
  await AsyncStorage.setItem(storageKeys.localProfile, JSON.stringify(next));
  return next;
}

export async function clearLocalProfile(): Promise<void> {
  await AsyncStorage.removeItem(storageKeys.localProfile);
}

/** Full chosen name for Home (e.g. “Зайка”, “Maria”, “mum”). */
export function profileSalutation(profile: LocalProfile | null | undefined): string | null {
  return normalizeDisplayName(profile?.displayName) ?? null;
}

/** @deprecated Use profileSalutation — keeps full display name, not first token. */
export function profileFirstName(profile: LocalProfile | null | undefined): string | null {
  return profileSalutation(profile);
}
