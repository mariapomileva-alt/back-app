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

import { MoveSemanticSvg } from '@/components/move/MoveSemanticSvg';
import { useMoveInk } from '@/components/move/moveInk';
import type { MoveKineticAction } from '@/features/move/visualMap';
import type { MovePhase } from '@/features/move/steps';

const RELEASE_MS = 560;
const PRESS_MS = 340;
const BREATHE_MS = 4600;
const OBJECT_W = 208;
const OBJECT_H = 124;

type Props = {
  action: MoveKineticAction;
  phase: MovePhase;
  reduceMotion: boolean;
};

function compressedAmount(phase: MovePhase): number {
  return phase === 'press' || phase === 'hold' ? 1 : 0;
}

const USE_LAYOUT_MORPH = Platform.OS === 'web';

export function MoveKineticObject({ action, phase, reduceMotion }: Props) {
  const baseInk = useMoveInk();
  const compress = useSharedValue(compressedAmount(phase));
  const shoulderShift = useSharedValue(0);
  const bodyScanPulse = useSharedValue(0);
  const handsUnwind = useSharedValue(0);
  const breathe = useSharedValue(0.5);

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
    cancelAnimation(bodyScanPulse);
    if (action !== 'bodyScan' || reduceMotion) {
      bodyScanPulse.value = 0;
      return;
    }
    if (phase === 'press' || phase === 'hold') {
      bodyScanPulse.value = withRepeat(
        withTiming(1, { duration: 5200, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      );
      return;
    }
    bodyScanPulse.value = withTiming(0, { duration: RELEASE_MS, easing: Easing.out(Easing.cubic) });
  }, [action, bodyScanPulse, phase, reduceMotion]);

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

  useEffect(() => {
    cancelAnimation(breathe);
    if (reduceMotion) {
      breathe.value = 0.5;
      return;
    }
    breathe.value = withRepeat(
      withTiming(1, { duration: BREATHE_MS, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [breathe, reduceMotion]);

  const morphStyle = useAnimatedStyle(() => {
    const c = compress.value;
    const scanBreath = action === 'bodyScan' ? (bodyScanPulse.value - 0.5) * 0.06 : 0;
    const idleY = reduceMotion ? 0 : (breathe.value - 0.5) * 18;
    const vert =
      action === 'pressFeet' || action === 'tenseRelease'
        ? 1 - c * 0.075
        : action === 'hands'
          ? 1 - handsUnwind.value * 0.04
          : action === 'bodyScan'
            ? 1 + scanBreath
            : 1;
    const horiz =
      action === 'pressPalms' || action === 'tenseRelease'
        ? 1 - c * 0.07
        : action === 'hands'
          ? 1 - handsUnwind.value * 0.035
          : action === 'bodyScan'
            ? 1 - scanBreath * 0.85
            : 1;
    const rotate =
      action === 'shoulders'
        ? (shoulderShift.value - 0.5) * 5
        : action === 'hands'
          ? handsUnwind.value * -2.5
          : action === 'bodyScan'
            ? (bodyScanPulse.value - 0.5) * 2.5
            : 0;

    if (USE_LAYOUT_MORPH) {
      return {
        width: OBJECT_W * horiz,
        height: OBJECT_H * vert,
        transform: [{ translateY: idleY }, { rotate: `${rotate}deg` }],
      };
    }

    return {
      transform: [
        { translateY: idleY },
        { scaleX: horiz },
        { scaleY: vert },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const pressDarken = phase === 'press' || phase === 'hold' ? 1.06 : 1;
  const noticeLift = phase === 'notice' ? 0.88 : 1;
  const ink = {
    ...baseInk,
    primaryOpacity: baseInk.primaryOpacity * pressDarken * noticeLift,
    sageOpacity: baseInk.sageOpacity * noticeLift,
    sandOpacity: baseInk.sandOpacity * noticeLift,
  };

  return (
    <View style={styles.shell}>
      <Animated.View style={[styles.morphLayer, morphStyle]}>
        <MoveSemanticSvg action={action} phase={phase} ink={ink} />
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
    overflow: 'visible',
  },
  morphLayer: {
    width: OBJECT_W,
    height: OBJECT_H,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
});
