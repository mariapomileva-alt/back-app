import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  cancelAnimation,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { G, Path } from 'react-native-svg';

import { MOVE_KINETIC_VIEWBOX, useMoveInk } from '@/components/move/moveInk';
import type { MoveKineticAction } from '@/features/move/visualMap';
import type { MovePhase } from '@/features/move/steps';

const AnimatedG = Animated.createAnimatedComponent(G);

const RELEASE_MS = 560;
const PRESS_MS = 340;
/** Always-on idle wave — independent of press/hold morph and step transitions. */
const ARC_DRIFT_MS = 12_500;
const ARC_SHIMMER_MS = 9_200;
const ARC_SWELL_MS = 14_000;
const OBJECT_W = 208;
const OBJECT_H = 124;

const WEB_WAVE_STYLE_ID = 'move-kinetic-wave-keyframes';
const USE_WEB_CSS_WAVES = Platform.OS === 'web';

const WEB_BAND_DELAYS_S = ['0s', '-1.4s', '-2.6s', '-0.8s', '-3.1s'] as const;
const WEB_BAND_DURATIONS_S = ['9.2s', '10.6s', '11.4s', '8.8s', '12.5s'] as const;

function ensureWebWaveKeyframes() {
  if (!USE_WEB_CSS_WAVES || typeof document === 'undefined') {
    return;
  }
  if (document.getElementById(WEB_WAVE_STYLE_ID)) {
    return;
  }
  const style = document.createElement('style');
  style.id = WEB_WAVE_STYLE_ID;
  style.textContent = `
@keyframes move-kinetic-idle-drift {
  0%, 100% { transform: translate3d(-10px, -7px, 0); }
  50% { transform: translate3d(10px, 7px, 0); }
}
@keyframes move-kinetic-band-drift {
  0%, 100% { transform: translate3d(-8px, -5px, 0); }
  50% { transform: translate3d(8px, 5px, 0); }
}
.move-kinetic-band-wave {
  animation-name: move-kinetic-band-drift;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  will-change: transform;
}
.move-kinetic-band-wave-0 { animation-delay: ${WEB_BAND_DELAYS_S[0]}; animation-duration: ${WEB_BAND_DURATIONS_S[0]}; }
.move-kinetic-band-wave-1 { animation-delay: ${WEB_BAND_DELAYS_S[1]}; animation-duration: ${WEB_BAND_DURATIONS_S[1]}; }
.move-kinetic-band-wave-2 { animation-delay: ${WEB_BAND_DELAYS_S[2]}; animation-duration: ${WEB_BAND_DURATIONS_S[2]}; }
.move-kinetic-band-wave-3 { animation-delay: ${WEB_BAND_DELAYS_S[3]}; animation-duration: ${WEB_BAND_DURATIONS_S[3]}; }
.move-kinetic-band-wave-4 { animation-delay: ${WEB_BAND_DELAYS_S[4]}; animation-duration: ${WEB_BAND_DURATIONS_S[4]}; }
`;
  document.head.appendChild(style);
}

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

type ArcBandProps = {
  bandIndex: number;
  d: string;
  width: number;
  stroke: string;
  baseOpacity: number;
  phaseOffset: number;
  drift: SharedValue<number>;
  shimmer: SharedValue<number>;
  swell: SharedValue<number>;
  motionActive: SharedValue<number>;
  reduceMotion: boolean;
};

function ArcBand({
  bandIndex,
  d,
  width,
  stroke,
  baseOpacity,
  phaseOffset,
  drift,
  shimmer,
  swell,
  motionActive,
  reduceMotion,
}: ArcBandProps) {
  const animatedProps = useAnimatedProps(() => {
    if (motionActive.value === 0) {
      return {
        opacity: baseOpacity,
        transform: [{ translateX: 0 }, { translateY: 0 }],
      };
    }
    const t = drift.value - 0.5;
    const s = shimmer.value - 0.5;
    const w = swell.value - 0.5;
    const mix = drift.value * (1 - phaseOffset * 0.35) + shimmer.value * phaseOffset * 0.65;
    const bandX = t * (11 + phaseOffset * 3.5) + w * phaseOffset * 2.4;
    const bandY = s * (6 + phaseOffset * 2.4) - w * (2.4 - phaseOffset * 0.6);
    return {
      opacity: baseOpacity * (0.8 + mix * 0.32),
      transform: [{ translateX: bandX }, { translateY: bandY }],
    };
  });

  if (USE_WEB_CSS_WAVES) {
    const bandClass = reduceMotion
      ? undefined
      : `move-kinetic-band-wave move-kinetic-band-wave-${bandIndex}`;
    return (
      <G className={bandClass}>
        <Path d={d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" opacity={baseOpacity} />
      </G>
    );
  }

  return (
    <AnimatedG animatedProps={animatedProps}>
      <Path d={d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" />
    </AnimatedG>
  );
}

const USE_LAYOUT_MORPH = Platform.OS === 'web';

export function MoveKineticObject({ action, phase, reduceMotion }: Props) {
  const ink = useMoveInk();
  const compress = useSharedValue(compressedAmount(phase));
  const shoulderShift = useSharedValue(0);
  const handsUnwind = useSharedValue(0);
  const arcDrift = useSharedValue(0.5);
  const arcShimmer = useSharedValue(0.5);
  const arcSwell = useSharedValue(0.5);
  const motionActiveSv = useSharedValue(reduceMotion ? 0 : 1);

  useEffect(() => {
    ensureWebWaveKeyframes();
  }, []);

  useEffect(() => {
    motionActiveSv.value = reduceMotion ? 0 : 1;
  }, [motionActiveSv, reduceMotion]);

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

  useEffect(() => {
    cancelAnimation(arcDrift);
    cancelAnimation(arcShimmer);
    cancelAnimation(arcSwell);
    if (reduceMotion || USE_WEB_CSS_WAVES) {
      arcDrift.value = 0.5;
      arcShimmer.value = 0.5;
      arcSwell.value = 0.5;
      return;
    }
    const timing = (duration: number) =>
      withTiming(1, {
        duration,
        easing: Easing.inOut(Easing.sin),
        reduceMotion: ReduceMotion.Never,
      });

    arcDrift.value = withRepeat(timing(ARC_DRIFT_MS), -1, true);
    arcShimmer.value = withRepeat(timing(ARC_SHIMMER_MS), -1, true);
    arcSwell.value = withRepeat(timing(ARC_SWELL_MS), -1, true);
  }, [arcDrift, arcShimmer, arcSwell, reduceMotion]);

  const arcIdleStyle = useAnimatedStyle(() => {
    if (motionActiveSv.value === 0) {
      return { transform: [{ translateX: 0 }, { translateY: 0 }] };
    }
    const t = arcDrift.value - 0.5;
    const s = arcShimmer.value - 0.5;
    return {
      transform: [{ translateX: t * 12 }, { translateY: s * 9 }],
    };
  });

  const morphStyle = useAnimatedStyle(() => {
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

  const baseOpacityFor = (role: BandRole) => {
    switch (role) {
      case 'primary':
        return primaryOpacity;
      case 'sage':
        return sageOpacity;
      case 'sand':
        return sandOpacity;
    }
  };

  const webIdleWaveStyle =
    USE_WEB_CSS_WAVES && !reduceMotion
      ? ({
          animationName: 'move-kinetic-idle-drift',
          animationDuration: `${ARC_DRIFT_MS}ms`,
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
          animationDirection: 'alternate',
          willChange: 'transform',
        } as const)
      : undefined;

  const kineticSvg = (
    <Animated.View style={[styles.morphLayer, morphStyle]}>
      <Svg width="100%" height="100%" viewBox={MOVE_KINETIC_VIEWBOX} preserveAspectRatio="xMidYMid meet">
        {BANDS.map((band, index) => (
          <ArcBand
            key={band.d}
            bandIndex={index}
            d={band.d}
            width={band.width}
            stroke={colorFor(band.role)}
            baseOpacity={baseOpacityFor(band.role)}
            phaseOffset={index / BANDS.length}
            drift={arcDrift}
            shimmer={arcShimmer}
            swell={arcSwell}
            motionActive={motionActiveSv}
            reduceMotion={reduceMotion}
          />
        ))}
      </Svg>
    </Animated.View>
  );

  return (
    <View style={styles.shell}>
      {USE_WEB_CSS_WAVES ? (
        <View style={[styles.idleLayer, webIdleWaveStyle]}>
          {kineticSvg}
        </View>
      ) : (
        <Animated.View style={[styles.idleLayer, arcIdleStyle]}>{kineticSvg}</Animated.View>
      )}
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
  idleLayer: {
    width: OBJECT_W,
    height: OBJECT_H,
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
