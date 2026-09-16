import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
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
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { skipA11yNode } from '@/components/accessibility/hideFromA11y';

import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useTheme } from '@/hooks/useTheme';
import { hexToRgba } from '@/theme/colors';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Variant = 'fan' | 'brown';

type Props = {
  variant: Variant;
  motionActive?: boolean;
};

const FAN_WAVES = [
  { d: 'M18 28 C70 8 150 48 202 24', width: 1.2, base: 0.38, useWave: true },
  { d: 'M14 48 C72 28 148 68 206 46', width: 1.6, base: 0.62, useWave: false },
  { d: 'M20 68 C76 50 146 86 200 70', width: 1.3, base: 0.44, useWave: true },
  { d: 'M24 88 C80 74 140 102 196 90', width: 1.15, base: 0.4, useWave: false },
] as const;

type FanWaveProps = {
  d: string;
  width: number;
  stroke: string;
  base: number;
  useWave: boolean;
  wave: SharedValue<number>;
  swell: SharedValue<number>;
  motionActive: SharedValue<number>;
};

function FanWavePath({ d, width, stroke, base, useWave, wave, swell, motionActive }: FanWaveProps) {
  const animatedProps = useAnimatedProps(() => {
    if (motionActive.value === 0) {
      return { opacity: base };
    }
    const mix = useWave ? wave.value : swell.value;
    return { opacity: base - 0.14 + mix * 0.32 };
  });

  return (
    <AnimatedPath
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      animatedProps={animatedProps}
    />
  );
}

type BrownBlobProps = {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  staticOpacity: number;
  driver: SharedValue<number>;
  motionActive: SharedValue<number>;
};

function BrownBlob({ cx, cy, r, fill, staticOpacity, driver, motionActive }: BrownBlobProps) {
  const animatedProps = useAnimatedProps(() => ({
    opacity:
      motionActive.value === 0 ? staticOpacity : staticOpacity - 0.1 + driver.value * 0.26,
  }));

  return <AnimatedCircle cx={cx} cy={cy} r={r} fill={fill} animatedProps={animatedProps} />;
}

export function ListenGraphic({ variant, motionActive = true }: Props) {
  const { theme } = useTheme();
  const reduceMotion = useReduceMotion();
  const wave = useSharedValue(0.5);
  const swell = useSharedValue(0.5);
  const motionActiveSv = useSharedValue(motionActive && !reduceMotion ? 1 : 0);

  useEffect(() => {
    motionActiveSv.value = motionActive && !reduceMotion ? 1 : 0;
  }, [motionActive, motionActiveSv, reduceMotion]);

  useEffect(() => {
    cancelAnimation(wave);
    cancelAnimation(swell);

    if (reduceMotion || !motionActive) {
      wave.value = 0.5;
      swell.value = 0.5;
      return;
    }

    const timing = (duration: number) =>
      withTiming(1, {
        duration,
        easing: Easing.inOut(Easing.sin),
        reduceMotion: ReduceMotion.Never,
      });

    wave.value = withRepeat(timing(9_200), -1, true);
    swell.value = withRepeat(timing(6_000), -1, true);
  }, [motionActive, reduceMotion, swell, wave]);

  const svgMotion = useAnimatedStyle(() => {
    if (motionActiveSv.value === 0) {
      return { transform: [{ translateX: 0 }, { translateY: 0 }] };
    }
    return {
      transform: [
        { translateX: (wave.value - 0.5) * 14 },
        { translateY: (swell.value - 0.5) * 9 },
      ],
    };
  });

  if (variant === 'brown') {
    const clay = theme.colors.clay;
    const highlight = theme.colors.highlight;
    const forest = theme.colors.forest;

    return (
      <View {...skipA11yNode()} style={styles.frame}>
        <Animated.View style={[styles.svgWrap, svgMotion]}>
          <Svg width="100%" height="100%" viewBox="0 0 220 120" preserveAspectRatio="xMidYMid meet">
            <Rect x="0" y="0" width="220" height="120" fill={hexToRgba(clay, 0.18)} />
            <BrownBlob
              cx={58}
              cy={64}
              r={46}
              fill={hexToRgba(clay, 0.34)}
              staticOpacity={0.34}
              driver={swell}
              motionActive={motionActiveSv}
            />
            <BrownBlob
              cx={122}
              cy={48}
              r={38}
              fill={hexToRgba(highlight, 0.22)}
              staticOpacity={0.22}
              driver={wave}
              motionActive={motionActiveSv}
            />
            <BrownBlob
              cx={168}
              cy={72}
              r={42}
              fill={hexToRgba(forest, 0.2)}
              staticOpacity={0.2}
              driver={swell}
              motionActive={motionActiveSv}
            />
            <BrownBlob
              cx={96}
              cy={88}
              r={28}
              fill={hexToRgba(clay, 0.28)}
              staticOpacity={0.28}
              driver={wave}
              motionActive={motionActiveSv}
            />
          </Svg>
        </Animated.View>
      </View>
    );
  }

  const cool = theme.colors.cool;
  const sage = theme.colors.secondaryGreen;

  return (
    <View {...skipA11yNode()} style={styles.frame}>
      <Animated.View style={[styles.svgWrap, svgMotion]}>
        <Svg width="100%" height="100%" viewBox="0 0 220 120" preserveAspectRatio="xMidYMid meet">
          {FAN_WAVES.map((item, index) => (
            <FanWavePath
              key={item.d}
              d={item.d}
              width={item.width}
              stroke={index % 2 === 0 ? cool : sage}
              base={item.base}
              useWave={item.useWave}
              wave={wave}
              swell={swell}
              motionActive={motionActiveSv}
            />
          ))}
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgWrap: {
    flex: 1,
    width: '100%',
  },
});
