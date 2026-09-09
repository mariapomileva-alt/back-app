import { useRef } from 'react';
import { useRouter } from 'expo-router';

import type { ToolId } from '@/types';

const OUTCOME_AFTER_MS = 20_000;

export function useExerciseClose(tool: ToolId) {
  const router = useRouter();
  const startedAt = useRef(Date.now());

  return () => {
    const durationMs = Date.now() - startedAt.current;
    if (durationMs >= OUTCOME_AFTER_MS) {
      router.replace({
        pathname: '/session/outcome',
        params: { tool, durationMs: String(durationMs) },
      });
      return;
    }
    router.back();
  };
}
