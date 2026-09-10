import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Ellipse, Path } from 'react-native-svg';

import { GroundMark } from '@/components/marks';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/theme/spacing';

export function GroundStage() {
  const { theme } = useTheme();
  const reduceMotion = useReduceMotion();
  const [pulse] = useState(() => new Animated.Value(0));
  const sage = theme.colors.secondaryGreen;
  const mound = theme.colors.organic;

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
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 4200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, reduceMotion]);

  const groundOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.42, 0.7],
  });
  const lineOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.16, 0.3],
  });

  return (
    <View style={styles.stage} accessible={false} importantForAccessibility="no">
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
