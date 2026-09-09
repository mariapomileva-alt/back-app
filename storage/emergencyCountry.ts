import AsyncStorage from '@react-native-async-storage/async-storage';

import { getEmergencyByCountryCode } from '@/features/emergency/numbers';

import { storageKeys } from './keys';

export async function loadEmergencyCountryCode(): Promise<string | null> {
  try {
    const value = await AsyncStorage.getItem(storageKeys.emergencyCountry);
    if (!value) {
      return null;
    }
    return getEmergencyByCountryCode(value) ? value.toUpperCase() : null;
  } catch {
    return null;
  }
}

export async function saveEmergencyCountryCode(countryCode: string): Promise<void> {
  const record = getEmergencyByCountryCode(countryCode);
  if (!record) {
    return;
  }
  try {
    await AsyncStorage.setItem(storageKeys.emergencyCountry, record.countryCode);
  } catch {
    // Keep the in-memory selection if local storage is unavailable.
  }
}
