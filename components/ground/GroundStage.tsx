import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import Svg, { Ellipse, Path } from 'react-native-svg';

import { skipA11yNode } from '@/components/accessibility/hideFromA11y';
import { GroundMark } from '@/components/marks';
import { GROUND_STEP_MS } from '@/features/ground/steps';
import {
  GROUND_STEP_SCALE_END,
  GROUND_STEP_SCALE_START,
} from '@/features/ground/transitions';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/theme/spacing';

const CSS_GROW_EASE = 'cubic-bezier(0.45, 0, 0.55, 1)';

type Props = {
  stepKey: string;
  paused: boolean;
};

function growRemainingMs(fromScale: number): number {
  const span = GROUND_STEP_SCALE_END - GROUND_STEP_SCALE_START;
  if (span <= 0) {
    return GROUND_STEP_MS;
  }
  const progress = (fromScale - GROUND_STEP_SCALE_START) / span;
  return Math.max(48, Math.round(GROUND_STEP_MS * (1 - Math.min(1, Math.max(0, progress)))));
}

export function GroundStage({ stepKey, paused }: Props) {
  const { theme } = useTheme();
  const reduceMotion = useReduceMotion();
  const [pulse] = useState(() => new Animated.Value(0));
  const [scale] = useState(() => new Animated.Value(GROUND_STEP_SCALE_START));
  const [webScale, setWebScale] = useState(GROUND_STEP_SCALE_START);
  const [webScaleDuration, setWebScaleDuration] = useState(0);
  const [webScaleEase, setWebScaleEase] = useState(CSS_GROW_EASE);
  const growAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const pausedGrowRef = useRef(false);
  const webGrowFromRef = useRef(GROUND_STEP_SCALE_START);
  const webGrowDurationRef = useRef(GROUND_STEP_MS);
  const webGrowStartRef = useRef(0);
  const sage = theme.colors.secondaryGreen;
  const mound = theme.colors.organic;

  const stopGrowAnim = useCallback(() => {
    growAnimRef.current?.stop();
    growAnimRef.current = null;
  }, []);

  const startNativeGrow = useCallback(
    (fromScale: number) => {
      stopGrowAnim();
      if (reduceMotion) {
        scale.setValue(GROUND_STEP_SCALE_START);
        return;
      }
      const from = Math.max(GROUND_STEP_SCALE_START, Math.min(GROUND_STEP_SCALE_END, fromScale));
      scale.setValue(from);
      const duration = growRemainingMs(from);
      growAnimRef.current = Animated.timing(scale, {
        toValue: GROUND_STEP_SCALE_END,
        duration,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false,
      });
      growAnimRef.current.start();
    },
    [reduceMotion, scale, stopGrowAnim],
  );

  const startWebGrow = useCallback(
    (fromScale: number) => {
      if (reduceMotion) {
        setWebScale(GROUND_STEP_SCALE_START);
        setWebScaleDuration(0);
        return;
      }
      const from = Math.max(GROUND_STEP_SCALE_START, Math.min(GROUND_STEP_SCALE_END, fromScale));
      const duration = growRemainingMs(from);
      webGrowFromRef.current = from;
      webGrowDurationRef.current = duration;
      webGrowStartRef.current = Date.now();
      setWebScale(from);
      setWebScaleDuration(0);
      requestAnimationFrame(() => {
        setWebScaleEase(CSS_GROW_EASE);
        setWebScaleDuration(duration);
        setWebScale(GROUND_STEP_SCALE_END);
      });
    },
    [reduceMotion],
  );

  const webScaleAtElapsed = useCallback((elapsedMs: number) => {
    const from = webGrowFromRef.current;
    const duration = webGrowDurationRef.current;
    const t = duration <= 0 ? 1 : Math.min(1, Math.max(0, elapsedMs / duration));
    return from + (GROUND_STEP_SCALE_END - from) * t;
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
          duration: 4200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 4200,
          easing: Easing.inOut(Easing.quad),
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
      requestAnimationFrame(() => startWebGrow(GROUND_STEP_SCALE_START));
    } else {
      startNativeGrow(GROUND_STEP_SCALE_START);
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
      const from = typeof current === 'number' ? current : GROUND_STEP_SCALE_START;
      startNativeGrow(from);
    });
  }, [paused, reduceMotion, scale, startNativeGrow, startWebGrow, webScaleAtElapsed]);

  useEffect(() => () => stopGrowAnim(), [stopGrowAnim]);

  const groundOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.42, 0.7],
  });
  const lineOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.16, 0.3],
  });

  const markAndGround = (
    <>
      <View style={styles.mark}>
        <GroundMark />
      </View>
      <Animated.View style={[styles.ground, { opacity: groundOpacity }]}>
        <Svg width="100%" height="100%" viewBox="0 0 220 36" preserveAspectRatio="xMidYMid meet">
          <Ellipse cx="110" cy="22" rx="78" ry="8" fill={mound} />
          <Path
            d="M110 22 V8"
            fill="none"
            stroke={sage}
            strokeWidth={1.2}
            strokeLinecap="round"
            opacity={0.55}
          />
          <Path
            d="M48 20 C78 14 142 14 172 20"
            fill="none"
            stroke={sage}
            strokeWidth={1.15}
            strokeLinecap="round"
            opacity={0.38}
          />
        </Svg>
      </Animated.View>
      <Animated.View style={[styles.quietLine, { backgroundColor: sage, opacity: lineOpacity }]} />
    </>
  );

  const illustration =
    Platform.OS === 'web' && !reduceMotion ? (
      <View
        style={
          [
            styles.illustration,
            {
              transform: [{ scale: webScale }],
              transformOrigin: 'center center',
              transitionProperty: 'transform',
              transitionDuration: `${webScaleDuration}ms`,
              transitionTimingFunction: webScaleEase,
            },
          ] as unknown as ViewStyle
        }
      >
        {markAndGround}
      </View>
    ) : (
      <Animated.View style={[styles.illustration, { transform: [{ scale }] }]}>
        {markAndGround}
      </Animated.View>
    );

  return (
    <View {...skipA11yNode()} style={styles.stage}>
      {illustration}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    gap: spacing.md,
    overflow: 'visible',
  },
  illustration: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  mark: {
    width: 196,
    height: 118,
  },
  ground: {
    width: 220,
    height: 36,
    marginTop: -spacing.sm,
  },
  quietLine: {
    width: 36,
    height: 2,
    borderRadius: 2,
    marginTop: spacing.sm,
  },
});
