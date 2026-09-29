import { Platform } from 'react-native';
import { getLocales } from 'expo-localization';

const UNKNOWN_REGION_CODES = new Set(['ZZ', 'XX', 'UNKNOWN']);

export type DeviceRegionConfidence = 'high' | 'low';

export type DeviceRegionSignal = {
  countryCode: string;
  confidence: DeviceRegionConfidence;
};

function readDeviceRegionCode(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }
  const trimmed = value.trim().toUpperCase();
  if (trimmed.length !== 2 || !/^[A-Z]{2}$/.test(trimmed)) {
    return null;
  }
  if (UNKNOWN_REGION_CODES.has(trimmed)) {
    return null;
  }
  return trimmed;
}

/**
 * Device region from the OS region setting only.
 * Never uses language, language-region, or GPS.
 * Web region is parsed from locale, so confidence is always low there.
 */
export function getDeviceRegionSignal(): DeviceRegionSignal | null {
  const locale = getLocales()[0];
  const countryCode = readDeviceRegionCode(locale?.regionCode);
  if (!countryCode) {
    return null;
  }

  const fromDedicatedRegionSetting = Platform.OS === 'ios' || Platform.OS === 'android';

  return {
    countryCode,
    confidence: fromDedicatedRegionSetting ? 'high' : 'low',
  };
}
