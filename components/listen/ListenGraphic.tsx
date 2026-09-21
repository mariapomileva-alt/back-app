import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { skipA11yNode } from '@/components/accessibility/hideFromA11y';

import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useTheme } from '@/hooks/useTheme';
import { hexToRgba } from '@/theme/colors';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Variant =
  | 'rain'
  | 'ocean'
  | 'forest'
  | 'fan'
  | 'brown'
  | 'stream'
  | 'birds'
  | 'white'
  | 'melody';

type Props = {
  variant: Variant;
  motionActive?: boolean;
};

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
    const opacity = base - 0.32 + mix * 0.72;
    return { opacity: Math.min(1, Math.max(0.08, opacity)) };
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
  const animatedProps = useAnimatedProps(() => {
    if (motionActive.value === 0) {
      return { opacity: staticOpacity };
    }
    const opacity = staticOpacity - 0.22 + driver.value * 0.58;
    return { opacity: Math.min(1, Math.max(0.08, opacity)) };
  });

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
      });

    wave.value = withRepeat(timing(9_200), -1, true);
    swell.value = withRepeat(timing(6_000), -1, true);
  }, [motionActive, reduceMotion, swell, wave]);

  const sage = theme.colors.secondaryGreen;
  const cool = theme.colors.cool;
  const forestTone = theme.colors.forest;

  if (variant === 'rain') {
    const streaks = [
      { x: 42, h: 52 },
      { x: 68, h: 44 },
      { x: 94, h: 58 },
      { x: 118, h: 48 },
      { x: 142, h: 54 },
      { x: 166, h: 46 },
    ] as const;

    return (
      <View {...skipA11yNode()} style={styles.frame}>
        <View style={styles.svgWrap}>
          <Svg width="100%" height="100%" viewBox="0 0 220 120" preserveAspectRatio="xMidYMid meet">
            <Path
              d="M0 78 C55 68 110 86 220 74"
              stroke={hexToRgba(sage, 0.22)}
              strokeWidth={1.1}
              fill="none"
            />
            {streaks.map((item, index) => (
              <FanWavePath
                key={item.x}
                d={`M${item.x} 28 L${item.x - 3} ${28 + item.h}`}
                width={1.1}
                stroke={hexToRgba(cool, 0.38)}
                base={0.28 + (index % 3) * 0.08}
                useWave={index % 2 === 0}
                wave={wave}
                swell={swell}
                motionActive={motionActiveSv}
              />
            ))}
          </Svg>
        </View>
      </View>
    );
  }

  if (variant === 'ocean') {
    const swells = [
      { d: 'M0 62 C48 52 96 72 148 58 S220 68 220 58', width: 1.5, base: 0.48 },
      { d: 'M0 78 C52 70 104 88 156 76 S220 82 220 74', width: 1.2, base: 0.34 },
      { d: 'M0 94 C60 88 120 98 220 92', width: 1, base: 0.22 },
    ] as const;

    return (
      <View {...skipA11yNode()} style={styles.frame}>
        <View style={styles.svgWrap}>
          <Svg width="100%" height="100%" viewBox="0 0 220 120" preserveAspectRatio="xMidYMid meet">
            {swells.map((item, index) => (
              <FanWavePath
                key={item.d}
                d={item.d}
                width={item.width}
                stroke={hexToRgba(index === 0 ? cool : sage, item.base + 0.2)}
                base={item.base}
                useWave={index !== 2}
                wave={wave}
                swell={swell}
                motionActive={motionActiveSv}
              />
            ))}
          </Svg>
        </View>
      </View>
    );
  }

  if (variant === 'forest') {
    const trunks = [48, 88, 128, 168] as const;

    return (
      <View {...skipA11yNode()} style={styles.frame}>
        <View style={styles.svgWrap}>
          <Svg width="100%" height="100%" viewBox="0 0 220 120" preserveAspectRatio="xMidYMid meet">
            <Path
              d="M0 96 C70 88 150 102 220 94"
              stroke={hexToRgba(forestTone, 0.2)}
              strokeWidth={1.2}
              fill="none"
            />
            {trunks.map((x) => (
              <Path
                key={x}
                d={`M${x} 96 L${x} 54`}
                stroke={hexToRgba(forestTone, 0.32)}
                strokeWidth={2}
                strokeLinecap="round"
                fill="none"
              />
            ))}
            <BrownBlob
              cx={72}
              cy={46}
              r={14}
              fill={hexToRgba(sage, 0.18)}
              staticOpacity={0.18}
              driver={swell}
              motionActive={motionActiveSv}
            />
            <BrownBlob
              cx={118}
              cy={40}
              r={18}
              fill={hexToRgba(sage, 0.14)}
              staticOpacity={0.14}
              driver={wave}
              motionActive={motionActiveSv}
            />
            <BrownBlob
              cx={158}
              cy={48}
              r={12}
              fill={hexToRgba(cool, 0.16)}
              staticOpacity={0.16}
              driver={swell}
              motionActive={motionActiveSv}
            />
          </Svg>
        </View>
      </View>
    );
  }

  if (variant === 'melody') {
    const highlight = theme.colors.highlight;
    const clay = theme.colors.clay;
    const surface = theme.colors.surfaceSecondary;

    return (
      <View {...skipA11yNode()} style={styles.frame}>
        <View style={styles.svgWrap}>
          <Svg width="100%" height="100%" viewBox="0 0 220 120" preserveAspectRatio="xMidYMid meet">
            <BrownBlob
              cx={88}
              cy={56}
              r={50}
              fill={hexToRgba(clay, 0.2)}
              staticOpacity={0.2}
              driver={swell}
              motionActive={motionActiveSv}
            />
            <BrownBlob
              cx={132}
              cy={48}
              r={40}
              fill={hexToRgba(highlight, 0.18)}
              staticOpacity={0.18}
              driver={wave}
              motionActive={motionActiveSv}
            />
            <BrownBlob
              cx={108}
              cy={82}
              r={34}
              fill={hexToRgba(highlight, 0.14)}
              staticOpacity={0.14}
              driver={swell}
              motionActive={motionActiveSv}
            />
          </Svg>
        </View>
      </View>
    );
  }

  if (variant === 'white') {
    const lines = [32, 48, 64, 80, 96] as const;

    return (
      <View {...skipA11yNode()} style={styles.frame}>
        <View style={styles.svgWrap}>
          <Svg width="100%" height="100%" viewBox="0 0 220 120" preserveAspectRatio="xMidYMid meet">
            {lines.map((y, index) => (
              <FanWavePath
                key={y}
                d={`M24 ${y} L196 ${y}`}
                width={1}
                stroke={hexToRgba(cool, 0.22)}
                base={0.1 + index * 0.04}
                useWave={index % 2 === 0}
                wave={wave}
                swell={swell}
                motionActive={motionActiveSv}
              />
            ))}
          </Svg>
        </View>
      </View>
    );
  }

  if (variant === 'birds') {
    const sage = theme.colors.secondaryGreen;
    const cool = theme.colors.cool;
    return (
      <View {...skipA11yNode()} style={styles.frame}>
        <View style={styles.svgWrap}>
          <Svg width="100%" height="100%" viewBox="0 0 220 120" preserveAspectRatio="xMidYMid meet">
            <Path
              d="M168 18 L198 28 L192 34 L162 26 Z"
              fill={hexToRgba(sage, 0.22)}
              stroke={hexToRgba(sage, 0.32)}
              strokeWidth={0.8}
            />
            <Path
              d="M178 26 c14 8 28 6 38 -2"
              stroke={hexToRgba(sage, 0.38)}
              strokeWidth={1.2}
              fill="none"
              strokeLinecap="round"
            />
            <BrownBlob
              cx={38}
              cy={33}
              r={5}
              fill={hexToRgba(cool, 0.42)}
              staticOpacity={0.42}
              driver={wave}
              motionActive={motionActiveSv}
            />
            <BrownBlob
              cx={94}
              cy={26}
              r={5.5}
              fill={hexToRgba(sage, 0.38)}
              staticOpacity={0.38}
              driver={swell}
              motionActive={motionActiveSv}
            />
            <BrownBlob
              cx={150}
              cy={37}
              r={4.5}
              fill={hexToRgba(cool, 0.34)}
              staticOpacity={0.34}
              driver={wave}
              motionActive={motionActiveSv}
            />
            <Path
              d="M24 108 L196 108"
              stroke={hexToRgba(sage, 0.12)}
              strokeWidth={1}
              fill="none"
            />
          </Svg>
        </View>
      </View>
    );
  }

  if (variant === 'fan') {
    const cool = theme.colors.cool;
    const sage = theme.colors.secondaryGreen;
    const air = [
      { d: 'M28 24 C52 48 52 72 28 96', width: 1.3, base: 0.42 },
      { d: 'M56 20 C78 44 78 76 56 100', width: 1.5, base: 0.52 },
      { d: 'M84 26 C104 50 104 70 84 94', width: 1.2, base: 0.38 },
      { d: 'M112 22 C132 46 132 74 112 98', width: 1.4, base: 0.48 },
      { d: 'M140 28 C158 50 158 70 140 92', width: 1.15, base: 0.36 },
    ] as const;

    return (
      <View {...skipA11yNode()} style={styles.frame}>
        <View style={styles.svgWrap}>
          <Svg width="100%" height="100%" viewBox="0 0 220 120" preserveAspectRatio="xMidYMid meet">
            {air.map((item, index) => (
              <FanWavePath
                key={item.d}
                d={item.d}
                width={item.width}
                stroke={index % 2 === 0 ? cool : sage}
                base={item.base}
                useWave={index % 2 === 0}
                wave={wave}
                swell={swell}
                motionActive={motionActiveSv}
              />
            ))}
          </Svg>
        </View>
      </View>
    );
  }

  if (variant === 'stream') {
    const cool = theme.colors.cool;
    const sage = theme.colors.secondaryGreen;
    const streams = [
      { d: 'M8 52 C70 38 150 66 212 48', width: 1.5, base: 0.5 },
      { d: 'M12 72 C78 58 142 82 208 68', width: 1.8, base: 0.62 },
      { d: 'M16 92 C82 84 138 98 204 90', width: 1.2, base: 0.38 },
    ] as const;

    return (
      <View {...skipA11yNode()} style={styles.frame}>
        <View style={styles.svgWrap}>
          <Svg width="100%" height="100%" viewBox="0 0 220 120" preserveAspectRatio="xMidYMid meet">
            {streams.map((item, index) => (
              <FanWavePath
                key={item.d}
                d={item.d}
                width={item.width}
                stroke={index % 2 === 0 ? cool : sage}
                base={item.base}
                useWave={index !== 1}
                wave={wave}
                swell={swell}
                motionActive={motionActiveSv}
              />
            ))}
          </Svg>
        </View>
      </View>
    );
  }

  if (variant === 'brown') {
    const clay = theme.colors.clay;
    const highlight = theme.colors.highlight;
    const forest = theme.colors.forest;

    return (
      <View {...skipA11yNode()} style={styles.frame}>
        <View style={styles.svgWrap}>
          <Svg width="100%" height="100%" viewBox="0 0 220 120" preserveAspectRatio="xMidYMid meet">
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
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    maxHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgWrap: {
    width: '100%',
    maxWidth: 320,
    aspectRatio: 220 / 120,
    alignSelf: 'center',
  },
});
