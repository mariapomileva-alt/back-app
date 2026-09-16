import AsyncStorage from '@react-native-async-storage/async-storage';

import { defaultThemeName, type ThemeName } from '@/theme/themes';

import { storageKeys } from './keys';

export type Preferences = {
  themeName: ThemeName;
  hapticsEnabled: boolean;
  reduceMotionOverride: boolean;
};

export const defaultPreferences: Preferences = {
  themeName: defaultThemeName,
  hapticsEnabled: true,
  reduceMotionOverride: false,
};

function isThemeName(value: string | null): value is ThemeName {
  return value === 'warmNeutral' || value === 'deepGreen' || value === 'softBeige';
}

async function readBoolean(key: string, fallback: boolean): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) {
      return fallback;
    }
    return value === 'true';
  } catch {
    return fallback;
  }
}

export async function loadPreferences(): Promise<Preferences> {
  try {
    const [themeName, hapticsEnabled, reduceMotionOverride] = await Promise.all([
      AsyncStorage.getItem(storageKeys.theme),
      readBoolean(storageKeys.hapticsEnabled, defaultPreferences.hapticsEnabled),
      readBoolean(storageKeys.reduceMotionOverride, defaultPreferences.reduceMotionOverride),
    ]);

    return {
      themeName: isThemeName(themeName) ? themeName : defaultPreferences.themeName,
      hapticsEnabled,
      reduceMotionOverride,
    };
  } catch {
    return defaultPreferences;
  }
}

export async function saveThemeName(themeName: ThemeName): Promise<void> {
  try {
    await AsyncStorage.setItem(storageKeys.theme, themeName);
  } catch {
    // Keep the in-memory theme if local storage is unavailable.
  }
}

export async function saveHapticsEnabled(enabled: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(storageKeys.hapticsEnabled, String(enabled));
  } catch {
    // Keep the in-memory preference if local storage is unavailable.
  }
}

export async function saveReduceMotionOverride(enabled: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(storageKeys.reduceMotionOverride, String(enabled));
  } catch {
    // Keep the in-memory preference if local storage is unavailable.
  }
}

let lastSoundIdCache: string | null | undefined;

/** Sync last Listen sound after the first load so playback can start without waiting. */
export function peekLastSoundId(): string | null | undefined {
  return lastSoundIdCache;
}

export async function loadLastSoundId(): Promise<string | null> {
  try {
    const value = await AsyncStorage.getItem(storageKeys.lastSoundId);
    lastSoundIdCache = value;
    return value;
  } catch {
    lastSoundIdCache = lastSoundIdCache ?? null;
    return null;
  }
}

export async function saveLastSoundId(id: string): Promise<void> {
  lastSoundIdCache = id;
  try {
    await AsyncStorage.setItem(storageKeys.lastSoundId, id);
  } catch {
    // Keep the in-memory selection if local storage is unavailable.
  }
}

export async function loadSoundMuted(): Promise<boolean> {
  return readBoolean(storageKeys.soundMuted, false);
}

export async function saveSoundMuted(muted: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(storageKeys.soundMuted, String(muted));
  } catch {
    // Keep the in-memory mute if local storage is unavailable.
  }
}

export const DEFAULT_SOUND_VOLUME = 0.7;

function clampSoundVolume(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_SOUND_VOLUME;
  }
  return Math.min(1, Math.max(0, value));
}

export async function loadSoundVolume(): Promise<number> {
  try {
    const value = await AsyncStorage.getItem(storageKeys.soundVolume);
    if (value === null) {
      return DEFAULT_SOUND_VOLUME;
    }
    return clampSoundVolume(Number.parseFloat(value));
  } catch {
    return DEFAULT_SOUND_VOLUME;
  }
}

export async function saveSoundVolume(volume: number): Promise<void> {
  try {
    await AsyncStorage.setItem(storageKeys.soundVolume, String(clampSoundVolume(volume)));
  } catch {
    // Keep the in-memory volume if local storage is unavailable.
  }
}

export async function loadLastBreathPattern(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(storageKeys.lastBreathPattern);
  } catch {
    return null;
  }
}

export async function saveLastBreathPattern(id: string): Promise<void> {
  try {
    await AsyncStorage.setItem(storageKeys.lastBreathPattern, id);
  } catch {
    // Keep the in-memory selection if local storage is unavailable.
  }
}

export async function loadLastDistractActivity(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(storageKeys.lastDistractActivity);
  } catch {
    return null;
  }
}

export async function saveLastDistractActivity(id: string): Promise<void> {
  try {
    await AsyncStorage.setItem(storageKeys.lastDistractActivity, id);
  } catch {
    // Keep the in-memory selection if local storage is unavailable.
  }
}

export async function loadDistractSfxMuted(): Promise<boolean> {
  return readBoolean(storageKeys.distractSfxMuted, false);
}

export async function saveDistractSfxMuted(muted: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(storageKeys.distractSfxMuted, String(muted));
  } catch {
    // Keep the in-memory preference if local storage is unavailable.
  }
}

export async function loadGroundAmbientMuted(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(storageKeys.groundAmbientMuted);
    if (value !== null) {
      return value === 'true';
    }
  } catch {
    // Fall through to legacy key.
  }
  return readBoolean(storageKeys.groundSfxMuted, false);
}

export async function saveGroundAmbientMuted(muted: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(storageKeys.groundAmbientMuted, String(muted));
  } catch {
    // Keep the in-memory preference if local storage is unavailable.
  }
}

export async function loadBreatheSfxMuted(): Promise<boolean> {
  return readBoolean(storageKeys.breatheSfxMuted, false);
}

export async function saveBreatheSfxMuted(muted: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(storageKeys.breatheSfxMuted, String(muted));
  } catch {
    // Keep the in-memory preference if local storage is unavailable.
  }
}

export type RememberedChoices = {
  lastBreathPattern: string | null;
  lastDistractActivity: string | null;
  lastSoundId: string | null;
  themeName: ThemeName | null;
  hapticsEnabled: boolean | null;
  reduceMotionOverride: boolean | null;
};

function readOptionalBoolean(value: string | null): boolean | null {
  if (value === null) {
    return null;
  }
  return value === 'true';
}

/** What My patterns can show. Missing keys stay empty — defaults are not invented here. */
export async function loadRememberedChoices(): Promise<RememberedChoices> {
  try {
    const [lastBreathPattern, lastDistractActivity, lastSoundId, themeName, haptics, reduceMotion] =
      await Promise.all([
        AsyncStorage.getItem(storageKeys.lastBreathPattern),
        AsyncStorage.getItem(storageKeys.lastDistractActivity),
        AsyncStorage.getItem(storageKeys.lastSoundId),
        AsyncStorage.getItem(storageKeys.theme),
        AsyncStorage.getItem(storageKeys.hapticsEnabled),
        AsyncStorage.getItem(storageKeys.reduceMotionOverride),
      ]);

    return {
      lastBreathPattern,
      lastDistractActivity,
      lastSoundId,
      themeName: isThemeName(themeName) ? themeName : null,
      hapticsEnabled: readOptionalBoolean(haptics),
      reduceMotionOverride: readOptionalBoolean(reduceMotion),
    };
  } catch {
    return {
      lastBreathPattern: null,
      lastDistractActivity: null,
      lastSoundId: null,
      themeName: null,
      hapticsEnabled: null,
      reduceMotionOverride: null,
    };
  }
}

const rememberedPreferenceKeys = [
  storageKeys.theme,
  storageKeys.hapticsEnabled,
  storageKeys.reduceMotionOverride,
  storageKeys.lastSoundId,
  storageKeys.lastBreathPattern,
  storageKeys.lastDistractActivity,
] as const;

/** Clears My patterns preference keys only. Leaves contact and Read memory alone. */
export async function clearRememberedPreferences(): Promise<void> {
  lastSoundIdCache = undefined;
  try {
    await AsyncStorage.multiRemove([...rememberedPreferenceKeys]);
  } catch {
    // Keep going if local storage is unavailable.
  }
}
