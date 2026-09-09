import { getLocales } from 'expo-localization';

/**
 * Device region from locale settings only.
 * Never requests GPS or network location.
 */
export function getDeviceRegionCode(): string | null {
  const locale = getLocales()[0];
  const fromRegion = locale?.regionCode?.trim();
  if (fromRegion) {
    return fromRegion.toUpperCase();
  }

  const tag = locale?.languageTag;
  if (!tag) {
    return null;
  }

  const parts = tag.replace(/_/g, '-').split('-');
  const region = parts.find((part, index) => index > 0 && /^[A-Za-z]{2}$/.test(part));
  return region ? region.toUpperCase() : null;
}
