import { useCallback, useEffect, useRef } from 'react';
import { useNavigation, useRouter } from 'expo-router';

import {
  bindSessionAppState,
  consumeInternalSessionNavigation,
  consumeSession,
  shouldOfferSessionOutcome,
  startOrContinueSession,
} from '@/features/session/activeSession';
import type { HomeToolId } from '@/types';

export type ActiveSessionControls = {
  close: () => void;
  trySomethingElse: () => void;
};

export function useActiveSession(tool: HomeToolId): ActiveSessionControls {
  const router = useRouter();
  const navigation = useNavigation();
  const leavingRef = useRef(false);

  useEffect(() => {
    startOrContinueSession(tool);
  }, [tool]);

  const close = useCallback(() => {
    if (leavingRef.current) {
      return;
    }
    leavingRef.current = true;
    const snapshot = consumeSession();
    const elapsedMs = snapshot?.elapsedMs ?? 0;
    const closedTool = snapshot?.tool ?? tool;

    // Never route to a paywall from an active session.
    if (shouldOfferSessionOutcome(elapsedMs)) {
      router.replace({
        pathname: '/session/outcome',
        params: { tool: closedTool, durationMs: String(elapsedMs) },
      });
      return;
    }

    if (navigation.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  }, [navigation, router, tool]);

  const trySomethingElse = useCallback(() => {
    if (leavingRef.current) {
      return;
    }
    leavingRef.current = true;
    const snapshot = consumeSession();
    const closedTool = snapshot?.tool ?? tool;
    router.replace({
      pathname: '/session/alternatives',
      params: { feeling: 'same', tool: closedTool },
    });
  }, [router, tool]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      if (leavingRef.current || consumeInternalSessionNavigation()) {
        return;
      }
      event.preventDefault();
      close();
    });

    return unsubscribe;
  }, [close, navigation]);

  return { close, trySomethingElse };
}

/** Bind AppState once at the root so background time is not counted as session time. */
export function useBindSessionAppState(): void {
  useEffect(() => bindSessionAppState(), []);
}
