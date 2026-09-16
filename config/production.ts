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

  // TODO (S3): App Store / Play product identifiers — do not invent IDs in repo.
  // Planned Back Plus reference pricing (EUR, website planning only): see config/backPlus.ts.
  // Display prices only from store / RevenueCat Offerings in app UI.
  annualProductId: null as string | null,
  // TODO (S3): monthly product id if monthly plan is offered.
  monthlyProductId: null as string | null,
  entitlementId: 'back_annual',

  // TODO: replace with the live Terms of Use URL before store release.
  // In-app Terms: app/settings/terms.tsx. Do not invent a domain.
  termsUrl: null as string | null,

  // Live Privacy Policy for App Store and in-app Privacy.
  // In-app Privacy: app/settings/privacy.tsx.
  privacyUrl: 'https://backapp.live/privacy.html',

  // TODO: REPLACE WITH PROFESSIONALLY RECORDED BACK GROUNDING AUDIO BEFORE RELEASE
  // Drop audio/grounding/english.wav (or .m4a), point the require() in
  // features/media/catalog.ts at that file, then set this true.
  // Until then keep english-placeholder.wav and this flag false.
  groundingAudioReady: false,

  // TODO: add professionally mixed looping environment sounds before store release.
  // Drop audio/sounds/{soft-rain,ocean,gentle-stream,forest,distant-birds,fan,brown-noise,soft-white-noise,soft-melody}.wav (or .m4a),
  // point the require() paths in features/media/catalog.ts at those files, then set this true.
  // Until then keep the *-placeholder.wav files and this flag false.
  environmentAudioReady: false,

  // Master: assets/brand/app-icon-master.png. Same opaque 1024 in
  // store/ios/icon-1024.png (App Store Connect upload) and assets/images/icon.png.
  productionIconReady: true,
} as const;

export function hasRevenueCatConfig(): boolean {
  return (
    productionConfig.revenueCatIosApiKey !== null &&
    productionConfig.revenueCatAndroidApiKey !== null
  );
}
