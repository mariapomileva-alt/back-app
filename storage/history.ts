import type { SessionRecord } from '@/types';

// Stage 3 will persist anonymous session history locally only.

export async function loadHistory(): Promise<SessionRecord[]> {
  return [];
}

export async function clearHistory(): Promise<void> {
  return;
}
