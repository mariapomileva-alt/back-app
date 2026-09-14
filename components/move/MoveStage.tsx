import { useEffect, useState } from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Ellipse, Path } from 'react-native-svg';

import { MoveMark } from '@/components/marks';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useTheme } from '@/hooks/useTheme';
import { spacing, touch } from '@/theme/spacing';

type Props = {
  pressed: boolean;
  instruction: string;
  hint: string;
  onPressIn: () => void;
  onPressOut: () => void;
};

export function MoveStage({ pressed, instruction, hint, onPressIn, onPressOut }: Props) {
  const { theme } = useTheme();
  const reduceMotion = useReduceMotion();
  const [contact] = useState(() => new Animated.Value(0));
  const sage = theme.colors.secondaryGreen;

  useEffect(() => {
    Animated.timing(contact, {
      toValue: pressed ? 1 : 0,
      duration: reduceMotion ? 1 : 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [contact, pressed, reduceMotion]);

  const scale = contact.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.97],
  });
  const translateY = contact.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 5],
  });
  const lineScale = contact.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.86],
  });
  const lineOpacity = contact.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={instruction}
      accessibilityHint={hint}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.press}
    >
      <Animated.View
        style={[
          styles.visual,
          {
            transform: [{ translateY }, { scale }],
          },
        ]}
      >
        <View style={styles.mark}>
          <MoveMark />
        </View>
        <Animated.View style={[styles.contact, { opacity: lineOpacity, transform: [{ scaleX: lineScale }] }]}>
          <Svg width="100%" height="100%" viewBox="0 0 160 28" preserveAspectRatio="xMidYMid meet">
            <Ellipse cx="80" cy="16" rx="36" ry="5" fill={sage} opacity={0.16} />
            <Path
              d="M52 16 H108"
              fill="none"
              stroke={sage}
              strokeWidth={1.2}
              strokeLinecap="round"
              opacity={0.45}
            />
          </Svg>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    minHeight: touch.min,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  visual: {
    alignItems: 'center',
    width: '100%',
  },
  mark: {
    width: 280,
    height: 168,
  },
  contact: {
    width: 160,
    height: 28,
    marginTop: -spacing.sm,
  },
});
