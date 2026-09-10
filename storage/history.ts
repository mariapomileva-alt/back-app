import AsyncStorage from '@react-native-async-storage/async-storage';

import type { SessionOutcome, SessionRecord, ToolId } from '@/types';

import { storageKeys } from './keys';

/** Keep only a short local list. Never uploaded. */
export const HISTORY_CAP = 30;

const TOOL_IDS = new Set<string>([
  'breathe',
  'distract',
  'ground',
  'move',
  'listen',
  'read',
  'call',
]);

let writeChain: Promise<unknown> = Promise.resolve();

function isToolId(value: unknown): value is ToolId {
  return typeof value === 'string' && TOOL_IDS.has(value);
}

function isSessionOutcome(value: unknown): value is SessionOutcome {
  return value === 'better' || value === 'same' || value === 'worse';
}

function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

function clampDurationMs(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }
  return Math.max(0, Math.min(Math.round(value), 86_400_000));
}

function parseRecord(value: unknown): SessionRecord | null {
  if (!value || typeof value !== 'object') {
    return null;
  }
  const raw = value as Partial<SessionRecord>;
  const durationMs = clampDurationMs(raw.durationMs);
  if (
    typeof raw.id !== 'string' ||
    raw.id.length === 0 ||
    !isIsoDate(raw.startedAt) ||
    durationMs === null ||
    !isToolId(raw.tool) ||
    (raw.outcome !== null && !isSessionOutcome(raw.outcome))
  ) {
    return null;
  }
  return {
    id: raw.id,
    startedAt: raw.startedAt,
    durationMs,
    tool: raw.tool,
    outcome: raw.outcome ?? null,
  };
}

function parseHistory(raw: string | null): SessionRecord[] {
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map(parseRecord).filter((item): item is SessionRecord => item !== null).slice(-HISTORY_CAP);
  } catch {
    return [];
  }
}

async function readHistory(): Promise<SessionRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(storageKeys.history);
    return parseHistory(raw);
  } catch {
    return [];
  }
}

async function writeHistory(records: SessionRecord[]): Promise<void> {
  try {
    await AsyncStorage.setItem(storageKeys.history, JSON.stringify(records.slice(-HISTORY_CAP)));
  } catch {
    // Keep using the in-memory list if local storage is unavailable.
  }
}

function enqueueHistory<T>(work: (records: SessionRecord[]) => Promise<T> | T): Promise<T> {
  const run = writeChain.then(async () => work(await readHistory()));
  writeChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export function createSessionId(): string {
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function loadHistory(): Promise<SessionRecord[]> {
  return readHistory();
}

export async function appendSessionRecord(record: SessionRecord): Promise<SessionRecord> {
  return enqueueHistory(async (records) => {
    const next = [...records.filter((item) => item.id !== record.id), record].slice(-HISTORY_CAP);
    await writeHistory(next);
    return record;
  });
}

export function recordClosedSession(input: {
  tool: ToolId;
  durationMs: number;
}): { id: string } {
  const durationMs = clampDurationMs(input.durationMs) ?? 0;
  const record: SessionRecord = {
    id: createSessionId(),
    startedAt: new Date(Date.now() - durationMs).toISOString(),
    durationMs,
    tool: input.tool,
    outcome: null,
  };
  void appendSessionRecord(record);
  return { id: record.id };
}

export async function saveSessionOutcome(
  id: string | undefined,
  outcome: SessionOutcome,
  fallback?: { tool: ToolId; durationMs: number },
): Promise<void> {
  await enqueueHistory(async (records) => {
    if (id) {
      const index = records.findIndex((item) => item.id === id);
      if (index >= 0) {
        const current = records[index];
        if (current) {
          records[index] = { ...current, outcome };
          await writeHistory(records);
          return;
        }
      }
    }

    if (!fallback) {
      return;
    }

    const durationMs = clampDurationMs(fallback.durationMs) ?? 0;
    const record: SessionRecord = {
      id: id && id.length > 0 ? id : createSessionId(),
      startedAt: new Date(Date.now() - durationMs).toISOString(),
      durationMs,
      tool: fallback.tool,
      outcome,
    };
    await writeHistory([...records.filter((item) => item.id !== record.id), record].slice(-HISTORY_CAP));
  });
}

export async function clearHistory(): Promise<void> {
  await enqueueHistory(async () => {
    try {
      await AsyncStorage.removeItem(storageKeys.history);
    } catch {
      // History stays uncleared only if storage is unavailable.
    }
  });
}
