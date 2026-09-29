import {
  beginReadSession,
  createReadSession,
  rememberShownId,
} from '@/features/read/attentionEngine';
import { resolveReadLanguage } from '@/features/read/language';
import { loadReadPack } from '@/features/read/packs';
import { defaultReadMemory, type ReadMemory, type ReadSession } from '@/features/read/types';

export function bootstrapReadSession(memory: ReadMemory = defaultReadMemory): {
  memory: ReadMemory;
  session: ReadSession;
} {
  const readLanguage = resolveReadLanguage(memory.language);
  const session = createReadSession(loadReadPack(readLanguage), memory);
  const started = beginReadSession(memory, session);
  const first = session.fragments[0];
  const withFirst = first ? rememberShownId(started, first.itemId, first.storyId) : started;
  return { memory: withFirst, session };
}
