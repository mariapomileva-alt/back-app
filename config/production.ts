/**
 * Production configuration that must be filled before store release.
 * Do not invent store IDs, legal URLs, RevenueCat keys, or emergency numbers.
 */

export const productionConfig = {
  // TODO: replace with the EAS project ID after running `eas init`.
  easProjectId: null as string | null,

  // TODO: confirm production bundle identifiers with App Store Connect / Play Console.
  iosBundleIdentifier: 'app.back.selfhelp',
  androidPackage: 'app.back.selfhelp',

  // Development mode: purchasing is disabled. Do not implement RevenueCat in this pass.
  // TODO: add RevenueCat public SDK keys only when a real store product exists.
  revenueCatIosApiKey: null as string | null,
  revenueCatAndroidApiKey: null as string | null,

  // TODO: add the App Store / Play product identifier for Back Annual.
  // Target: USD $9.99 / year with a 7-day trial. Never hard-code a displayed price.
  annualProductId: null as string | null,
  entitlementId: 'back_annual',

  // TODO: replace with the live Terms of Use URL before store release.
  // In-app Terms: app/settings/terms.tsx. Do not invent a domain.
  termsUrl: null as string | null,

  // TODO: replace with the live Privacy Policy URL before store release.
  // In-app Privacy: app/settings/privacy.tsx. Do not invent a domain.
  privacyUrl: null as string | null,

  // TODO: REPLACE WITH PROFESSIONALLY RECORDED BACK GROUNDING AUDIO BEFORE RELEASE
  // Drop audio/grounding/english.wav (or .m4a), point the require() in
  // features/media/catalog.ts at that file, then set this true.
  // Until then keep english-placeholder.wav and this flag false.
  groundingAudioReady: false,

  // TODO: add professionally mixed looping environment sounds before store release.
  // Drop audio/sounds/{soft-rain,ocean,fan,forest,brown-noise}.wav (or .m4a),
  // point the require() paths in features/media/catalog.ts at those files, then set this true.
  // Until then keep the *-placeholder.wav files and this flag false.
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
