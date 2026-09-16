import Animated, { useAnimatedProps } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';

import { MarkFrame } from './MarkFrame';
import { markIdleMix, markIdleRange, useMarkIdlePhase } from './markIdleMotion';
import { markViewBox } from './markLanguage';

const AnimatedPath = Animated.createAnimatedComponent(Path);

type WaveSpec = {
  d: string;
  color: string;
  baseOpacity: number;
  width: number;
  offset: number;
};

function SwayWave({
  d,
  color,
  baseOpacity,
  width,
  offset,
  phase,
  motionActive,
}: WaveSpec & {
  phase: ReturnType<typeof useMarkIdlePhase>['phase'];
  motionActive: ReturnType<typeof useMarkIdlePhase>['motionActive'];
}) {
  const animatedProps = useAnimatedProps(() => {
    if (motionActive.value === 0) {
      return { opacity: baseOpacity, transform: [{ translateX: 0 }, { translateY: 0 }] };
    }
    const mix = markIdleMix(phase.value, offset);
    const sway = markIdleMix(phase.value, offset + 0.19);
    return {
      opacity: markIdleRange(mix, baseOpacity - 0.08, baseOpacity + 0.1),
      transform: [{ translateX: markIdleRange(sway, -1.8, 1.8) }, { translateY: markIdleRange(mix, -0.8, 0.8) }],
    };
  });

  return (
    <AnimatedPath
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      animatedProps={animatedProps}
    />
  );
}

export function ListenMark() {
  const { theme } = useTheme();
  const { phase, motionActive } = useMarkIdlePhase('listen');
  const cool = theme.colors.markLine;
  const sage = theme.colors.markSecondary;

  const waves: WaveSpec[] = [
    { d: 'M18 18 C36 12 52 24 70 18 S100 12 106 18', color: cool, baseOpacity: 0.4, width: 1.05, offset: 0 },
    { d: 'M14 30 C38 22 56 38 78 30 S106 24 110 30', color: sage, baseOpacity: 0.68, width: 1.48, offset: 0.2 },
    { d: 'M16 42 C40 36 58 48 80 42 S104 38 108 42', color: cool, baseOpacity: 0.44, width: 1.15, offset: 0.38 },
    { d: 'M20 54 C40 50 58 60 76 54 S96 50 100 54', color: sage, baseOpacity: 0.4, width: 1.1, offset: 0.55 },
  ];

  return (
    <MarkFrame>
      <Svg width="100%" height="100%" viewBox={markViewBox} preserveAspectRatio="xMidYMid meet">
        {waves.map((wave) => (
          <SwayWave key={wave.d} {...wave} phase={phase} motionActive={motionActive} />
        ))}
      </Svg>
    </MarkFrame>
  );
}
