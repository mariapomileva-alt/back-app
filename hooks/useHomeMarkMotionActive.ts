import { useEffect, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useIsFocused } from 'expo-router';

import { useReduceMotion } from '@/hooks/useReduceMotion';

/** Home tool marks — pause ambient motion off Home, in background, or when reduce motion is on. */
export function useHomeMarkMotionActive(): boolean {
  const reduceMotion = useReduceMotion();
  const isFocused = useIsFocused();
  const [appActive, setAppActive] = useState(() => AppState.currentState === 'active');

  useEffect(() => {
    const onChange = (state: AppStateStatus) => {
      setAppActive(state === 'active');
    };
    const subscription = AppState.addEventListener('change', onChange);
    return () => subscription.remove();
  }, []);

  return isFocused && appActive && !reduceMotion;
}
