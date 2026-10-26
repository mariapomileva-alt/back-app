import { describe, expect, it, vi } from 'vitest';

import {
  REVIEW_COOLDOWN_MS,
  maybeRequestReview,
  type ReviewMemory,
  type StoreReviewLike,
} from './reviewPrompt';

function memory(initial?: { betterCount?: number; lastRequestedAt?: number | null }): ReviewMemory {
  let betterCount = initial?.betterCount ?? 0;
  let lastRequestedAt = initial?.lastRequestedAt ?? null;
  return {
    getBetterCount: async () => betterCount,
    setBetterCount: async (count) => {
      betterCount = count;
    },
    getLastRequestedAt: async () => lastRequestedAt,
    setLastRequestedAt: async (at) => {
      lastRequestedAt = at;
    },
  };
}

function storeReview(available = true): StoreReviewLike & { requestReview: ReturnType<typeof vi.fn> } {
  return {
    isAvailableAsync: async () => available,
    requestReview: vi.fn(async () => undefined),
  };
}

describe('maybeRequestReview', () => {
  it('never requests after same or worse, and does not count those outcomes', async () => {
    const saved = memory();
    const review = storeReview();
    await expect(maybeRequestReview({ outcome: 'same', memory: saved, storeReview: review })).resolves.toBe(
      'skipped',
    );
    await expect(maybeRequestReview({ outcome: 'worse', memory: saved, storeReview: review })).resolves.toBe(
      'skipped',
    );
    expect(await saved.getBetterCount()).toBe(0);
    expect(review.requestReview).not.toHaveBeenCalled();
  });

  it('skips the first better outcome after counting it', async () => {
    const saved = memory();
    const review = storeReview();
    await expect(maybeRequestReview({ outcome: 'better', memory: saved, storeReview: review })).resolves.toBe(
      'skipped',
    );
    expect(await saved.getBetterCount()).toBe(1);
    expect(review.requestReview).not.toHaveBeenCalled();
  });

  it('requests on the second better outcome when the store is available', async () => {
    const now = 1_700_000_000_000;
    const saved = memory({ betterCount: 1 });
    const review = storeReview(true);
    await expect(
      maybeRequestReview({ outcome: 'better', now, memory: saved, storeReview: review }),
    ).resolves.toBe('requested');
    expect(await saved.getBetterCount()).toBe(2);
    expect(await saved.getLastRequestedAt()).toBe(now);
    expect(review.requestReview).toHaveBeenCalledTimes(1);
  });

  it('skips a later better when a request happened in the last 120 days', async () => {
    const now = 1_700_000_000_000;
    const saved = memory({ betterCount: 4, lastRequestedAt: now - REVIEW_COOLDOWN_MS + 1 });
    const review = storeReview();
    await expect(
      maybeRequestReview({ outcome: 'better', now, memory: saved, storeReview: review }),
    ).resolves.toBe('skipped');
    expect(await saved.getBetterCount()).toBe(5);
    expect(review.requestReview).not.toHaveBeenCalled();
  });

  it('requests again after the 120-day cooldown', async () => {
    const now = 1_700_000_000_000;
    const saved = memory({ betterCount: 4, lastRequestedAt: now - REVIEW_COOLDOWN_MS });
    const review = storeReview();
    await expect(
      maybeRequestReview({ outcome: 'better', now, memory: saved, storeReview: review }),
    ).resolves.toBe('requested');
    expect(await saved.getLastRequestedAt()).toBe(now);
    expect(review.requestReview).toHaveBeenCalledTimes(1);
  });

  it('does not request when Store Review is unavailable', async () => {
    const saved = memory({ betterCount: 1 });
    const review = storeReview(false);
    await expect(maybeRequestReview({ outcome: 'better', memory: saved, storeReview: review })).resolves.toBe(
      'skipped',
    );
    expect(await saved.getLastRequestedAt()).toBeNull();
    expect(review.requestReview).not.toHaveBeenCalled();
  });
});
