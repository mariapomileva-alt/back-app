import { useEffect, useState } from 'react';
import { Animated, Easing } from 'react-native';

const LOOP_MS = 2800;

/** 0–1 pulse for hold/ripple/roll. Cancelled on unmount (step change). */
export function useMoveLoop(active: boolean): number {
  const [value, setValue] = useState(0.5);

  useEffect(() => {
    if (!active) {
      return;
    }

    const pulse = new Animated.Value(0);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: LOOP_MS,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: LOOP_MS,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ]),
    );
    const sub = pulse.addListener(({ value: next }) => {
      setValue(next);
    });
    loop.start();

    return () => {
      loop.stop();
      pulse.stopAnimation();
      pulse.removeListener(sub);
    };
  }, [active]);

  return active ? value : 0.5;
}
