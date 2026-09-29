import { AppState, Platform, type AppStateStatus } from 'react-native';

import type { HomeToolId } from '@/types';

/** Close/I’m okay for now opens the outcome flow after this much active time. */
export const SESSION_OUTCOME_AFTER_MS = 20_000;

type ActiveSession = {
  tool: HomeToolId;
  accumulatedMs: number;
  segmentStartedAt: number | null;
};

let session: ActiveSession | null = null;
let appState: AppStateStatus = AppState.currentState;
let allowInternalNavigation = false;
let appStateBound = false;
let visibleToolScreens = 0;

function pauseSessionClock(): void {
  if (!session || session.segmentStartedAt === null) {
    return;
  }
  session.accumulatedMs += Date.now() - session.segmentStartedAt;
  session.segmentStartedAt = null;
}

function isForeground(state: AppStateStatus): boolean {
  if (Platform.OS === 'web') {
    return state !== 'background';
  }
  return state === 'active';
}

export function isHomeToolId(value: string | undefined | null): value is HomeToolId {
  return (
    value === 'breathe' ||
    value === 'distract' ||
    value === 'ground' ||
    value === 'move' ||
    value === 'listen' ||
    value === 'read'
  );
}

/**
 * Start a session for a tool, or keep the existing one when the user stays
 * inside the same category (e.g. Distract chooser ↔ activity).
 */
export function startOrContinueSession(tool: HomeToolId): void {
  if (session?.tool === tool) {
    if (session.segmentStartedAt === null && isForeground(appState)) {
      session.segmentStartedAt = Date.now();
    }
    return;
  }

  session = {
    tool,
    accumulatedMs: 0,
    segmentStartedAt: isForeground(appState) ? Date.now() : null,
  };
}

export function syncSessionAppState(next: AppStateStatus): void {
  if (!session) {
    appState = next;
    return;
  }

  const wasForeground = isForeground(appState);
  const nowForeground = isForeground(next);
  appState = next;

  if (wasForeground && !nowForeground && session.segmentStartedAt !== null) {
    session.accumulatedMs += Date.now() - session.segmentStartedAt;
    session.segmentStartedAt = null;
    return;
  }

  if (!wasForeground && nowForeground && session.segmentStartedAt === null) {
    session.segmentStartedAt = Date.now();
  }
}

export function getSessionElapsedMs(): number {
  if (!session) {
    return 0;
  }
  const live = session.segmentStartedAt !== null ? Date.now() - session.segmentStartedAt : 0;
  return session.accumulatedMs + live;
}

export function getActiveSessionTool(): HomeToolId | null {
  return session?.tool ?? null;
}

/** True while a tool screen is visible — language changes stay blocked until the session ends. */
export function isActiveSessionVisible(): boolean {
  return visibleToolScreens > 0;
}

export function shouldOfferSessionOutcome(elapsedMs = getSessionElapsedMs()): boolean {
  return elapsedMs >= SESSION_OUTCOME_AFTER_MS;
}

export function consumeSession(): { tool: HomeToolId; elapsedMs: number } | null {
  visibleToolScreens = 0;
  if (!session) {
    return null;
  }
  const snapshot = { tool: session.tool, elapsedMs: getSessionElapsedMs() };
  session = null;
  return snapshot;
}

/** Count a visible tool screen so Home / leftover mounts cannot keep the clock running. */
export function retainSessionVisibility(tool: HomeToolId): void {
  startOrContinueSession(tool);
  visibleToolScreens += 1;
}

export function releaseSessionVisibility(): void {
  visibleToolScreens = Math.max(0, visibleToolScreens - 1);
  if (visibleToolScreens === 0) {
    pauseSessionClock();
  }
}

/**
 * Allow a stack change that stays inside the current tool (Distract chooser ↔ activity)
 * without treating it as Close / I’m okay for now.
 */
export function beginInternalSessionNavigation(): void {
  allowInternalNavigation = true;
}

export function consumeInternalSessionNavigation(): boolean {
  if (!allowInternalNavigation) {
    return false;
  }
  allowInternalNavigation = false;
  return true;
}

export function bindSessionAppState(): () => void {
  if (appStateBound) {
    return () => undefined;
  }

  appStateBound = true;
  appState = AppState.currentState;
  const subscription = AppState.addEventListener('change', syncSessionAppState);

  return () => {
    appStateBound = false;
    subscription.remove();
  };
}
