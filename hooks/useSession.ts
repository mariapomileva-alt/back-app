import { useRef, useState } from 'react';

import type { ToolId } from '@/types';

type SessionState = {
  tool: ToolId | null;
  startedAt: number | null;
  isActive: boolean;
};

const idle: SessionState = {
  tool: null,
  startedAt: null,
  isActive: false,
};

export function useSession() {
  const [session, setSession] = useState<SessionState>(idle);
  const startedAtRef = useRef<number | null>(null);

  return {
    session,
    start: (tool: ToolId) => {
      const startedAt = Date.now();
      startedAtRef.current = startedAt;
      setSession({ tool, startedAt, isActive: true });
    },
    end: () => {
      const startedAt = startedAtRef.current;
      const durationMs = startedAt ? Date.now() - startedAt : 0;
      setSession(idle);
      startedAtRef.current = null;
      return durationMs;
    },
  };
}
