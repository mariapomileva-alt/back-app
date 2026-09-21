import Animated, { useAnimatedProps } from 'react-native-reanimated';
import Svg, { Ellipse, G } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';

import { MarkFrame } from './MarkFrame';
import {
  markIdleMix,
  markIdleOpacityRange,
  markIdleScaleRange,
  useMarkIdlePhase,
} from './markIdleMotion';
import { markViewBox } from './markLanguage';

const AnimatedG = Animated.createAnimatedComponent(G);

type RingSpec = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  baseOpacity: number;
  offset: number;
  scaleMin: number;
  scaleMax: number;
  opacityMin: number;
  opacityMax: number;
};

function BreatheRing({
  cx,
  cy,
  rx,
  ry,
  color,
  baseOpacity,
  offset,
  scaleMin,
  scaleMax,
  opacityMin,
  opacityMax,
  phase,
  motionActive,
}: RingSpec & {
  color: string;
  phase: ReturnType<typeof useMarkIdlePhase>['phase'];
  motionActive: ReturnType<typeof useMarkIdlePhase>['motionActive'];
}) {
  const animatedProps = useAnimatedProps(() => {
    if (motionActive.value === 0) {
      return {
        opacity: baseOpacity,
        transform: [
          { translateX: cx },
          { translateY: cy },
          { scale: 1 },
          { translateX: -cx },
          { translateY: -cy },
        ],
      };
    }
    const mix = markIdleMix(phase.value, offset);
    const scale = markIdleScaleRange(mix, scaleMin, scaleMax);
    const opacity = markIdleOpacityRange(mix, opacityMin, opacityMax);
    return {
      opacity,
      transform: [
        { translateX: cx },
        { translateY: cy },
        { scale },
        { translateX: -cx },
        { translateY: -cy },
      ],
    };
  });

  return (
    <AnimatedG animatedProps={animatedProps}>
      <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={color} />
    </AnimatedG>
  );
}

/** Soft tonal breathing mass — offset ellipses, no concentric bullseye. */
export function BreatheMark() {
  const { theme } = useTheme();
  const { phase, motionActive } = useMarkIdlePhase('breathe');
  const core = theme.colors.markPrimary;
  const mid = theme.colors.markSecondary;
  const outer = theme.colors.markMuted;

  const rings: (RingSpec & { color: string })[] = [
    {
      cx: 56,
      cy: 38,
      rx: 30,
      ry: 26,
      color: outer,
      baseOpacity: 0.24,
      offset: 0,
      scaleMin: 0.94,
      scaleMax: 1.08,
      opacityMin: 0.18,
      opacityMax: 0.3,
    },
    {
      cx: 63,
      cy: 35,
      rx: 22,
      ry: 20,
      color: mid,
      baseOpacity: 0.32,
      offset: 0.18,
      scaleMin: 0.95,
      scaleMax: 1.06,
      opacityMin: 0.26,
      opacityMax: 0.38,
    },
    {
      cx: 59,
      cy: 33,
      rx: 14,
      ry: 13,
      color: mid,
      baseOpacity: 0.48,
      offset: 0.36,
      scaleMin: 0.96,
      scaleMax: 1.05,
      opacityMin: 0.4,
      opacityMax: 0.56,
    },
    {
      cx: 61,
      cy: 32,
      rx: 8,
      ry: 7.5,
      color: core,
      baseOpacity: 0.72,
      offset: 0.52,
      scaleMin: 0.97,
      scaleMax: 1.04,
      opacityMin: 0.64,
      opacityMax: 0.8,
    },
  ];

  return (
    <MarkFrame>
      <Svg width="100%" height="100%" viewBox={markViewBox} preserveAspectRatio="xMidYMid meet">
        {rings.map((ring) => (
          <BreatheRing
            key={`${ring.cx}-${ring.cy}`}
            {...ring}
            phase={phase}
            motionActive={motionActive}
          />
        ))}
      </Svg>
    </MarkFrame>
  );
}
