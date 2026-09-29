import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform, type AppStateStatus } from 'react-native';

import {
  MOVE_HOLD_MS,
  MOVE_MIN_HOLD_MS,
  MOVE_NOTICE_DWELL_MS,
  MOVE_PRESS_FALLBACK_MS,
  MOVE_RELEASE_MS,
  defaultMoveSequenceId,
  instructionKeyFor,
  isMoveSustainedSessionComplete,
  moveStepId,
  moveSequences,
  nextAfterMoveNotice,
  nextMoveSequenceId,
  type MovePhase,
  type MoveSequence,
  type MoveSequenceId,
} from '@/features/move/steps';
import { useHaptics } from '@/hooks/useHaptics';

function isForeground(state: AppStateStatus): boolean {
  if (Platform.OS === 'web') {
    return state !== 'background';
  }
  return state === 'active';
}

function sequenceById(id: MoveSequenceId): MoveSequence {
  return moveSequences.find((item) => item.id === id) ?? moveSequences[0]!;
}

export function useMoveCycle() {
  const haptics = useHaptics();
  const [sequenceId, setSequenceId] = useState<MoveSequenceId>(defaultMoveSequenceId);
  const [lap, setLap] = useState(0);
  const [phase, setPhase] = useState<MovePhase>('press');
  const [pressed, setPressed] = useState(false);
  const holdStartedAt = useRef<number | null>(null);
  const lightRef = useRef(haptics.light);

  useEffect(() => {
    lightRef.current = haptics.light;
  }, [haptics.light]);

  const sequence = sequenceById(sequenceId);
  const sustainedComplete = isMoveSustainedSessionComplete(sequenceId, lap);
  const instructionKey =
    phase === 'notice' && sustainedComplete ? 'move.noticeFinal' : instructionKeyFor(sequence, phase);
  const stepId = moveStepId(sequenceId, phase);
  const phaseRef = useRef<MovePhase>(phase);

  const goTo = useCallback((next: MovePhase) => {
    if (phaseRef.current === next) {
      return;
    }
    phaseRef.current = next;
    lightRef.current();
    setPhase(next);
  }, []);

  const advanceAfterNotice = useCallback(() => {
    const next = nextAfterMoveNotice(sequenceId, lap);
    if (!next) {
      return;
    }
    holdStartedAt.current = null;
    setPressed(false);
    phaseRef.current = 'press';
    setLap(next.lap);
    setSequenceId(next.sequenceId);
    setPhase('press');
    lightRef.current();
  }, [lap, sequenceId]);

  useEffect(() => {
    if (phase !== 'notice' || sustainedComplete) {
      return;
    }

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let remaining = MOVE_NOTICE_DWELL_MS;
    let runningSince = Date.now();
    let waiting = !isForeground(AppState.currentState);

    const clear = () => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = undefined;
      }
    };

    const schedule = () => {
      clear();
      timeout = setTimeout(() => {
        if (cancelled) {
          return;
        }
        advanceAfterNotice();
      }, remaining);
    };

    const onAppState = (state: AppStateStatus) => {
      if (isForeground(state)) {
        if (waiting) {
          runningSince = Date.now();
          waiting = false;
          schedule();
        }
        return;
      }
      if (!waiting) {
        remaining = Math.max(0, remaining - (Date.now() - runningSince));
        waiting = true;
        clear();
      }
    };

    const subscription = AppState.addEventListener('change', onAppState);
    if (!waiting) {
      schedule();
    }

    return () => {
      cancelled = true;
      clear();
      subscription.remove();
    };
  }, [advanceAfterNotice, phase, sustainedComplete, sequenceId]);

  useEffect(() => {
    if (phase === 'notice') {
      return;
    }

    const duration =
      phase === 'press' ? MOVE_PRESS_FALLBACK_MS : phase === 'hold' ? MOVE_HOLD_MS : MOVE_RELEASE_MS;

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let remaining = duration;
    let runningSince = Date.now();
    let waiting = !isForeground(AppState.currentState);

    const clear = () => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = undefined;
      }
    };

    const advance = () => {
      if (cancelled) {
        return;
      }
      if (phase === 'press') {
        holdStartedAt.current = Date.now();
        goTo('hold');
        return;
      }
      if (phase === 'hold') {
        goTo('release');
        return;
      }
      goTo('notice');
    };

    const schedule = () => {
      clear();
      timeout = setTimeout(advance, remaining);
    };

    const onAppState = (state: AppStateStatus) => {
      if (isForeground(state)) {
        if (waiting) {
          runningSince = Date.now();
          waiting = false;
          schedule();
        }
        return;
      }
      if (!waiting) {
        remaining = Math.max(0, remaining - (Date.now() - runningSince));
        waiting = true;
        clear();
      }
    };

    const subscription = AppState.addEventListener('change', onAppState);
    if (!waiting) {
      schedule();
    }

    return () => {
      cancelled = true;
      clear();
      subscription.remove();
    };
  }, [goTo, phase, sequenceId]);

  const onPressIn = useCallback(() => {
    setPressed(true);
    if (phaseRef.current === 'press') {
      holdStartedAt.current = Date.now();
      goTo('hold');
    }
  }, [goTo]);

  const onPressOut = useCallback(() => {
    setPressed(false);
    const current = phaseRef.current;
    if (current === 'hold') {
      const started = holdStartedAt.current;
      const held = started ? Date.now() - started : 0;
      if (held >= MOVE_MIN_HOLD_MS) {
        goTo('release');
        return;
      }
      holdStartedAt.current = null;
      goTo('press');
      return;
    }
    if (current === 'release') {
      goTo('notice');
    }
  }, [goTo]);

  const tryAnother = useCallback(() => {
    holdStartedAt.current = null;
    setPressed(false);
    phaseRef.current = 'press';
    setLap(0);
    setSequenceId((current) => nextMoveSequenceId(current));
    setPhase('press');
    lightRef.current();
  }, []);

  const selectSequence = useCallback((id: MoveSequenceId) => {
    holdStartedAt.current = null;
    setPressed(false);
    phaseRef.current = 'press';
    setLap(0);
    setSequenceId(id);
    setPhase('press');
    lightRef.current();
  }, []);

  return {
    sequence,
    sequenceId,
    phase,
    stepId,
    pressed,
    instructionKey,
    onPressIn,
    onPressOut,
    tryAnother,
    selectSequence,
  };
}
