import bundledNumbers from '@/content/emergency/emergencyNumbers.json';

import type { DeviceRegionSignal } from './deviceRegion';
import type { EmergencyNumberRecord, EmergencyResolution } from './types';

const UNKNOWN_REGION_CODES = new Set(['ZZ', 'XX', 'UNKNOWN']);

/** ISO 3166-1 alpha-2 aliases that still map to a verified record. */
const REGION_ALIASES: Record<string, string> = {
  UK: 'GB',
  EL: 'GR',
};

function isEmergencyNumberRecord(value: unknown): value is EmergencyNumberRecord {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.countryCode === 'string' &&
    record.countryCode.length === 2 &&
    typeof record.countryName === 'string' &&
    record.countryName.length > 0 &&
    typeof record.generalEmergency === 'string' &&
    record.generalEmergency.length > 0 &&
    typeof record.source === 'string' &&
    typeof record.sourceUrl === 'string' &&
    typeof record.lastVerified === 'string' &&
    (record.ambulance === null || typeof record.ambulance === 'string') &&
    (record.police === null || typeof record.police === 'string') &&
    (record.fire === null || typeof record.fire === 'string')
  );
}

function loadBundledNumbers(): EmergencyNumberRecord[] {
  if (!Array.isArray(bundledNumbers)) {
    return [];
  }
  return bundledNumbers.filter(isEmergencyNumberRecord);
}

const records = loadBundledNumbers();

const byCountryCode = new Map(
  records.map((record) => [record.countryCode.toUpperCase(), record] as const),
);

export function normalizeCountryCode(code: string | null | undefined): string | null {
  if (!code) {
    return null;
  }
  const trimmed = code.trim().toUpperCase();
  if (!trimmed) {
    return null;
  }
  if (UNKNOWN_REGION_CODES.has(trimmed)) {
    return null;
  }
  return REGION_ALIASES[trimmed] ?? trimmed;
}

export function getEmergencyByCountryCode(
  code: string | null | undefined,
): EmergencyNumberRecord | null {
  const normalized = normalizeCountryCode(code);
  if (!normalized) {
    return null;
  }
  return byCountryCode.get(normalized) ?? null;
}

export function listEmergencyCountries(): EmergencyNumberRecord[] {
  return [...records].sort((a, b) => a.countryName.localeCompare(b.countryName));
}

/**
 * Resolve a bundled emergency number.
 * Never guesses a global default (112 / 911 / 999).
 * Language is never treated as a country.
 * A number is shown only from a stored (confirmed) country, a high-confidence
 * device region that exists in the reviewed dataset, or an explicit preview
 * when nothing has been confirmed yet.
 */
export function resolveEmergencyNumber(input: {
  previewRegion?: string | null;
  storedCountryCode?: string | null;
  deviceRegion?: DeviceRegionSignal | null;
}): EmergencyResolution {
  const stored = getEmergencyByCountryCode(input.storedCountryCode);
  if (stored) {
    return { status: 'ready', record: stored, source: 'stored' };
  }

  if (input.previewRegion != null && input.previewRegion !== '') {
    const preview = getEmergencyByCountryCode(input.previewRegion);
    if (!preview) {
      return { status: 'needsCountry' };
    }
    return { status: 'ready', record: preview, source: 'preview' };
  }

  if (input.deviceRegion?.confidence === 'high') {
    const fromDevice = getEmergencyByCountryCode(input.deviceRegion.countryCode);
    if (fromDevice) {
      return { status: 'ready', record: fromDevice, source: 'deviceRegion' };
    }
  }

  return { status: 'needsCountry' };
}
