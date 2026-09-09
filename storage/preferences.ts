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

export async function loadLastSoundId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(storageKeys.lastSoundId);
  } catch {
    return null;
  }
}

export async function saveLastSoundId(id: string): Promise<void> {
  try {
    await AsyncStorage.setItem(storageKeys.lastSoundId, id);
  } catch {
    // Keep the in-memory selection if local storage is unavailable.
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
