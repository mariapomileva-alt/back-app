/**
 * Regional emergency information.
 * Numbers come from the bundled offline map only — never fetched, never guessed.
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

export function getEmergencyRegion(localeRegion?: string): EmergencyRegion | null {
  const record = getEmergencyByCountryCode(localeRegion);
  return record ? toRegion(record) : null;
}

export function getVerifiedEmergencyCountries(): ReadonlyArray<EmergencyNumberRecord> {
  return listEmergencyCountries();
}
