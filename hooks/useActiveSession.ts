import { useCallback, useEffect, useRef } from 'react';
import { useNavigation, useRouter } from 'expo-router';

import {
  beginInternalSessionNavigation,
  bindSessionAppState,
  consumeInternalSessionNavigation,
  consumeSession,
  releaseSessionVisibility,
  retainSessionVisibility,
  shouldOfferSessionOutcome,
} from '@/features/session/activeSession';
import { recordClosedSession } from '@/storage/history';
import type { HomeToolId } from '@/types';

export type ActiveSessionControls = {
  close: () => void;
  trySomethingElse: () => void;
  tryOfferedAlternatives: (intent: string) => void;
};

export function useActiveSession(
  tool: HomeToolId,
  onCategoryBack?: () => void,
): ActiveSessionControls {
  const router = useRouter();
  const navigation = useNavigation();
  const leavingRef = useRef(false);

  useEffect(() => {
    leavingRef.current = false;
    retainSessionVisibility(tool);
    return () => {
      releaseSessionVisibility();
    };
  }, [tool]);

  const close = useCallback(() => {
    if (leavingRef.current) {
      return;
    }
    leavingRef.current = true;
    const snapshot = consumeSession();
    const elapsedMs = snapshot?.elapsedMs ?? 0;
    const closedTool = snapshot?.tool ?? tool;
    const { id: sessionId } = recordClosedSession({ tool: closedTool, durationMs: elapsedMs });

    // Never route to a paywall from an active session.
    beginInternalSessionNavigation();
    if (shouldOfferSessionOutcome(elapsedMs)) {
      router.replace({
        pathname: '/session/outcome',
        params: { tool: closedTool, durationMs: String(elapsedMs), sessionId },
      });
      return;
    }

    if (router.canGoBack() && navigation.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  }, [navigation, router, tool]);

  const leaveForAlternatives = useCallback(
    (intent?: string) => {
      if (leavingRef.current) {
        return;
      }
      leavingRef.current = true;
      const snapshot = consumeSession();
      const closedTool = snapshot?.tool ?? tool;
      router.replace({
        pathname: '/session/alternatives',
        params: intent
          ? { feeling: 'same', tool: closedTool, intent }
          : { feeling: 'same', tool: closedTool },
      });
    },
    [router, tool],
  );

  const trySomethingElse = useCallback(() => {
    leaveForAlternatives();
  }, [leaveForAlternatives]);

  const tryOfferedAlternatives = useCallback(
    (intent: string) => {
      leaveForAlternatives(intent);
    },
    [leaveForAlternatives],
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      if (leavingRef.current || consumeInternalSessionNavigation()) {
        return;
      }
      event.preventDefault();
      if (onCategoryBack) {
        beginInternalSessionNavigation();
        onCategoryBack();
        return;
      }
      close();
    });

    return unsubscribe;
  }, [close, navigation, onCategoryBack]);

  return { close, trySomethingElse, tryOfferedAlternatives };
}

/** Bind AppState once at the root so background time is not counted as session time. */
export function useBindSessionAppState(): void {
  useEffect(() => bindSessionAppState(), []);
}
