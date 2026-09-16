import Animated, { useAnimatedProps } from 'react-native-reanimated';
import Svg, { Circle, G } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';

import { MarkFrame } from './MarkFrame';
import { markIdleMix, markIdleRange, useMarkIdlePhase } from './markIdleMotion';
import { markViewBox } from './markLanguage';

const AnimatedG = Animated.createAnimatedComponent(G);

type BlobSpec = {
  cx: number;
  cy: number;
  r: number;
  color: string;
  baseOpacity: number;
  offset: number;
};

function DriftCircle({
  cx,
  cy,
  r,
  color,
  baseOpacity,
  offset,
  phase,
  motionActive,
}: BlobSpec & {
  phase: ReturnType<typeof useMarkIdlePhase>['phase'];
  motionActive: ReturnType<typeof useMarkIdlePhase>['motionActive'];
}) {
  const animatedProps = useAnimatedProps(() => {
    if (motionActive.value === 0) {
      return { opacity: baseOpacity, transform: [{ translateX: 0 }, { translateY: 0 }] };
    }
    const mix = markIdleMix(phase.value, offset);
    const driftX = markIdleRange(mix, -2.8, 2.8);
    const driftY = markIdleRange(markIdleMix(phase.value, offset + 0.27), -2.2, 2.2);
    return {
      opacity: baseOpacity,
      transform: [{ translateX: driftX }, { translateY: driftY }],
    };
  });

  return (
    <AnimatedG animatedProps={animatedProps}>
      <Circle cx={cx} cy={cy} r={r} fill={color} />
    </AnimatedG>
  );
}

export function DistractMark() {
  const { theme } = useTheme();
  const { phase, motionActive } = useMarkIdlePhase('distract');
  const sage = theme.colors.markSecondary;
  const forest = theme.colors.markPrimary;
  const pale = theme.colors.markMuted;
  const clay = theme.colors.markWarmAccent;

  const blobs: BlobSpec[] = [
    { cx: 41, cy: 39, r: 16, color: sage, baseOpacity: 0.44, offset: 0 },
    { cx: 71, cy: 23, r: 11, color: pale, baseOpacity: 0.72, offset: 0.22 },
    { cx: 87, cy: 45, r: 9, color: forest, baseOpacity: 0.42, offset: 0.41 },
    { cx: 59, cy: 51, r: 7, color: clay, baseOpacity: 0.38, offset: 0.58 },
  ];

  return (
    <MarkFrame>
      <Svg width="100%" height="100%" viewBox={markViewBox} preserveAspectRatio="xMidYMid meet">
        {blobs.map((blob) => (
          <DriftCircle key={`${blob.cx}-${blob.cy}`} {...blob} phase={phase} motionActive={motionActive} />
        ))}
      </Svg>
    </MarkFrame>
  );
}
