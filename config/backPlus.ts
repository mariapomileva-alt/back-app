/**
 * Back Plus — subscription model (information + access boundaries). No purchase activation here (S3).
 *
 * Access model:
 * - Paid: Breathe, Distract, Ground, Move, Listen, Read, My patterns, themes, and related content
 *   require active trial OR active subscription (verified via store / RevenueCat when S3 is live).
 * - No permanent free product tier for core tools.
 *
 * Ethical rules (do not bypass in UI or copy):
 * - Never interrupt an active exercise with a paywall; finish the session first.
 * - Never show a paywall after the user reports “Worse” on session outcome.
 * - Never gate Extra support, emergency info, Call/Message my person, Privacy, Terms, Subscription
 *   info, Restore, Manage subscription, Support, or accessibility needed for those screens.
 * - Do not describe safety routes as a “free plan.”
 * - Never show live store prices in the app until Product / Offerings come from the store SDK.
 * - Do not advertise a free trial as available until products and trial are configured in the stores.
 * - subscriptionsPubliclyAvailable must stay false until Apple/Google products and RevenueCat are live.
 * - Never unlock Back from localStorage, install date, or an unverified boolean alone.
 *
 * S1 audit: docs/subscription-audit.md
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
 * __DEV__ only: preview subscription UI states. Never affects production entitlements.
 * Set to `trialActive`, `subscribed`, `expired`, or `none` to preview Settings / paywall copy.
 */
export const devPreviewEntitlement: 'none' | 'trialActive' | 'subscribed' | 'expired' | null =
  __DEV__ ? 'none' : null;

/** @deprecated use devPreviewEntitlement */
export const devPreviewActiveSubscription = false;

export const backPlusProductName = 'Back Plus';

/** Core tools and experience surfaces that require trial or subscription. */
export const paidToolIds = [
  'breathe',
  'distract',
  'ground',
  'move',
  'listen',
  'read',
] as const;

export type PaidToolId = (typeof paidToolIds)[number];

/** Settings / routes that require Back Plus (same entitlement as paid tools). */
export const paidExperienceRouteIds = ['patterns', 'themes'] as const;

/**
 * Safety and account-management routes — never subscription-gated.
 * (Not labeled as a “free plan” in copy.)
 */
export const freeForeverRouteIds = [
  'extraSupport',
  'emergency',
  'callMyPerson',
  'messageMyPerson',
  'privacy',
  'terms',
  'subscription',
  'restorePurchases',
  'manageSubscription',
  'support',
  'settingsRoot',
] as const;

export type FreeForeverRouteId = (typeof freeForeverRouteIds)[number];

export type BackPlusAccessState =
  | 'loading'
  | 'unavailable'
  | 'trialActive'
  | 'subscribed'
  | 'expired'
  | 'none';

export type BackPlusPlanKind = 'annual' | 'monthly';

/**
 * Back Plus benefits for marketing lists. Only `released` items are “included today”.
 * Planned items may appear as in development, not as current entitlements.
 */
export const backPlusBenefits: BackPlusBenefit[] = [
  { id: 'sixTools', status: 'released' },
  { id: 'offlineSounds', status: 'released' },
  { id: 'allExercises', status: 'released' },
  { id: 'readExperience', status: 'released' },
  { id: 'patterns', status: 'released' },
  { id: 'themes', status: 'released' },
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
  /** Shown on static site when store data is unavailable (State A). */
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

/** @deprecated use BackPlusAccessState via useBackPlusAccess */
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

export function hasPaidToolAccess(state: BackPlusAccessState): boolean {
  return state === 'trialActive' || state === 'subscribed';
}

/** @deprecated use useBackPlusAccess */
export function getBackPlusDisplayState(): BackPlusDisplayState {
  if (__DEV__ && devPreviewActiveSubscription) {
    return 'active';
  }
  if (!hasConfiguredStoreProducts()) {
    return 'store_unavailable';
  }
  return 'inactive';
}
