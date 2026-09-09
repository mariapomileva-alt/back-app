import { useActiveSession } from '@/hooks/useActiveSession';
import type { HomeToolId } from '@/types';

/**
 * @deprecated Prefer ActiveSessionScreen / useActiveSession.
 * Close still follows the shared 20-second outcome rule.
 */
export function useExerciseClose(tool: HomeToolId) {
  return useActiveSession(tool).close;
}
