/**
 * Offline continuity: cache last *verified* entitlement metadata from the store SDK (S3).
 * Must never unlock tools from cache alone — structure only until RevenueCat is wired.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'back_plus_entitlement_cache_v1';

export type CachedEntitlementSnapshot = {
  verifiedAtIso: string;
  plan: 'annual' | 'monthly' | 'trial';
  expiresAtIso: string | null;
  /** Signature or receipt id from store verification — placeholder for S3 */
  verificationRef: string | null;
};

export async function readCachedEntitlement(): Promise<CachedEntitlementSnapshot | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as CachedEntitlementSnapshot;
  } catch {
    return null;
  }
}

/** S3: call only after RevenueCat / store confirms entitlement. */
export async function writeCachedEntitlement(snapshot: CachedEntitlementSnapshot): Promise<void> {
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(snapshot));
}

export async function clearCachedEntitlement(): Promise<void> {
  await AsyncStorage.removeItem(CACHE_KEY);
}
