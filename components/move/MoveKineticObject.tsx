import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { MOVE_KINETIC_VIEWBOX, useMoveInk } from '@/components/move/moveInk';
import type { MoveKineticAction } from '@/features/move/visualMap';
import type { MovePhase } from '@/features/move/steps';

const RELEASE_MS = 560;
const PRESS_MS = 340;
const OBJECT_W = 208;
const OBJECT_H = 124;

type Props = {
  action: MoveKineticAction;
  phase: MovePhase;
  reduceMotion: boolean;
};

type BandRole = 'primary' | 'sage' | 'sand';

const BANDS: { d: string; width: number; role: BandRole }[] = [
  { d: 'M22 78 C58 62, 102 92, 178 72', width: 2.15, role: 'primary' },
  { d: 'M30 50 C76 38, 118 54, 170 46', width: 1.7, role: 'sage' },
  { d: 'M44 96 C86 88, 126 102, 158 94', width: 1.45, role: 'sand' },
  { d: 'M52 30 C90 24, 132 36, 166 28', width: 1.55, role: 'sage' },
  { d: 'M64 62 C98 56, 132 68, 154 60', width: 1.25, role: 'sand' },
];

function compressedAmount(phase: MovePhase): number {
  return phase === 'press' || phase === 'hold' ? 1 : 0;
}

const USE_LAYOUT_MORPH = Platform.OS === 'web';

export function MoveKineticObject({ action, phase, reduceMotion }: Props) {
  const ink = useMoveInk();
  const compress = useSharedValue(compressedAmount(phase));
  const shoulderShift = useSharedValue(0);
  const handsUnwind = useSharedValue(0);

  useEffect(() => {
    const target = compressedAmount(phase);
    cancelAnimation(compress);
    if (reduceMotion) {
      compress.value = target;
      return;
    }
    if (phase === 'release') {
      compress.value = withTiming(target, {
        duration: RELEASE_MS,
        easing: Easing.out(Easing.cubic),
      });
      return;
    }
    compress.value = withTiming(target, {
      duration: phase === 'press' ? PRESS_MS : 280,
      easing: Easing.out(Easing.cubic),
    });
  }, [compress, phase, reduceMotion]);

  useEffect(() => {
    cancelAnimation(shoulderShift);
    if (action !== 'shoulders' || reduceMotion) {
      shoulderShift.value = 0;
      return;
    }
    if (phase === 'press' || phase === 'hold') {
      shoulderShift.value = withRepeat(
        withTiming(1, { duration: 4200, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      );
      return;
    }
    shoulderShift.value = withTiming(0, { duration: RELEASE_MS, easing: Easing.out(Easing.cubic) });
  }, [action, phase, reduceMotion, shoulderShift]);

  useEffect(() => {
    cancelAnimation(handsUnwind);
    if (action !== 'hands' || reduceMotion) {
      handsUnwind.value = phase === 'press' || phase === 'hold' ? 1 : 0;
      return;
    }
    if (phase === 'release') {
      handsUnwind.value = withTiming(0, { duration: RELEASE_MS, easing: Easing.out(Easing.cubic) });
      return;
    }
    handsUnwind.value = withTiming(phase === 'notice' ? 0 : 1, {
      duration: phase === 'press' ? PRESS_MS : 240,
      easing: Easing.out(Easing.cubic),
    });
  }, [action, handsUnwind, phase, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => {
    const c = compress.value;
    const vert =
      action === 'pressFeet' || action === 'tenseRelease'
        ? 1 - c * 0.075
        : action === 'hands'
          ? 1 - handsUnwind.value * 0.04
          : 1;
    const horiz =
      action === 'pressPalms' || action === 'tenseRelease'
        ? 1 - c * 0.07
        : action === 'hands'
          ? 1 - handsUnwind.value * 0.035
          : 1;
    const rotate =
      action === 'shoulders' ? (shoulderShift.value - 0.5) * 5 : action === 'hands' ? handsUnwind.value * -2.5 : 0;

    if (USE_LAYOUT_MORPH) {
      return {
        width: OBJECT_W * horiz,
        height: OBJECT_H * vert,
        transform: [{ rotate: `${rotate}deg` }],
      };
    }

    return {
      transform: [{ scaleX: horiz }, { scaleY: vert }, { rotate: `${rotate}deg` }],
    };
  });

  const pressDarken = phase === 'press' || phase === 'hold' ? 1.06 : 1;
  const noticeLift = phase === 'notice' ? 0.88 : 1;
  const motionStatic = reduceMotion;
  const staticCompressed = phase === 'press' || phase === 'hold';

  const primaryOpacity =
    ink.primaryOpacity * (motionStatic && staticCompressed ? 1.08 : pressDarken) * noticeLift;
  const sageOpacity = ink.sageOpacity * noticeLift * (motionStatic && !staticCompressed ? 1.12 : 1);
  const sandOpacity = ink.sandOpacity * noticeLift * (motionStatic && !staticCompressed ? 1.1 : 1);

  const colorFor = (role: BandRole) => {
    switch (role) {
      case 'primary':
        return ink.primary;
      case 'sage':
        return ink.sage;
      case 'sand':
        return ink.sand;
    }
  };

  const opacityFor = (role: BandRole) => {
    switch (role) {
      case 'primary':
        return primaryOpacity;
      case 'sage':
        return sageOpacity;
      case 'sand':
        return sandOpacity;
    }
  };

  return (
    <View style={styles.shell}>
      <Animated.View style={[styles.object, animatedStyle]}>
        <Svg width="100%" height="100%" viewBox={MOVE_KINETIC_VIEWBOX} preserveAspectRatio="xMidYMid meet">
          {BANDS.map((band) => (
            <Path
              key={band.d}
              d={band.d}
              fill="none"
              stroke={colorFor(band.role)}
              strokeWidth={band.width}
              strokeLinecap="round"
              opacity={opacityFor(band.role)}
            />
          ))}
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: OBJECT_W,
    height: OBJECT_H,
    maxWidth: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  object: {
    width: OBJECT_W,
    height: OBJECT_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
