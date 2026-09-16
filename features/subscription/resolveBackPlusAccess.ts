import {
  devPreviewEntitlement,
  hasConfiguredStoreProducts,
  hasPaidToolAccess,
  type BackPlusAccessState,
  type BackPlusPlanKind,
} from '@/config/backPlus';
import { readCachedEntitlement } from '@/features/subscription/entitlementCache';

export type ResolvedBackPlusAccess = {
  accessState: BackPlusAccessState;
  hasPaidAccess: boolean;
  plan: BackPlusPlanKind | null;
  /** Renewal or trial end — from store when S3 live; dev fixtures only in __DEV__ */
  renewalOrExpirationDate: Date | null;
  storePurchasesAvailable: boolean;
};

function devFixtureDate(daysFromNow: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(12, 0, 0, 0);
  return d;
}

function resolveDevPreview(): ResolvedBackPlusAccess {
  const preview = devPreviewEntitlement ?? 'none';
  switch (preview) {
    case 'trialActive':
      return {
        accessState: 'trialActive',
        hasPaidAccess: true,
        plan: 'annual',
        renewalOrExpirationDate: devFixtureDate(5),
        storePurchasesAvailable: hasConfiguredStoreProducts(),
      };
    case 'subscribed':
      return {
        accessState: 'subscribed',
        hasPaidAccess: true,
        plan: 'annual',
        renewalOrExpirationDate: devFixtureDate(200),
        storePurchasesAvailable: hasConfiguredStoreProducts(),
      };
    case 'expired':
      return {
        accessState: 'expired',
        hasPaidAccess: false,
        plan: null,
        renewalOrExpirationDate: devFixtureDate(-3),
        storePurchasesAvailable: hasConfiguredStoreProducts(),
      };
    case 'none':
    default:
      return {
        accessState: 'none',
        hasPaidAccess: false,
        plan: null,
        renewalOrExpirationDate: null,
        storePurchasesAvailable: hasConfiguredStoreProducts(),
      };
  }
}

/**
 * Production without RevenueCat: tools locked (`none`). Store UI shows preparation (`unavailable`)
 * when products are not configured. Cached entitlement is display-only until S3 verifies restore.
 */
export async function resolveBackPlusAccess(): Promise<ResolvedBackPlusAccess> {
  if (__DEV__ && devPreviewEntitlement !== null) {
    return resolveDevPreview();
  }

  const storePurchasesAvailable = hasConfiguredStoreProducts();

  if (!storePurchasesAvailable) {
    // Warm cache read for future continuity UI — does not grant access.
    void readCachedEntitlement();
    return {
      accessState: 'unavailable',
      hasPaidAccess: false,
      plan: null,
      renewalOrExpirationDate: null,
      storePurchasesAvailable: false,
    };
  }

  // S3: RevenueCat CustomerInfo → trialActive | subscribed | expired | none
  return {
    accessState: 'none',
    hasPaidAccess: false,
    plan: null,
    renewalOrExpirationDate: null,
    storePurchasesAvailable: true,
  };
}

export function accessStateHasPaidAccess(state: BackPlusAccessState): boolean {
  return hasPaidToolAccess(state);
}
