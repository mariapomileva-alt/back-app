import { shuffle } from '@/features/distract/shuffle';

import { sessionPatterns, storySlotCount, type SessionPattern } from './patterns';
import { splitPhrases } from './phrases';
import {
  readThreads,
  threadFactItem,
  threadLookItem,
  threadMatches,
  threadObserveItem,
  threadWordItem,
  type ReadThread,
} from './threads';
import type {
  ReadContentItem,
  ReadMemory,
  ReadPack,
  ReadSession,
  ReadSlotType,
  RevealFragment,
} from './types';

export const READ_RECENT_LIMIT = 200;
export const READ_COOLDOWN_SESSIONS = 40;
const PATTERN_MEMORY = 8;
const THREAD_MEMORY = 5;

type PoolItem = {
  id: string;
  topics: string[];
};

function recentSet(ids: string[]): Set<string> {
  return new Set(ids);
}

function cooldownIds(memory: ReadMemory): Set<string> {
  const blocked = new Set<string>();
  const threshold = memory.sessionCount - READ_COOLDOWN_SESSIONS;
  for (const [id, seenAt] of Object.entries(memory.lastSeenAt)) {
    if (seenAt > threshold) {
      blocked.add(id);
    }
  }
  return blocked;
}

function leastRecentlySeen<T extends PoolItem>(items: T[], memory: ReadMemory): T[] {
  return [...items].sort((left, right) => {
    const leftSeen = memory.lastSeenAt[left.id] ?? -1;
    const rightSeen = memory.lastSeenAt[right.id] ?? -1;
    if (leftSeen !== rightSeen) {
      return leftSeen - rightSeen;
    }
    const leftRecent = memory.recentBlockIds.lastIndexOf(left.id);
    const rightRecent = memory.recentBlockIds.lastIndexOf(right.id);
    return leftRecent - rightRecent;
  });
}

function topicOverlap(left: string[], right: string[]): number {
  if (left.length === 0 || right.length === 0) {
    return 0;
  }
  return left.reduce((count, topic) => (right.includes(topic) ? count + 1 : count), 0);
}

function pickFromWindow<T extends PoolItem>(items: T[], memory: ReadMemory, lastTopics: string[]): T | undefined {
  if (items.length === 0) {
    return undefined;
  }
  const sorted = leastRecentlySeen(items, memory);
  const earliest = memory.lastSeenAt[sorted[0]!.id] ?? -1;
  const tier = sorted.filter((item) => (memory.lastSeenAt[item.id] ?? -1) === earliest);
  const varied =
    lastTopics.length === 0
      ? tier
      : [...tier].sort(
          (left, right) => topicOverlap(left.topics, lastTopics) - topicOverlap(right.topics, lastTopics),
        );
  const window = varied.slice(0, Math.min(5, varied.length));
  return shuffle(window)[0] ?? sorted[0];
}

function pickFromPool<T extends PoolItem>(
  items: T[],
  memory: ReadMemory,
  usedInSession: Set<string>,
  thread: ReadThread,
  lastTopics: string[],
): T | undefined {
  if (items.length === 0) {
    return undefined;
  }

  const recent = recentSet(memory.recentBlockIds);
  const cooling = cooldownIds(memory);
  const available = items.filter((item) => !usedInSession.has(item.id));
  const unseen = available.filter((item) => !recent.has(item.id) && !cooling.has(item.id));
  const notCooling = available.filter((item) => !cooling.has(item.id));
  const matching = (pool: T[]) => pool.filter((item) => threadMatches(item.topics, thread));

  const unseenMatch = matching(unseen);
  if (unseenMatch.length > 0) {
    return pickFromWindow(unseenMatch, memory, lastTopics);
  }
  const freshMatch = matching(notCooling);
  if (freshMatch.length > 0) {
    return pickFromWindow(freshMatch, memory, lastTopics);
  }
  const availableMatch = matching(available);
  if (availableMatch.length > 0) {
    return pickFromWindow(availableMatch, memory, lastTopics) ?? leastRecentlySeen(availableMatch, memory)[0];
  }
  if (unseen.length > 0) {
    return pickFromWindow(unseen, memory, lastTopics);
  }
  if (notCooling.length > 0) {
    return pickFromWindow(notCooling, memory, lastTopics);
  }
  return leastRecentlySeen(available.length > 0 ? available : items, memory)[0];
}

function pickPattern(memory: ReadMemory, stories: ReadContentItem[]): SessionPattern {
  const recentPatterns = new Set(memory.patternHistory.slice(-PATTERN_MEMORY));
  const withStories = sessionPatterns.filter((pattern) => {
    const needed = storySlotCount(pattern);
    if (needed === 0) {
      return true;
    }
    return stories.length >= needed;
  });
  const pool = withStories.length > 0 ? withStories : sessionPatterns;
  const fresh = pool.filter((pattern) => !recentPatterns.has(pattern.id));
  const candidates = fresh.length > 0 ? fresh : pool;
  const chosen = shuffle(candidates.length > 0 ? candidates : pool)[0];
  return chosen ?? pool[0] ?? sessionPatterns[0]!;
}

function pickThread(pack: ReadPack, memory: ReadMemory): ReadThread {
  const recent = new Set((memory.threadHistory ?? []).slice(-THREAD_MEMORY));
  const usable = readThreads.filter((thread) =>
    pack.microStories.some((story) => threadMatches(story.topics, thread)),
  );
  const pool = usable.length > 0 ? usable : readThreads;
  const fresh = pool.filter((thread) => !recent.has(thread.id));
  const chosen = shuffle(fresh.length > 0 ? fresh : pool)[0];
  return chosen ?? pool[0] ?? readThreads[0]!;
}

function poolForSlot(pack: ReadPack, slot: ReadSlotType, thread: ReadThread): ReadContentItem[] {
  if (slot === 'micro_story') {
    return pack.microStories;
  }
  if (slot === 'curious') {
    return [...pack.curious, threadFactItem(thread)];
  }
  if (slot === 'word') {
    return [...pack.words, threadWordItem(thread)];
  }
  if (slot === 'environment') {
    return [...pack.environments, threadLookItem(thread)];
  }
  return [...pack.observations, threadObserveItem(thread)];
}

function toFragments(item: ReadContentItem): RevealFragment[] {
  const lines = splitPhrases(item.fragments.join(' '), item.fragments);
  const fragments: RevealFragment[] = lines.map((text, index) => ({
    id: `${item.id}:${index}`,
    itemId: item.id,
    storyId: item.type === 'micro_story' ? item.id : undefined,
    kind: item.type,
    text,
  }));

  const followUp = item.followUp;
  if (followUp?.type === 'environment') {
    fragments.push({
      id: `${item.id}:follow`,
      itemId: item.id,
      storyId: item.type === 'micro_story' ? item.id : undefined,
      kind: 'environment',
      text: followUp.text,
    });
  }
  if (followUp?.type === 'choice') {
    fragments.push({
      id: `${item.id}:follow`,
      itemId: item.id,
      storyId: item.type === 'micro_story' ? item.id : undefined,
      kind: 'environment',
      text: followUp.text,
    });
  }

  return fragments;
}

function appendSlot(
  pack: ReadPack,
  memory: ReadMemory,
  slot: ReadSlotType,
  thread: ReadThread,
  usedIds: Set<string>,
  fragments: RevealFragment[],
  itemIds: string[],
  storyIds: string[],
  lastTopics: string[],
): string[] {
  const pool = poolForSlot(pack, slot, thread);
  const eligible =
    slot === 'micro_story' ? pool.filter((item) => !storyIds.includes(item.id)) : pool;
  const item = pickFromPool(eligible.length > 0 ? eligible : pool, memory, usedIds, thread, lastTopics);
  if (!item) {
    return lastTopics;
  }
  usedIds.add(item.id);
  itemIds.push(item.id);
  if (item.type === 'micro_story') {
    storyIds.push(item.id);
  }
  fragments.push(...toFragments(item));

  if (slot === 'word' && storyIds.length > 0) {
    fragments.push({
      id: `${item.id}:recall`,
      itemId: item.id,
      kind: 'environment',
      text: thread.recall,
    });
  }

  return item.topics;
}

function buildFromPattern(
  pack: ReadPack,
  memory: ReadMemory,
  pattern: SessionPattern,
  thread: ReadThread,
  usedIds: Set<string>,
): Pick<ReadSession, 'itemIds' | 'storyIds' | 'fragments'> {
  const fragments: RevealFragment[] = [];
  const itemIds: string[] = [];
  const storyIds: string[] = [];
  let lastTopics: string[] = [];

  for (const slot of pattern.slots) {
    lastTopics = appendSlot(pack, memory, slot, thread, usedIds, fragments, itemIds, storyIds, lastTopics);
  }

  return { itemIds, storyIds, fragments };
}

export function createReadSession(pack: ReadPack, memory: ReadMemory): ReadSession {
  const thread = pickThread(pack, memory);
  const pattern = pickPattern(memory, pack.microStories);
  const built = buildFromPattern(pack, memory, pattern, thread, new Set<string>());
  return {
    patternId: pattern.id,
    threadId: thread.id,
    ...built,
  };
}

export function extendReadSession(pack: ReadPack, memory: ReadMemory, session: ReadSession): ReadSession {
  const usedIds = new Set(session.itemIds);
  const thread = pickThread(pack, {
    ...memory,
    threadHistory: [...(memory.threadHistory ?? []), session.threadId],
  });
  const recentPatterns = new Set([...memory.patternHistory, session.patternId].slice(-PATTERN_MEMORY));
  const fresh = sessionPatterns.filter((pattern) => !recentPatterns.has(pattern.id));
  const pool = fresh.length > 0 ? fresh : sessionPatterns.filter((pattern) => pattern.id !== session.patternId);
  const pattern = shuffle(pool.length > 0 ? pool : sessionPatterns)[0] ?? sessionPatterns[0]!;
  const extra = buildFromPattern(pack, memory, pattern, thread, usedIds);
  return {
    ...session,
    threadId: thread.id,
    itemIds: [...session.itemIds, ...extra.itemIds],
    storyIds: [...session.storyIds, ...extra.storyIds],
    fragments: [...session.fragments, ...extra.fragments],
  };
}

export function rememberShownId(memory: ReadMemory, blockId: string, storyId?: string): ReadMemory {
  const sessionNumber = Math.max(memory.sessionCount, 1);
  const lastSeenAt = { ...memory.lastSeenAt, [blockId]: sessionNumber };
  const recentBlockIds = memory.recentBlockIds.filter((id) => id !== blockId);
  recentBlockIds.push(blockId);
  while (recentBlockIds.length > READ_RECENT_LIMIT) {
    recentBlockIds.shift();
  }

  const usedStoryIds =
    storyId && !memory.usedStoryIds.includes(storyId)
      ? [...memory.usedStoryIds, storyId].slice(-READ_RECENT_LIMIT)
      : storyId
        ? [...memory.usedStoryIds.filter((id) => id !== storyId), storyId]
        : memory.usedStoryIds;

  return {
    ...memory,
    recentBlockIds,
    usedStoryIds,
    lastSeenAt,
  };
}

export function beginReadSession(memory: ReadMemory, session: ReadSession): ReadMemory {
  const sessionNumber = memory.sessionCount + 1;
  const lastSeenAt = { ...memory.lastSeenAt };
  const staleBefore = sessionNumber - READ_COOLDOWN_SESSIONS - 10;
  for (const [id, seenAt] of Object.entries(lastSeenAt)) {
    if (seenAt < staleBefore) {
      delete lastSeenAt[id];
    }
  }

  return {
    ...memory,
    sessionCount: sessionNumber,
    lastSeenAt,
    patternHistory: [...memory.patternHistory, session.patternId].slice(-PATTERN_MEMORY * 2),
    threadHistory: [...(memory.threadHistory ?? []), session.threadId].slice(-THREAD_MEMORY * 2),
  };
}
