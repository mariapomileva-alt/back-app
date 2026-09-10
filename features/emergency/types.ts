export type EmergencyNumberRecord = {
  countryCode: string;
  countryName: string;
  generalEmergency: string;
  ambulance: string | null;
  police: string | null;
  fire: string | null;
  source: string;
  sourceUrl: string;
  lastVerified: string;
};

export type EmergencyResolutionSource = 'preview' | 'stored' | 'deviceRegion';

export type EmergencyResolution =
  | {
      status: 'ready';
      record: EmergencyNumberRecord;
      source: EmergencyResolutionSource;
    }
  | {
      status: 'needsCountry';
    };

