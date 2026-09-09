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
