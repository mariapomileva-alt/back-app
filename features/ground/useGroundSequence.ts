import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform, type AppStateStatus } from 'react-native';

import {
  GROUND_STEP_MS,
  defaultGroundSequenceId,
  stepsForGroundSequence,
  type GroundSequenceId,
} from '@/features/ground/steps';
import { INSTRUCTION_CROSSFADE_LOCK_MS } from '@/features/ground/transitions';
import { useHaptics } from '@/hooks/useHaptics';

function isForeground(state: AppStateStatus): boolean {
  if (Platform.OS === 'web') {
    return state !== 'background';
  }
  return state === 'active';
}

export function useGroundSequence(
  paused: boolean,
  sequenceId: GroundSequenceId = defaultGroundSequenceId,
) {
  const haptics = useHaptics();
  const steps = stepsForGroundSequence(sequenceId);
  const [index, setIndex] = useState(0);
  const [crossfadeBusy, setCrossfadeBusy] = useState(false);
  const [stepEnter, setStepEnter] = useState<'none' | 'forward' | 'back'>('none');

  useEffect(() => {
    setIndex(0);
    setCrossfadeBusy(false);
    setStepEnter('none');
  }, [sequenceId]);

  const first = index <= 0;
  const last = index >= steps.length - 1;
  const instructionKey = steps[index] ?? steps[0]!;
  const lightRef = useRef(haptics.light);
  const crossfadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    lightRef.current = haptics.light;
  }, [haptics.light]);

  const advanceStep = useCallback(() => {
    if (last) {
      return;
    }
    lightRef.current();
    setCrossfadeBusy(true);
    setStepEnter('forward');
    setIndex((current) => Math.min(current + 1, steps.length - 1));
    if (crossfadeTimerRef.current) {
      clearTimeout(crossfadeTimerRef.current);
    }
    crossfadeTimerRef.current = setTimeout(() => {
      setCrossfadeBusy(false);
      crossfadeTimerRef.current = null;
    }, INSTRUCTION_CROSSFADE_LOCK_MS);
  }, [last, steps.length]);

  useEffect(() => {
    return () => {
      if (crossfadeTimerRef.current) {
        clearTimeout(crossfadeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (paused || last || crossfadeBusy) {
      return;
    }

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let remaining = GROUND_STEP_MS;
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
        advanceStep();
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
  }, [advanceStep, crossfadeBusy, index, last, paused, steps.length]);

  const acknowledgeStepEnter = useCallback(() => {
    setStepEnter('none');
  }, []);

  const next = useCallback(() => {
    if (last || crossfadeBusy) {
      return;
    }
    advanceStep();
  }, [advanceStep, crossfadeBusy, last]);

  const prev = useCallback(() => {
    if (crossfadeBusy) {
      return;
    }
    setIndex((current) => {
      if (current <= 0) {
        return current;
      }
      lightRef.current();
      setStepEnter('back');
      setCrossfadeBusy(true);
      if (crossfadeTimerRef.current) {
        clearTimeout(crossfadeTimerRef.current);
      }
      crossfadeTimerRef.current = setTimeout(() => {
        setCrossfadeBusy(false);
        crossfadeTimerRef.current = null;
      }, INSTRUCTION_CROSSFADE_LOCK_MS);
      return current - 1;
    });
  }, [crossfadeBusy]);

  const reset = useCallback(() => {
    setCrossfadeBusy(false);
    setStepEnter('none');
    setIndex(0);
  }, []);

  return {
    index,
    first,
    last,
    instructionKey,
    stepEnter,
    next,
    prev,
    reset,
    acknowledgeStepEnter,
  };
}
