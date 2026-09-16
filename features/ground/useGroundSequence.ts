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
  if (activeId !== sequenceId) {
    setActiveId(sequenceId);
    setIndex(0);
  }
  const first = index <= 0;
  const last = index >= steps.length - 1;
  const instructionKey = steps[index] ?? steps[0]!;
  const lightRef = useRef(haptics.light);

  useEffect(() => {
    lightRef.current = haptics.light;
  }, [haptics.light]);

  useEffect(() => {
    if (paused || last) {
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
        setIndex((current) => Math.min(current + 1, steps.length - 1));
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
  }, [index, last, paused, steps.length]);

  const next = useCallback(() => {
    setIndex((current) => {
      if (current >= steps.length - 1) {
        return current;
      }
      lightRef.current();
      return current + 1;
    });
  }, [steps.length]);

  const prev = useCallback(() => {
    setIndex((current) => {
      if (current <= 0) {
        return current;
      }
      lightRef.current();
      return current - 1;
    });
  }, []);

  const reset = useCallback(() => {
    setIndex(0);
  }, []);

  return {
    index,
    first,
    last,
    instructionKey,
    next,
    prev,
    reset,
  };
}
