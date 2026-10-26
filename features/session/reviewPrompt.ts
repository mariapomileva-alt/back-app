export const REVIEW_COOLDOWN_MS = 120 * 24 * 60 * 60 * 1000;

export type SessionFeeling = 'better' | 'same' | 'worse';

export type ReviewMemory = {
  getBetterCount(): Promise<number>;
  setBetterCount(count: number): Promise<void>;
  getLastRequestedAt(): Promise<number | null>;
  setLastRequestedAt(at: number): Promise<void>;
};

export type StoreReviewLike = {
  isAvailableAsync(): Promise<boolean>;
  requestReview(): Promise<void>;
};

export type ReviewPromptResult = 'requested' | 'skipped';

async function defaultMemory(): Promise<ReviewMemory> {
  const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
  const { storageKeys } = await import('@/storage/keys');
  return {
    async getBetterCount() {
      const raw = await AsyncStorage.getItem(storageKeys.reviewBetterCount);
      const count = raw ? Number.parseInt(raw, 10) : 0;
      return Number.isFinite(count) && count > 0 ? count : 0;
    },
    async setBetterCount(count) {
      await AsyncStorage.setItem(storageKeys.reviewBetterCount, String(count));
    },
    async getLastRequestedAt() {
      const raw = await AsyncStorage.getItem(storageKeys.reviewLastRequestedAt);
      const at = raw ? Number.parseInt(raw, 10) : NaN;
      return Number.isFinite(at) ? at : null;
    },
    async setLastRequestedAt(at) {
      await AsyncStorage.setItem(storageKeys.reviewLastRequestedAt, String(at));
    },
  };
}

async function defaultStoreReview(): Promise<StoreReviewLike> {
  const StoreReview = await import('expo-store-review');
  return {
    isAvailableAsync: () => StoreReview.isAvailableAsync(),
    requestReview: () => StoreReview.requestReview(),
  };
}

/**
 * Ask for an App Store rating only after a later "A little better" outcome.
 * Never call this during an exercise or from support/emergency screens.
 */
export async function maybeRequestReview(options: {
  outcome: SessionFeeling;
  now?: number;
  memory?: ReviewMemory;
  storeReview?: StoreReviewLike;
}): Promise<ReviewPromptResult> {
  const memory = options.memory ?? (await defaultMemory());
  const storeReview = options.storeReview ?? (await defaultStoreReview());
  const now = options.now ?? Date.now();

  if (options.outcome !== 'better') {
    return 'skipped';
  }

  const nextCount = (await memory.getBetterCount()) + 1;
  await memory.setBetterCount(nextCount);
  if (nextCount < 2) {
    return 'skipped';
  }

  const lastRequestedAt = await memory.getLastRequestedAt();
  if (lastRequestedAt !== null && now - lastRequestedAt < REVIEW_COOLDOWN_MS) {
    return 'skipped';
  }

  if (!(await storeReview.isAvailableAsync())) {
    return 'skipped';
  }

  await storeReview.requestReview();
  await memory.setLastRequestedAt(now);
  return 'requested';
}
