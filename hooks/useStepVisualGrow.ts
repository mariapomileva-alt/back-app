import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, type ViewStyle } from 'react-native';

import {
  SESSION_VISUAL_GROW_MS,
  SESSION_VISUAL_SCALE_END,
  SESSION_VISUAL_SCALE_START,
} from '@/features/ground/transitions';
import { useReduceMotion } from '@/hooks/useReduceMotion';

const CSS_GROW_EASE = 'cubic-bezier(0.22, 0.61, 0.36, 1)';

function growRemainingMs(fromScale: number): number {
  const span = SESSION_VISUAL_SCALE_END - SESSION_VISUAL_SCALE_START;
  if (span <= 0) {
    return SESSION_VISUAL_GROW_MS;
  }
  const progress = (fromScale - SESSION_VISUAL_SCALE_START) / span;
  return Math.max(64, Math.round(SESSION_VISUAL_GROW_MS * (1 - Math.min(1, Math.max(0, progress)))));
}

type Result = {
  /** Wrap illustration content (native Animated.View props). */
  nativeGrowStyle: { transform: { scale: Animated.AnimatedInterpolation<number> }[] };
  /** Web CSS transition grow wrapper. */
  webGrowStyle: ViewStyle;
  /** 0–1 breathing pulse for extra life on the illustration. */
  pulse: Animated.Value;
  pulseScale: Animated.AnimatedInterpolation<number>;
};

export function useStepVisualGrow(stepKey: string, paused: boolean): Result {
  const reduceMotion = useReduceMotion();
  const [scale] = useState(() => new Animated.Value(SESSION_VISUAL_SCALE_START));
  const [pulse] = useState(() => new Animated.Value(0));
  const [webScale, setWebScale] = useState(SESSION_VISUAL_SCALE_START);
  const [webScaleDuration, setWebScaleDuration] = useState(0);
  const growAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const pausedGrowRef = useRef(false);
  const webGrowFromRef = useRef(SESSION_VISUAL_SCALE_START);
  const webGrowDurationRef = useRef(SESSION_VISUAL_GROW_MS);
  const webGrowStartRef = useRef(0);

  const stopGrowAnim = useCallback(() => {
    growAnimRef.current?.stop();
    growAnimRef.current = null;
  }, []);

  const startNativeGrow = useCallback(
    (fromScale: number) => {
      stopGrowAnim();
      if (reduceMotion) {
        scale.setValue(SESSION_VISUAL_SCALE_START);
        return;
      }
      const from = Math.max(SESSION_VISUAL_SCALE_START, Math.min(SESSION_VISUAL_SCALE_END, fromScale));
      scale.setValue(from);
      const duration = growRemainingMs(from);
      growAnimRef.current = Animated.timing(scale, {
        toValue: SESSION_VISUAL_SCALE_END,
        duration,
        easing: Easing.bezier(0.22, 0.61, 0.36, 1),
        useNativeDriver: false,
      });
      growAnimRef.current.start();
    },
    [reduceMotion, scale, stopGrowAnim],
  );

  const startWebGrow = useCallback(
    (fromScale: number) => {
      if (reduceMotion) {
        setWebScale(SESSION_VISUAL_SCALE_START);
        setWebScaleDuration(0);
        return;
      }
      const from = Math.max(SESSION_VISUAL_SCALE_START, Math.min(SESSION_VISUAL_SCALE_END, fromScale));
      const duration = growRemainingMs(from);
      webGrowFromRef.current = from;
      webGrowDurationRef.current = duration;
      webGrowStartRef.current = Date.now();
      setWebScale(from);
      setWebScaleDuration(0);
      requestAnimationFrame(() => {
        setWebScaleDuration(duration);
        setWebScale(SESSION_VISUAL_SCALE_END);
      });
    },
    [reduceMotion],
  );

  const webScaleAtElapsed = useCallback((elapsedMs: number) => {
    const from = webGrowFromRef.current;
    const duration = webGrowDurationRef.current;
    const t = duration <= 0 ? 1 : Math.min(1, Math.max(0, elapsedMs / duration));
    return from + (SESSION_VISUAL_SCALE_END - from) * t;
  }, []);

  useEffect(() => {
    if (stepKey && !reduceMotion) {
      pulse.setValue(0);
    }
  }, [pulse, reduceMotion, stepKey]);

  useEffect(() => {
    if (reduceMotion) {
      pulse.setValue(0.35);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 4800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 4800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, reduceMotion]);

  useEffect(() => {
    pausedGrowRef.current = false;
    if (Platform.OS === 'web') {
      requestAnimationFrame(() => startWebGrow(SESSION_VISUAL_SCALE_START));
    } else {
      startNativeGrow(SESSION_VISUAL_SCALE_START);
    }
  }, [startNativeGrow, startWebGrow, stepKey]);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    if (paused) {
      pausedGrowRef.current = true;
      if (Platform.OS === 'web') {
        const elapsed = Date.now() - webGrowStartRef.current;
        setWebScale(webScaleAtElapsed(elapsed));
        setWebScaleDuration(0);
      } else {
        growAnimRef.current?.stop();
      }
      return;
    }
    if (!pausedGrowRef.current) {
      return;
    }
    pausedGrowRef.current = false;
    if (Platform.OS === 'web') {
      const elapsed = Date.now() - webGrowStartRef.current;
      const from = webScaleAtElapsed(elapsed);
      requestAnimationFrame(() => startWebGrow(from));
      return;
    }
    scale.stopAnimation((current) => {
      const from = typeof current === 'number' ? current : SESSION_VISUAL_SCALE_START;
      startNativeGrow(from);
    });
  }, [paused, reduceMotion, scale, startNativeGrow, startWebGrow, webScaleAtElapsed]);

  useEffect(() => () => stopGrowAnim(), [stopGrowAnim]);

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.26],
  });

  const combinedScale =
    Platform.OS === 'web' || reduceMotion
      ? scale
      : Animated.multiply(scale, pulseScale);

  const nativeGrowStyle = {
    transform: [{ scale: combinedScale as Animated.Value }],
  };

  const webGrowStyle: ViewStyle =
    Platform.OS === 'web' && !reduceMotion
      ? {
          transform: [{ scale: webScale }],
          transformOrigin: 'center center',
          transitionProperty: 'transform',
          transitionDuration: `${webScaleDuration}ms`,
          transitionTimingFunction: CSS_GROW_EASE,
        }
      : {};

  return { nativeGrowStyle, webGrowStyle, pulse, pulseScale };
}
