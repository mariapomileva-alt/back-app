import Animated, { useAnimatedProps } from 'react-native-reanimated';
import Svg, { G, Path } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';

import { MarkFrame } from './MarkFrame';
import { markViewBox, strokeRegular } from './markLanguage';
import {
  moveMarkPressureOffset,
  useMoveMarkPressureMotion,
} from './useMoveMarkPressureMotion';

const AnimatedG = Animated.createAnimatedComponent(G);

type ArcSpec = {
  d: string;
  stroke: string;
  width: number;
  baseOpacity: number;
  side: 'left' | 'right';
};

function PressureArc({
  d,
  stroke,
  width,
  baseOpacity,
  side,
  progress,
  motionActive,
}: ArcSpec & {
  progress: ReturnType<typeof useMoveMarkPressureMotion>['progress'];
  motionActive: ReturnType<typeof useMoveMarkPressureMotion>['motionActive'];
}) {
  const animatedProps = useAnimatedProps(() => ({
    opacity: baseOpacity,
    transform: [{ translateX: moveMarkPressureOffset(progress.value, side, motionActive.value) }],
  }));

  return (
    <AnimatedG animatedProps={animatedProps}>
      <Path d={d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" />
    </AnimatedG>
  );
}

/** Gentle inward pressure — opposing organic curves, no central focal dot. */
export function MoveMark() {
  const { theme } = useTheme();
  const { progress, motionActive } = useMoveMarkPressureMotion();
  const primary = theme.colors.markDeep;
  const secondary = theme.colors.markSecondary;
  const strokeMain = strokeRegular + 0.38;

  const arcs: ArcSpec[] = [
    {
      d: 'M32 20 C44 34 44 50 32 54',
      stroke: primary,
      width: strokeMain,
      baseOpacity: 0.88,
      side: 'left',
    },
    {
      d: 'M88 20 C76 34 76 50 88 54',
      stroke: secondary,
      width: strokeMain - 0.08,
      baseOpacity: 0.72,
      side: 'right',
    },
  ];

  return (
    <MarkFrame>
      <Svg width="100%" height="100%" viewBox={markViewBox} preserveAspectRatio="xMidYMid meet">
        {arcs.map((arc) => (
          <PressureArc key={arc.d} {...arc} progress={progress} motionActive={motionActive} />
        ))}
      </Svg>
    </MarkFrame>
  );
}
