import {
  consumeSession,
  getActiveSessionTool,
  getSessionElapsedMs,
  startOrContinueSession,
} from '@/features/session/activeSession';
import type { HomeToolId } from '@/types';

/** Thin access to the shared active-session store. */
export function useSession() {
  return {
    tool: getActiveSessionTool(),
    elapsedMs: getSessionElapsedMs(),
    start: (tool: HomeToolId) => startOrContinueSession(tool),
    end: () => consumeSession(),
  };
}
