import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import Svg, { Ellipse, Path } from 'react-native-svg';

import { skipA11yNode } from '@/components/accessibility/hideFromA11y';
import { GroundMark } from '@/components/marks';
import {
  GROUND_BACK_SCALE_DIP,
  GROUND_BACK_SCALE_MS,
  GROUND_FORWARD_RESET_MS,
  GROUND_FORWARD_SCALE_MS,
  GROUND_FORWARD_SCALE_PEAK,
} from '@/features/ground/transitions';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/theme/spacing';

const CSS_EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
const CSS_EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';

type Props = {
  stepKey: string;
  stepEnter: 'none' | 'forward' | 'back';
  forwardTransition: boolean;
  paused: boolean;
  onForwardTransitionComplete: () => void;
  onStepEnterHandled: () => void;
};

export function GroundStage({
  stepKey,
  stepEnter,
  forwardTransition,
  paused,
  onForwardTransitionComplete,
  onStepEnterHandled,
}: Props) {
  const { theme } = useTheme();
  const reduceMotion = useReduceMotion();
  const [pulse] = useState(() => new Animated.Value(0));
  const [scale] = useState(() => new Animated.Value(1));
  const [webScale, setWebScale] = useState(1);
  const [webScaleDuration, setWebScaleDuration] = useState(0);
  const [webScaleEase, setWebScaleEase] = useState(CSS_EASE_OUT);
  const prevStepKeyRef = useRef(stepKey);
  const forwardAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const scaleAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const forwardStartedRef = useRef(false);
  const pausedForwardRef = useRef(false);
  const webCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const webPausedRemainingRef = useRef(GROUND_FORWARD_SCALE_MS);
  const completeRef = useRef(onForwardTransitionComplete);
  const sage = theme.colors.secondaryGreen;
  const mound = theme.colors.organic;

  useEffect(() => {
    completeRef.current = onForwardTransitionComplete;
  }, [onForwardTransitionComplete]);

  const stopScaleAnims = () => {
    forwardAnimRef.current?.stop();
    scaleAnimRef.current?.stop();
    forwardAnimRef.current = null;
    scaleAnimRef.current = null;
  };

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
    if (prevStepKeyRef.current === stepKey) {
      return;
    }
    prevStepKeyRef.current = stepKey;
    forwardStartedRef.current = false;
    scaleAnimRef.current?.stop();

    if (stepEnter === 'forward') {
      if (Platform.OS === 'web') {
        requestAnimationFrame(() => {
          setWebScaleDuration(GROUND_FORWARD_RESET_MS);
          setWebScaleEase(CSS_EASE_IN);
          setWebScale(1);
        });
      } else {
        scaleAnimRef.current = Animated.timing(scale, {
          toValue: 1,
          duration: GROUND_FORWARD_RESET_MS,
          easing: Easing.in(Easing.quad),
          useNativeDriver: false,
        });
        scaleAnimRef.current.start();
      }
    } else if (stepEnter === 'back' && !reduceMotion) {
      if (Platform.OS === 'web') {
        requestAnimationFrame(() => {
          setWebScale(GROUND_BACK_SCALE_DIP);
          setWebScaleDuration(GROUND_BACK_SCALE_MS);
          setWebScaleEase(CSS_EASE_OUT);
          requestAnimationFrame(() => setWebScale(1));
        });
      } else {
        scale.setValue(GROUND_BACK_SCALE_DIP);
        scaleAnimRef.current = Animated.timing(scale, {
          toValue: 1,
          duration: GROUND_BACK_SCALE_MS,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        });
        scaleAnimRef.current.start();
      }
    } else {
      scale.setValue(1);
      requestAnimationFrame(() => {
        setWebScale(1);
        setWebScaleDuration(0);
      });
    }

    requestAnimationFrame(() => onStepEnterHandled());
  }, [onStepEnterHandled, reduceMotion, scale, stepEnter, stepKey]);

  useEffect(() => {
    if (!forwardTransition) {
      forwardStartedRef.current = false;
      pausedForwardRef.current = false;
      return;
    }
    if (forwardStartedRef.current) {
      return;
    }
    forwardStartedRef.current = true;

    if (reduceMotion) {
      completeRef.current();
      return;
    }

    if (Platform.OS === 'web') {
      webPausedRemainingRef.current = GROUND_FORWARD_SCALE_MS;
      requestAnimationFrame(() => {
        setWebScale(1);
        setWebScaleDuration(0);
        requestAnimationFrame(() => {
          setWebScaleDuration(GROUND_FORWARD_SCALE_MS);
          setWebScaleEase(CSS_EASE_OUT);
          setWebScale(GROUND_FORWARD_SCALE_PEAK);
        });
      });
      return;
    }

    stopScaleAnims();
    scale.setValue(1);
    forwardAnimRef.current = Animated.timing(scale, {
      toValue: GROUND_FORWARD_SCALE_PEAK,
      duration: GROUND_FORWARD_SCALE_MS,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    });
    forwardAnimRef.current.start(({ finished }) => {
      if (finished && !pausedForwardRef.current) {
        completeRef.current();
      }
    });
  }, [forwardTransition, reduceMotion, scale]);

  useEffect(() => {
    if (!forwardTransition || reduceMotion) {
      return;
    }

    if (paused) {
      pausedForwardRef.current = true;
      forwardAnimRef.current?.stop();
      return;
    }

    if (!pausedForwardRef.current) {
      return;
    }
    pausedForwardRef.current = false;

    if (Platform.OS === 'web') {
      return;
    }

    scale.stopAnimation((current) => {
      const from = typeof current === 'number' ? current : 1;
      const remaining = Math.max(
        48,
        Math.round(((GROUND_FORWARD_SCALE_PEAK - from) / (GROUND_FORWARD_SCALE_PEAK - 1)) * GROUND_FORWARD_SCALE_MS),
      );
      forwardAnimRef.current = Animated.timing(scale, {
        toValue: GROUND_FORWARD_SCALE_PEAK,
        duration: remaining,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      });
      forwardAnimRef.current.start(({ finished }) => {
        if (finished) {
          completeRef.current();
        }
      });
    });
  }, [forwardTransition, paused, reduceMotion, scale]);

  useEffect(() => {
    if (Platform.OS !== 'web' || !forwardTransition || reduceMotion) {
      return;
    }

    if (paused) {
      pausedForwardRef.current = true;
      if (webCompleteTimeoutRef.current) {
        clearTimeout(webCompleteTimeoutRef.current);
        webCompleteTimeoutRef.current = undefined;
      }
      return;
    }

    pausedForwardRef.current = false;
    const delay = webPausedRemainingRef.current;
    webCompleteTimeoutRef.current = setTimeout(() => {
      webCompleteTimeoutRef.current = undefined;
      if (!pausedForwardRef.current) {
        completeRef.current();
      }
    }, delay);

    return () => {
      if (webCompleteTimeoutRef.current) {
        clearTimeout(webCompleteTimeoutRef.current);
        webCompleteTimeoutRef.current = undefined;
      }
    };
  }, [forwardTransition, paused, reduceMotion]);

  useEffect(() => () => stopScaleAnims(), []);

  const groundOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.42, 0.7],
  });
  const lineOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.16, 0.3],
  });

  const illustration =
    Platform.OS === 'web' && !reduceMotion ? (
      <View
        style={
          [
            styles.illustration,
            {
              transform: [{ scale: webScale }],
              transitionProperty: 'transform',
              transitionDuration: `${webScaleDuration}ms`,
              transitionTimingFunction: webScaleEase,
            },
          ] as unknown as ViewStyle
        }
      >
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
      </View>
    ) : (
      <Animated.View style={[styles.illustration, { transform: [{ scale }] }]}>
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
