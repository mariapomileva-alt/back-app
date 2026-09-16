import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform, type AppStateStatus } from 'react-native';

import {
  GROUND_STEP_MS,
  defaultGroundSequenceId,
  stepsForGroundSequence,
  type GroundSequenceId,
} from '@/features/ground/steps';
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
  const [activeId, setActiveId] = useState(sequenceId);
  const [forwardTransition, setForwardTransition] = useState(false);
  const [stepEnter, setStepEnter] = useState<'none' | 'forward' | 'back'>('none');
  if (activeId !== sequenceId) {
    setActiveId(sequenceId);
    setIndex(0);
    setForwardTransition(false);
    setStepEnter('none');
  }
  const first = index <= 0;
  const last = index >= steps.length - 1;
  const instructionKey = steps[index] ?? steps[0]!;
  const lightRef = useRef(haptics.light);

  useEffect(() => {
    lightRef.current = haptics.light;
  }, [haptics.light]);

  useEffect(() => {
    if (paused || last || forwardTransition) {
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
        lightRef.current();
        setForwardTransition(true);
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
  }, [forwardTransition, index, last, paused, steps.length]);

  const finishForwardTransition = useCallback(() => {
    setForwardTransition(false);
    setStepEnter('forward');
    setIndex((current) => Math.min(current + 1, steps.length - 1));
  }, [steps.length]);

  const acknowledgeStepEnter = useCallback(() => {
    setStepEnter('none');
  }, []);

  const next = useCallback(() => {
    if (last || forwardTransition) {
      return;
    }
    lightRef.current();
    setForwardTransition(true);
  }, [forwardTransition, last]);

  const prev = useCallback(() => {
    if (forwardTransition) {
      setForwardTransition(false);
    }
    setIndex((current) => {
      if (current <= 0) {
        return current;
      }
      lightRef.current();
      setStepEnter('back');
      return current - 1;
    });
  }, [forwardTransition]);

  const reset = useCallback(() => {
    setForwardTransition(false);
    setStepEnter('none');
    setIndex(0);
  }, []);

  return {
    index,
    first,
    last,
    instructionKey,
    forwardTransition,
    stepEnter,
    next,
    prev,
    reset,
    finishForwardTransition,
    acknowledgeStepEnter,
  };
}
