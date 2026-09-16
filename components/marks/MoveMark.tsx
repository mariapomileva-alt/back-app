import Animated, { useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Circle, G, Path } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';

import { MarkFrame } from './MarkFrame';
import { markIdleMix, markIdleRange, useMarkIdlePhase } from './markIdleMotion';
import { markViewBox, strokeRegular } from './markLanguage';

const AnimatedG = Animated.createAnimatedComponent(G);

type ArcSpec = {
  d: string;
  stroke: string;
  width: number;
  baseOpacity: number;
  side: 'left' | 'right';
  offset: number;
};

function FloatArc({
  d,
  stroke,
  width,
  baseOpacity,
  side,
  offset,
  phase,
  motionActive,
}: ArcSpec & {
  phase: ReturnType<typeof useMarkIdlePhase>['phase'];
  motionActive: ReturnType<typeof useMarkIdlePhase>['motionActive'];
}) {
  const animatedProps = useAnimatedProps(() => {
    if (motionActive.value === 0) {
      return { opacity: baseOpacity, transform: [{ translateX: 0 }, { translateY: 0 }] };
    }
    const mix = markIdleMix(phase.value, offset);
    const driftX = markIdleRange(mix, side === 'left' ? -2.6 : 2.6, side === 'left' ? 1.8 : -1.8);
    const driftY = markIdleRange(markIdleMix(phase.value, offset + 0.31), -2.4, 2.8);
    return {
      opacity: baseOpacity,
      transform: [{ translateX: driftX }, { translateY: driftY }],
    };
  });

  return (
    <AnimatedG animatedProps={animatedProps}>
      <Path d={d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" />
    </AnimatedG>
  );
}

/** Compact compression — two short organic arcs facing inward. */
export function MoveMark() {
  const { theme } = useTheme();
  const { phase, motionActive } = useMarkIdlePhase('move');
  const primary = theme.colors.markPrimary;
  const sage = theme.colors.markSecondary;

  const shellStyle = useAnimatedStyle(() => {
    if (motionActive.value === 0) {
      return {};
    }
    const mix = markIdleMix(phase.value, 0.12);
    return {
      transform: [
        { translateX: markIdleRange(mix, -2, 2) },
        { translateY: markIdleRange(markIdleMix(phase.value, 0.4), -1.5, 1.5) },
      ],
    };
  });

  const arcs: ArcSpec[] = [
    {
      d: 'M34 22 C46 36 46 48 34 52',
      stroke: primary,
      width: strokeRegular + 0.15,
      baseOpacity: 0.82,
      side: 'left',
      offset: 0,
    },
    {
      d: 'M86 22 C74 36 74 48 86 52',
      stroke: sage,
      width: strokeRegular,
      baseOpacity: 0.62,
      side: 'right',
      offset: 0.38,
    },
  ];

  return (
    <MarkFrame>
      <Animated.View style={[{ flex: 1, width: '100%' }, shellStyle]}>
        <Svg width="100%" height="100%" viewBox={markViewBox} preserveAspectRatio="xMidYMid meet">
          {arcs.map((arc) => (
            <FloatArc key={arc.d} {...arc} phase={phase} motionActive={motionActive} />
          ))}
          <Circle cx="60" cy="37" r="2.2" fill={primary} opacity={0.45} />
        </Svg>
      </Animated.View>
    </MarkFrame>
  );
}
