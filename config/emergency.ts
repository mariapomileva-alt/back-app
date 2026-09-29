/**
 * Regional emergency information.
 * Numbers come from the bundled offline map only — never fetched, never guessed.
 * Do not pass a language code. Use a confirmed country or a device region signal.
 */

import {
  getEmergencyByCountryCode,
  listEmergencyCountries,
} from '@/features/emergency/numbers';
import type { EmergencyNumberRecord } from '@/features/emergency/types';

export type EmergencyRegion = {
  regionCode: string;
  label: string;
  numbers: ReadonlyArray<{
    name: string;
    number: string;
  }>;
};

export const emergencyDisclaimerKeys = {
  title: 'extraSupport.urgentTitle',
  body: 'extraSupport.urgentBody',
} as const;

function toRegion(record: EmergencyNumberRecord): EmergencyRegion {
  return {
    regionCode: record.countryCode,
    label: record.countryName,
    numbers: [
      {
        name: 'Emergency help',
        number: record.generalEmergency,
      },
    ],
  };
}

export function getEmergencyRegion(countryCode?: string): EmergencyRegion | null {
  const record = getEmergencyByCountryCode(countryCode);
  return record ? toRegion(record) : null;
}

export function getVerifiedEmergencyCountries(): ReadonlyArray<EmergencyNumberRecord> {
  return listEmergencyCountries();
}
