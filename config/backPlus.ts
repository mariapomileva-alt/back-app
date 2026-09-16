/**
 * Back Plus — subscription information (S1/S2). No purchase activation here (S3).
 *
 * Ethical rules (do not bypass in UI or copy):
 * - Never paywall the six core tools, Extra support, Call my person, or emergency flows.
 * - Never interrupt an active exercise with a paywall.
 * - Never show live store prices in the app until Product / Offerings come from the store SDK.
 * - Do not advertise a free trial as available until products and trial are configured in the stores.
 * - subscriptionsPubliclyAvailable must stay false until Apple/Google products and RevenueCat are live.
 *
 * S1 audit summary (see also docs/subscription-audit.md):
 * - landing/subscriptions.html was 1.0 free-only placeholder; replaced in S2.
 * - app/settings/subscription.tsx was dormant informational stub; no Settings row (removed per store/ios/listing.md).
 * - RevenueCat: not integrated; production.ts holds null API keys and null annualProductId.
 * - No Apple/Google product IDs in repo (annualProductId null; no monthly id).
 * - Entitlement id placeholder: back_annual in production.ts — not wired to runtime checks.
 * - locales: en.json only; subscription keys expanded in S2.
 * - Terms/Support link to subscriptions.html; copy aligned in S2 (no “nothing to buy” vs “Back Plus preparing” clash).
 */

import { hasRevenueCatConfig, productionConfig } from '@/config/production';

export type BenefitStatus = 'released' | 'planned';

export type BackPlusBenefit = {
  id: string;
  status: BenefitStatus;
};

/** Master switch for website State B and store purchase UI (S3). Keep false until products are live. */
export const subscriptionsPubliclyAvailable = false;

/**
 * Dev-only preview of an active subscriber UI. Never affects production entitlements.
 * Toggle locally to preview the active state in __DEV__ only.
 */
export const devPreviewActiveSubscription = false;

export const backPlusProductName = 'Back Plus';

/** Always free — never gated behind Back Plus in app logic. */
export const backPlusFreeForeverIds = [
  'sixTools',
  'extraSupport',
  'callMyPerson',
  'localPrivacy',
] as const;

/**
 * Back Plus benefits. Only `released` items may be shown as “included” in UI.
 * Planned items appear as “in development”, not as current entitlements.
 */
export const backPlusBenefits: BackPlusBenefit[] = [
  { id: 'expandedSounds', status: 'planned' },
  { id: 'additionalThemes', status: 'planned' },
  { id: 'readLibrary', status: 'planned' },
  { id: 'patternsDepth', status: 'planned' },
];

/**
 * Reference pricing for website / legal planning only — not live prices, not for in-app display.
 * App UI must use store-localized prices when S3 is enabled.
 */
export const backPlusPlannedPricingReference = {
  monthlyEur: 2.99,
  annualEur: 19.99,
  /** Shown on static site when store data is unavailable */
  regionalVariationNote:
    'Prices vary by region and currency. Final prices appear in the App Store or Google Play when Back Plus is available.',
} as const;

export const backPlusLegalUrls = {
  subscriptions: 'https://backapp.live/subscriptions.html',
  support: 'https://backapp.live/support.html',
  privacy: 'https://backapp.live/privacy.html',
  terms: 'https://backapp.live/terms.html',
  websiteHome: 'https://backapp.live/',
} as const;

export type BackPlusDisplayState = 'store_unavailable' | 'inactive' | 'active';

export function releasedBackPlusBenefits(): BackPlusBenefit[] {
  return backPlusBenefits.filter((b) => b.status === 'released');
}

export function plannedBackPlusBenefits(): BackPlusBenefit[] {
  return backPlusBenefits.filter((b) => b.status === 'planned');
}

/** True when real store product ids and RevenueCat keys exist — required before S3 purchases. */
export function hasConfiguredStoreProducts(): boolean {
  return (
    subscriptionsPubliclyAvailable &&
    hasRevenueCatConfig() &&
    productionConfig.annualProductId !== null
  );
}

export function getBackPlusDisplayState(): BackPlusDisplayState {
  if (__DEV__ && devPreviewActiveSubscription) {
    return 'active';
  }
  if (!hasConfiguredStoreProducts()) {
    return 'store_unavailable';
  }
  // S3: resolve from RevenueCat entitlement; until then treat as inactive when store exists.
  return 'inactive';
}
