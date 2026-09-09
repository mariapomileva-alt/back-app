import { beginReadSession, createReadSession, rememberShownId } from './attentionEngine';
import { loadReadPack } from './packs';
import { readThreads, threadMatches } from './threads';
import { defaultReadMemory, type ReadMemory } from './types';

export type SimulationReport = {
  openings: number;
  uniqueFirstItems: number;
  uniqueFirstTexts: number;
  uniqueItemIds: number;
  uniquePatterns: number;
  uniqueStories: number;
  mixedStories: number;
  threadMisses: number;
  shortSessions: number;
  minItems: number;
  maxItems: number;
  minFragments: number;
  maxFragments: number;
};

function storyIsContiguous(fragments: { storyId?: string }[], storyId: string): boolean {
  const indices = fragments
    .map((fragment, index) => (fragment.storyId === storyId ? index : -1))
    .filter((index) => index >= 0);
  if (indices.length <= 1) {
    return true;
  }
  const first = indices[0]!;
  const last = indices[indices.length - 1]!;
  return last - first + 1 === indices.length;
}

export function simulateReadOpenings(openings: number): SimulationReport {
  const pack = loadReadPack();
  let memory: ReadMemory = { ...defaultReadMemory, lastSeenAt: {} };
  const firstItems = new Set<string>();
  const firstTexts = new Set<string>();
  const itemIds = new Set<string>();
  const patterns = new Set<string>();
  const stories = new Set<string>();
  let mixedStories = 0;
  let threadMisses = 0;
  let shortSessions = 0;
  let minItems = Number.POSITIVE_INFINITY;
  let maxItems = 0;
  let minFragments = Number.POSITIVE_INFINITY;
  let maxFragments = 0;

  for (let opening = 0; opening < openings; opening += 1) {
    const session = createReadSession(pack, memory);
    memory = beginReadSession(memory, session);

    for (const storyId of session.storyIds) {
      stories.add(storyId);
      if (!storyIsContiguous(session.fragments, storyId)) {
        mixedStories += 1;
      }
    }

    const thread = readThreads.find((item) => item.id === session.threadId);
    for (const itemId of session.itemIds) {
      memory = rememberShownId(memory, itemId, session.storyIds.includes(itemId) ? itemId : undefined);
      itemIds.add(itemId);
    }

    if (thread) {
      const all = [
        ...pack.microStories,
        ...pack.curious,
        ...pack.words,
        ...pack.observations,
        ...pack.environments,
      ];
      for (const itemId of session.itemIds) {
        if (itemId.startsWith('thread-')) {
          continue;
        }
        const item = all.find((entry) => entry.id === itemId);
        if (item && !threadMatches(item.topics, thread)) {
          threadMisses += 1;
        }
      }
    }

    const first = session.itemIds[0];
    if (first) {
      firstItems.add(first);
    }
    const firstFragment = session.fragments[0];
    if (firstFragment) {
      firstTexts.add(firstFragment.text);
    }
    patterns.add(session.patternId);
    minItems = Math.min(minItems, session.itemIds.length);
    maxItems = Math.max(maxItems, session.itemIds.length);
    minFragments = Math.min(minFragments, session.fragments.length);
    maxFragments = Math.max(maxFragments, session.fragments.length);
    if (session.itemIds.length < 8 || session.fragments.length < 16) {
      shortSessions += 1;
    }
  }

  return {
    openings,
    uniqueFirstItems: firstItems.size,
    uniqueFirstTexts: firstTexts.size,
    uniqueItemIds: itemIds.size,
    uniquePatterns: patterns.size,
    uniqueStories: stories.size,
    mixedStories,
    threadMisses,
    shortSessions,
    minItems: Number.isFinite(minItems) ? minItems : 0,
    maxItems,
    minFragments: Number.isFinite(minFragments) ? minFragments : 0,
    maxFragments,
  };
}
