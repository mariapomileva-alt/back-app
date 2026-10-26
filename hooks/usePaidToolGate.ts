import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';

import { hasToolAccess } from '@/config/backPlus';
import { openBackPlusPaywall } from '@/features/subscription/openBackPlusPaywall';
import { useBackPlusAccess } from '@/features/subscription/useBackPlusAccess';

/**
 * Redirects to Back Plus when the user opens a paid tool without entitlement.
 * Do not use on safety routes (Extra support, emergency, Call my person, legal, subscription info).
 * Do not use on Breathe or Listen — they stay free forever.
 */
export function usePaidToolGate(toolId?: string): void {
  const router = useRouter();
  const { accessState, hasPaidAccess } = useBackPlusAccess();
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (accessState === 'loading' || redirectedRef.current) {
      return;
    }
    const allowed = toolId ? hasToolAccess(toolId, accessState) : hasPaidAccess;
    if (!allowed) {
      redirectedRef.current = true;
      openBackPlusPaywall(router);
    }
  }, [accessState, hasPaidAccess, router, toolId]);
}
