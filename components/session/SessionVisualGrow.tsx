import { type ReactNode } from 'react';
import { Animated, Platform, StyleSheet, View, type ViewStyle } from 'react-native';

import { useStepVisualGrow } from '@/hooks/useStepVisualGrow';

type Props = {
  stepKey: string;
  paused?: boolean;
  children: ReactNode;
};

/** Strong step-scoped grow + subtle breathe (Ground, Move visuals). */
export function SessionVisualGrow({ stepKey, paused = false, children }: Props) {
  const { nativeGrowStyle, webGrowStyle, pulse } = useStepVisualGrow(stepKey, paused);

  const breatheOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.86, 1],
  });

  if (Platform.OS === 'web') {
    const webPulseScale = pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.26],
    });
    return (
      <View style={[styles.wrap, webGrowStyle as ViewStyle]}>
        <Animated.View style={{ transform: [{ scale: webPulseScale }], opacity: breatheOpacity }}>
          {children}
        </Animated.View>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.wrap, nativeGrowStyle, { opacity: breatheOpacity }]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
});
