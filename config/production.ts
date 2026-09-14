/**
 * Production configuration that must be filled before store release.
 * Do not invent store IDs, legal URLs, RevenueCat keys, or emergency numbers.
 */

export const productionConfig = {
  easProjectId: '045267b8-b0b8-472e-b5eb-78123328d6b7',

  // TODO: confirm production bundle identifiers with App Store Connect / Play Console.
  iosBundleIdentifier: 'app.back.selfhelp',
  androidPackage: 'app.back.selfhelp',

  // TODO: add RevenueCat public SDK keys. Until then, subscription uses a local mock.
  revenueCatIosApiKey: null as string | null,
  revenueCatAndroidApiKey: null as string | null,

  // TODO: add the App Store / Play product identifier for Back Annual.
  // Target: USD $9.99 / year with a 7-day trial. Never hard-code a displayed price.
  annualProductId: null as string | null,
  entitlementId: 'back_annual',

  // TODO: replace with the live Terms of Use URL before store release.
  termsUrl: null as string | null,

  // TODO: replace with the live Privacy Policy URL before store release.
  privacyUrl: null as string | null,

  // TODO: add professionally recorded English grounding audio before store release.
  groundingAudioReady: false, // TODO: REPLACE WITH FINAL PRODUCTION ARTWORK / professionally recorded English grounding audio

  // TODO: add professionally mixed looping environment sounds before store release.
  environmentAudioReady: false,

  // TODO: export final app icon at required store sizes from the master artwork.
  // Required sizes are listed in assets/docs/icon-export.txt
  productionIconReady: false,
} as const;

export function hasRevenueCatConfig(): boolean {
  return (
    productionConfig.revenueCatIosApiKey !== null &&
    productionConfig.revenueCatAndroidApiKey !== null
  );
}
